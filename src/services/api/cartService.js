const CART_KEY = "quickcart_cart";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cartService = {
  async getCart() {
    await delay(200);
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
  },

  async addItem(productId, quantity = 1, priceAtAdd) {
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
    return cart;
  },

  async updateQuantity(productId, newQuantity) {
    await delay(200);
    const cart = await this.getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId.toString());
    
    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }
    
    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = newQuantity;
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  },

  async removeItem(productId) {
    await delay(200);
    const cart = await this.getCart();
    const filteredCart = cart.filter(item => item.productId !== productId.toString());
    localStorage.setItem(CART_KEY, JSON.stringify(filteredCart));
    return filteredCart;
  },

  async clearCart() {
    await delay(200);
    localStorage.removeItem(CART_KEY);
    return [];
  },

  async getItemCount() {
    await delay(150);
    const cart = await this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  async getTotal() {
    await delay(150);
    const cart = await this.getCart();
    return cart.reduce((sum, item) => sum + (item.quantity * item.priceAtAdd), 0);
  }
};