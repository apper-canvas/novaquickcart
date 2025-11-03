import productData from "@/services/mockData/products.json";

let products = [...productData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...products];
  },

  async getById(id) {
    await delay(200);
    const product = products.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async getByCategory(category) {
    await delay(250);
    return products.filter(p => p.category === category).map(p => ({ ...p }));
  },

  async create(productData) {
    await delay(300);
    const newProduct = {
      ...productData,
      Id: Math.max(...products.map(p => p.Id)) + 1
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(300);
    const index = products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    products[index] = { ...products[index], ...productData };
    return { ...products[index] };
  },

  async delete(id) {
    await delay(300);
    const index = products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    products.splice(index, 1);
    return true;
  }
};