import { toast } from "react-toastify";

const WISHLIST_KEY = 'quickcart-wishlist';

class WishlistService {
  constructor() {
    this.wishlistItems = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load wishlist from storage:', error);
      toast.error('Failed to load wishlist');
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.error('Failed to save wishlist to storage:', error);
      toast.error('Failed to save wishlist');
    }
  }

  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return [...this.wishlistItems];
    } catch (error) {
      console.error('Error getting wishlist:', error.message);
      toast.error('Failed to load wishlist');
      return [];
    }
  }

  async add(productId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!this.wishlistItems.includes(productId)) {
        this.wishlistItems.push(productId);
        this.saveToStorage();
        toast.success('Added to wishlist');
      }
      return [...this.wishlistItems];
    } catch (error) {
      console.error('Error adding to wishlist:', error.message);
      toast.error('Failed to add to wishlist');
      return [...this.wishlistItems];
    }
  }

  async remove(productId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.wishlistItems = this.wishlistItems.filter(id => id !== productId);
      this.saveToStorage();
      toast.success('Removed from wishlist');
      return [...this.wishlistItems];
    } catch (error) {
      console.error('Error removing from wishlist:', error.message);
      toast.error('Failed to remove from wishlist');
      return [...this.wishlistItems];
    }
  }

  async toggle(productId) {
    try {
      const isWishlisted = this.wishlistItems.includes(productId);
      return isWishlisted ? this.remove(productId) : this.add(productId);
    } catch (error) {
      console.error('Error toggling wishlist:', error.message);
      toast.error('Failed to update wishlist');
      return [...this.wishlistItems];
    }
  }
}

export const wishlistService = new WishlistService();