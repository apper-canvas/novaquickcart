import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CartSummary = ({ items, total, onCheckout }) => {
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = total > 50 ? 0 : 5.99;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  return (
    <Card className="p-6 sticky top-24">
      <h3 className="text-xl font-semibold text-secondary mb-4">
        Order Summary
      </h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Items ({itemCount})</span>
          <span>${total.toFixed(2)}</span>
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
      
      <div className="space-y-3">
        <Button 
          variant="accent" 
          size="lg" 
          className="w-full"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          <ApperIcon name="CreditCard" size={18} className="mr-2" />
          Proceed to Checkout
        </Button>
        
        <Button 
          variant="ghost" 
          size="md" 
          className="w-full"
          onClick={() => navigate("/")}
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Continue Shopping
        </Button>
      </div>
    </Card>
  );
};

export default CartSummary;