import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found", 
  message = "Try adjusting your search or browse our categories",
  action,
  actionLabel = "Browse Products",
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-secondary mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      {action && (
        <Button onClick={action} variant="primary" size="lg">
          <ApperIcon name="ShoppingBag" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;