import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { orderService } from "@/services/api/orderService";
import { productService } from "@/services/api/productService";
import { format } from "date-fns";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrderDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const [orderData, productData] = await Promise.all([
        orderService.getById(parseInt(orderId)),
        productService.getAll()
      ]);
      setOrder(orderData);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} />
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} />
        <Error 
          message="Order not found or failed to load order details" 
          onRetry={() => navigate("/orders")} 
        />
      </div>
    );
  }

  const estimatedDelivery = new Date(order.orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={0} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <ApperIcon name="Check" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-secondary">
                Order Details
              </h2>
              <Badge variant="success">{order.status}</Badge>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-lg font-mono font-semibold text-secondary">
                  #{order.Id.toString().padStart(6, "0")}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-secondary">
                  {format(new Date(order.orderDate), "MMMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-medium text-secondary">
                  {format(estimatedDelivery, "EEEE, MMMM dd, yyyy")}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="primary" onClick={() => navigate("/orders")} className="flex-1">
                <ApperIcon name="Package" size={16} className="mr-2" />
                View All Orders
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")} className="flex-1">
                <ApperIcon name="ShoppingBag" size={16} className="mr-2" />
                Continue Shopping
              </Button>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-8">
            <h3 className="text-xl font-semibold text-secondary mb-6">
              Shipping Address
            </h3>
            
            <div className="space-y-2">
              <p className="font-medium text-secondary">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Truck" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Free Standard Shipping</p>
                  <p className="text-sm text-gray-600">
                    Your order will be delivered in 3-5 business days. You'll receive tracking information via email once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="p-8 mt-8">
          <h3 className="text-xl font-semibold text-secondary mb-6">
            Order Items ({order.items.length} {order.items.length === 1 ? "item" : "items"})
          </h3>
          
          <div className="space-y-4">
            {order.items.map((item) => {
              const product = products.find(p => p.Id === parseInt(item.productId));
              return (
                <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={product?.imageUrl}
                    alt={product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-secondary truncate">
                      {product?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ${item.priceAtPurchase.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  
                  <p className="font-semibold text-secondary">
                    ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Questions about your order? We're here to help!
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <ApperIcon name="Mail" size={16} className="mr-2 text-primary" />
              support@quickcart.com
            </div>
            <div className="flex items-center">
              <ApperIcon name="Phone" size={16} className="mr-2 text-primary" />
              1-800-QUICKCART
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;