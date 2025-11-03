import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import CartItem from "@/components/molecules/CartItem";
import CartSummary from "@/components/organisms/CartSummary";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cartService } from "@/services/api/cartService";
import { productService } from "@/services/api/productService";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.priceAtAdd), 0);

  const loadCart = async () => {
    setLoading(true);
    setError("");
    try {
      const [cartData, productData] = await Promise.all([
        cartService.getCart(),
        productService.getAll()
      ]);
      setCartItems(cartData);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await cartService.updateQuantity(productId, newQuantity);
      await loadCart();
      toast.success("Cart updated");
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.removeItem(productId);
      await loadCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header cartItemCount={0} />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header cartItemCount={0} />
        <Error message={error} onRetry={loadCart} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header cartItemCount={0} />
        <Empty
          title="Your cart is empty"
          message="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
          action={handleContinueShopping}
          actionLabel="Start Shopping"
          icon="ShoppingCart"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header cartItemCount={cartItemCount} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItemCount} {cartItemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = products.find(p => p.Id === parseInt(item.productId));
              return (
                <CartItem
                  key={item.productId}
                  item={item}
                  product={product}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              );
            })}
          </div>

          {/* Cart Summary */}
          <div>
            <CartSummary
              items={cartItems}
              total={cartTotal}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;