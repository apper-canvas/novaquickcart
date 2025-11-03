import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CartItem = ({ item, product, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(0, item.quantity + change);
    if (newQuantity === 0) {
      onRemove(item.productId);
    } else {
      onUpdateQuantity(item.productId, newQuantity);
    }
  };

  const subtotal = item.quantity * item.priceAtAdd;

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-card">
      <img
        src={product?.imageUrl}
        alt={product?.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-secondary truncate">
          {product?.name}
        </h4>
        <p className="text-sm text-gray-600">
          ${item.priceAtAdd.toFixed(2)} each
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleQuantityChange(-1)}
          className="w-8 h-8 p-0"
        >
          <ApperIcon name="Minus" size={14} />
        </Button>
        
        <span className="w-8 text-center font-medium">
          {item.quantity}
        </span>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleQuantityChange(1)}
          className="w-8 h-8 p-0"
        >
          <ApperIcon name="Plus" size={14} />
        </Button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-secondary">
          ${subtotal.toFixed(2)}
        </p>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove(item.productId)}
          className="text-error hover:text-error mt-1 p-0 h-auto"
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;