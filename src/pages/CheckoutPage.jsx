import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import CheckoutForm from "@/components/organisms/CheckoutForm";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cartService } from "@/services/api/cartService";
import { productService } from "@/services/api/productService";
import { orderService } from "@/services/api/orderService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.priceAtAdd), 0);
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  const loadCheckoutData = async () => {
    setLoading(true);
    setError("");
    try {
      const [cartData, productData] = await Promise.all([
        cartService.getCart(),
        productService.getAll()
      ]);
      
      if (cartData.length === 0) {
        navigate("/cart");
        return;
      }
      
      setCartItems(cartData);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckoutData();
  }, [navigate]);

  const handleSubmitOrder = async (formData) => {
    setSubmitLoading(true);
    try {
      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtAdd
        })),
        total: finalTotal,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        billingInfo: {
          email: formData.email,
          phone: formData.phone,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZip
        },
        paymentInfo: {
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiryDate: formData.expiryDate,
          nameOnCard: formData.nameOnCard
        }
      };

      const order = await orderService.create(orderData);
      
      // Clear cart
      await cartService.clearCart();
      
      // Navigate to confirmation
      navigate(`/order-confirmation/${order.Id}`);
      
      toast.success("Order placed successfully!");
      
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order submission error:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} />
        <Loading type="checkout" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} />
        <Error message={error} onRetry={loadCheckoutData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onSubmit={handleSubmitOrder} loading={submitLoading} />
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-secondary mb-6">
                Order Summary
              </h3>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const product = products.find(p => p.Id === parseInt(item.productId));
                  return (
                    <div key={item.productId} className="flex items-center space-x-3">
                      <img
                        src={product?.imageUrl}
                        alt={product?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary truncate">
                          {product?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.priceAtAdd.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-secondary">
                        ${(item.priceAtAdd * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                {shipping === 0 && (
                  <div className="text-sm text-success font-medium">
                    🎉 Free shipping on orders over $50!
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-secondary">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;