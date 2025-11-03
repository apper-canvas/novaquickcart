import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const ProductModal = ({ product, isOpen, onClose, onAddToCart, onToggleWishlist, wishlistItems }) => {
  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="relative">
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <ApperIcon name="X" size={16} />
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="error" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 left-4">
<Badge variant="primary">{product.category}</Badge>
                <button
                  onClick={() => onToggleWishlist(product.Id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={wishlistItems?.includes(product.Id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <ApperIcon 
                    name="Heart" 
                    size={20} 
                    className={wishlistItems?.includes(product.Id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'} 
                  />
                </button>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-4">
                  {product.name}
                </h2>
                
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6">
                  ${product.price.toFixed(2)}
                </div>
                
                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                {/* Specifications */}
                {product.specifications && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-secondary mb-4">
                      Specifications
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-gray-200 pb-2 last:border-b-0">
                          <span className="font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add to Cart Button */}
              <div className="space-y-4">
                <Button
                  variant={product.inStock ? "accent" : "ghost"}
                  size="xl"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {product.inStock ? (
                    <>
                      <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                      Add to Cart - ${product.price.toFixed(2)}
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </Button>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ApperIcon name="Truck" size={16} className="mr-1" />
                    Free shipping over $50
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="RotateCcw" size={16} className="mr-1" />
                    30-day returns
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Shield" size={16} className="mr-1" />
                    1-year warranty
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductModal;