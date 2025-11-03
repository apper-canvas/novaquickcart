import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { orderService } from "@/services/api/orderService";
import { cartService } from "@/services/api/cartService";
import { format } from "date-fns";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersData, cartData] = await Promise.all([
        orderService.getAll(),
        cartService.getCart()
      ]);
      setOrders(ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      setCartItems(cartData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "processing":
        return "warning";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Check";
      case "processing":
        return "Clock";
      case "shipped":
        return "Truck";
      case "delivered":
        return "PackageCheck";
      case "cancelled":
        return "X";
      default:
        return "Package";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header cartItemCount={cartItemCount} />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header cartItemCount={cartItemCount} />
        <Error message={error} onRetry={loadOrders} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header cartItemCount={cartItemCount} />
        <Empty
          title="No orders yet"
          message="You haven't placed any orders yet. Start shopping to see your order history here!"
          action={() => navigate("/")}
          actionLabel="Start Shopping"
          icon="Package"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header cartItemCount={cartItemCount} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Your Orders</h1>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? "order" : "orders"} total
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.Id} className="p-6 hover:shadow-card-hover transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-secondary">
                      Order #{order.Id.toString().padStart(6, "0")}
                    </h3>
                    <Badge variant={getStatusVariant(order.status)}>
                      <ApperIcon name={getStatusIcon(order.status)} size={12} className="mr-1" />
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {format(new Date(order.orderDate), "MMMM dd, yyyy 'at' h:mm a")}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/order-confirmation/${order.Id}`)}
                  >
                    <ApperIcon name="Eye" size={16} className="mr-1" />
                    View Details
                  </Button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-secondary mb-3">Items in this order:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div key={index} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600 truncate">
                        Product #{item.productId}
                      </div>
                      <div className="text-sm font-medium">
                        Qty: {item.quantity}
                      </div>
                      <div className="text-xs text-gray-600">
                        ${item.priceAtPurchase.toFixed(2)} each
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="text-center p-2 bg-gray-50 rounded flex items-center justify-center">
                      <span className="text-sm text-gray-600">
                        +{order.items.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-secondary mb-2">Shipping to:</h4>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {" "}
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {" "}
                  {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Button variant="primary" size="lg" onClick={() => navigate("/")}>
            <ApperIcon name="ShoppingBag" size={18} className="mr-2" />
            Continue Shopping
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;