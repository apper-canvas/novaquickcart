import orderData from "@/services/mockData/orders.json";

let orders = [...orderData];
const ORDER_KEY = "quickcart_orders";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize orders from localStorage if available
const savedOrders = localStorage.getItem(ORDER_KEY);
if (savedOrders) {
  orders = JSON.parse(savedOrders);
}

const saveToStorage = () => {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
};

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders];
  },

  async getById(id) {
    await delay(250);
    const order = orders.find(o => o.Id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(orderData) {
    await delay(400);
    const newOrder = {
      ...orderData,
      Id: Math.max(...orders.map(o => o.Id), 0) + 1,
      status: "Confirmed",
      orderDate: new Date().toISOString()
    };
    orders.unshift(newOrder);
    saveToStorage();
    return { ...newOrder };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    orders[index].status = status;
    saveToStorage();
    return { ...orders[index] };
  },

  async delete(id) {
    await delay(300);
    const index = orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    orders.splice(index, 1);
    saveToStorage();
    return true;
  }
};