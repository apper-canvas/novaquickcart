import { toast } from "react-toastify";

const CART_KEY = "quickcart_cart";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cartService = {
  async getCart() {
    try {
      await delay(200);
      const cartData = localStorage.getItem(CART_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error getting cart:", error.message);
      toast.error("Failed to load cart");
      return [];
    }
  },

  async addItem(productId, quantity = 1, priceAtAdd) {
    try {
      await delay(250);
      const cart = await this.getCart();
      const existingItem = cart.find(item => item.productId === productId.toString());
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          productId: productId.toString(),
          quantity,
          priceAtAdd
        });
      }
      
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      toast.success("Item added to cart");
      return cart;
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      toast.error("Failed to add item to cart");
      return [];
    }
  },

  async updateQuantity(productId, newQuantity) {
    try {
      await delay(200);
      const cart = await this.getCart();
      const itemIndex = cart.findIndex(item => item.productId === productId.toString());
      
      if (itemIndex === -1) {
        toast.error("Item not found in cart");
        throw new Error("Item not found in cart");
      }
      
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
        toast.success("Item removed from cart");
      } else {
        cart[itemIndex].quantity = newQuantity;
        toast.success("Cart updated");
      }
      
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error("Error updating cart quantity:", error.message);
      toast.error("Failed to update cart");
      return [];
    }
  },

  async removeItem(productId) {
    try {
      await delay(200);
      const cart = await this.getCart();
      const filteredCart = cart.filter(item => item.productId !== productId.toString());
      localStorage.setItem(CART_KEY, JSON.stringify(filteredCart));
      toast.success("Item removed from cart");
      return filteredCart;
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      toast.error("Failed to remove item");
      return [];
    }
  },

  async clearCart() {
    try {
      await delay(200);
      localStorage.removeItem(CART_KEY);
      toast.success("Cart cleared");
      return [];
    } catch (error) {
      console.error("Error clearing cart:", error.message);
      toast.error("Failed to clear cart");
      return [];
    }
  },

  async getItemCount() {
    try {
      await delay(150);
      const cart = await this.getCart();
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error("Error getting cart item count:", error.message);
      return 0;
    }
  },

  async getTotal() {
    try {
      await delay(150);
      const cart = await this.getCart();
      return cart.reduce((sum, item) => sum + (item.quantity * item.priceAtAdd), 0);
    } catch (error) {
      console.error("Error calculating cart total:", error.message);
      return 0;
    }
  }
};