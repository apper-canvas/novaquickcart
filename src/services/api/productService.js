import { toast } from "react-toastify";

export const productService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "imageUrl_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "specifications_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || product.Name || '',
        category: product.category_c || '',
        description: product.description_c || '',
        imageUrl: product.imageUrl_c || '',
        inStock: product.in_stock_c || false,
        price: product.price_c || 0,
        specifications: product.specifications_c ? (typeof product.specifications_c === 'string' ? JSON.parse(product.specifications_c || '{}') : product.specifications_c) : {}
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "imageUrl_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "specifications_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('product_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (!response.data) {
        throw new Error("Product not found");
      }
      
      // Map database fields to UI expected format
      const product = response.data;
      return {
        Id: product.Id,
        name: product.name_c || product.Name || '',
        category: product.category_c || '',
        description: product.description_c || '',
        imageUrl: product.imageUrl_c || '',
        inStock: product.in_stock_c || false,
        price: product.price_c || 0,
        specifications: product.specifications_c ? (typeof product.specifications_c === 'string' ? JSON.parse(product.specifications_c || '{}') : product.specifications_c) : {}
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error.message);
      throw new Error("Product not found");
    }
  },

  async getByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "imageUrl_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "specifications_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}]
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || product.Name || '',
        category: product.category_c || '',
        description: product.description_c || '',
        imageUrl: product.imageUrl_c || '',
        inStock: product.in_stock_c || false,
        price: product.price_c || 0,
        specifications: product.specifications_c ? (typeof product.specifications_c === 'string' ? JSON.parse(product.specifications_c || '{}') : product.specifications_c) : {}
      }));
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async create(productData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: productData.name || '',
          name_c: productData.name || '',
          category_c: productData.category || '',
          description_c: productData.description || '',
          imageUrl_c: productData.imageUrl || '',
          in_stock_c: productData.inStock || false,
          price_c: productData.price || 0,
          specifications_c: JSON.stringify(productData.specifications || {})
        }]
      };
      
      const response = await apperClient.createRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const product = successful[0].data;
          return {
            Id: product.Id,
            name: product.name_c || product.Name || '',
            category: product.category_c || '',
            description: product.description_c || '',
            imageUrl: product.imageUrl_c || '',
            inStock: product.in_stock_c || false,
            price: product.price_c || 0,
            specifications: product.specifications_c ? JSON.parse(product.specifications_c || '{}') : {}
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async update(id, productData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateFields = {
        Id: id
      };
      
      if (productData.name !== undefined) {
        updateFields.Name = productData.name;
        updateFields.name_c = productData.name;
      }
      if (productData.category !== undefined) updateFields.category_c = productData.category;
      if (productData.description !== undefined) updateFields.description_c = productData.description;
      if (productData.imageUrl !== undefined) updateFields.imageUrl_c = productData.imageUrl;
      if (productData.inStock !== undefined) updateFields.in_stock_c = productData.inStock;
      if (productData.price !== undefined) updateFields.price_c = productData.price;
      if (productData.specifications !== undefined) updateFields.specifications_c = JSON.stringify(productData.specifications);
      
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const product = successful[0].data;
          return {
            Id: product.Id,
            name: product.name_c || product.Name || '',
            category: product.category_c || '',
            description: product.description_c || '',
            imageUrl: product.imageUrl_c || '',
            inStock: product.in_stock_c || false,
            price: product.price_c || 0,
            specifications: product.specifications_c ? JSON.parse(product.specifications_c || '{}') : {}
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error.message);
      throw new Error("Product not found");
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = { 
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error.message);
      throw new Error("Product not found");
    }
  }
};