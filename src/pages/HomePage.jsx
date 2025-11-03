import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ProductGrid from "@/components/organisms/ProductGrid";
import ProductModal from "@/components/organisms/ProductModal";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import { wishlistService } from "@/services/api/wishlistService";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const categories = [...new Set(products.map(p => p.category))];
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCartItems(cartData);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const loadWishlist = async () => {
    try {
      const wishlistData = await wishlistService.getAll();
      setWishlistItems(wishlistData);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
  };
  useEffect(() => {
loadProducts();
    loadCart();
    loadWishlist();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = async (product) => {
    try {
      await cartService.addItem(product.Id, 1, product.price);
      await loadCart();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart");
    }
  };
const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleToggleWishlist = async (productId) => {
    try {
      const updatedWishlist = await wishlistService.toggle(productId);
      setWishlistItems(updatedWishlist);
      const isWishlisted = updatedWishlist.includes(productId);
      toast.success(isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      toast.error('Failed to update wishlist');
    }
  };
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header 
        cartItemCount={cartItemCount}
        onSearch={handleSearch}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent mb-4">
            Shop Smarter, Shop Faster
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing products with lightning-fast checkout and free shipping on orders over $50
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            
            {(selectedCategory !== "all" || searchTerm) && (
              <Button variant="ghost" onClick={handleClearFilters} size="sm">
                <ApperIcon name="X" size={16} className="mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && (
              <span> for "{searchTerm}"</span>
            )}
            {selectedCategory !== "all" && (
              <span> in {selectedCategory}</span>
            )}
          </p>
        </div>

        {/* Product Grid */}
<ProductGrid
          products={filteredProducts}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          onToggleWishlist={handleToggleWishlist}
          wishlistItems={wishlistItems}
          onRetry={loadProducts}
          onBrowseProducts={handleClearFilters}
        />

        {/* Product Modal */}
<ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistItems={wishlistItems}
        />
      </main>
    </div>
  );
};

export default HomePage;