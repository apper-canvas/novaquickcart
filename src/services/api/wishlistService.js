// Mock wishlist service following the established service pattern
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
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.error('Failed to save wishlist to storage:', error);
    }
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.wishlistItems];
  }

  async add(productId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!this.wishlistItems.includes(productId)) {
      this.wishlistItems.push(productId);
      this.saveToStorage();
    }
    return [...this.wishlistItems];
  }

  async remove(productId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    this.wishlistItems = this.wishlistItems.filter(id => id !== productId);
    this.saveToStorage();
    return [...this.wishlistItems];
  }

  async toggle(productId) {
    const isWishlisted = this.wishlistItems.includes(productId);
    return isWishlisted ? this.remove(productId) : this.add(productId);
  }
}

export const wishlistService = new WishlistService();