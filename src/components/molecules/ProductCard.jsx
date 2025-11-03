import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ProductCard = ({ product, onAddToCart, onViewDetails, onToggleWishlist, isWishlisted }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Card 
      hover={true} 
      className="group overflow-hidden"
      onClick={() => onViewDetails(product)}
    >
<div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="error">Out of Stock</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge variant="primary">{product.category}</Badge>
        </div>
        <div className="absolute top-3 left-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.Id);
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <ApperIcon 
              name="Heart" 
              size={16} 
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} 
            />
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-secondary line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          
          <Button
            size="sm"
            variant={product.inStock ? "accent" : "ghost"}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="min-w-[100px]"
          >
            {product.inStock ? (
              <>
                <ApperIcon name="ShoppingCart" size={16} className="mr-1" />
                Add to Cart
              </>
            ) : (
              "Out of Stock"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;