import React from "react";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onAddToCart, 
  onViewDetails,
  onToggleWishlist,
  wishlistItems,
  onRetry,
  onBrowseProducts 
}) => {
  if (loading) {
    return <Loading type="products" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load products. Please try again." 
        onRetry={onRetry} 
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <Empty
        title="No products found"
        message="We couldn't find any products matching your search. Try adjusting your filters or browse our categories."
        action={onBrowseProducts}
        actionLabel="Browse All Products"
        icon="Package"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{products.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistItems.includes(product.Id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;