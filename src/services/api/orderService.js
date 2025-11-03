import { toast } from "react-toastify";

export const orderService = {
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
          {"field": {"Name": "billing_info_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}}
        ],
        orderBy: [{"fieldName": "order_date_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      return response.data.map(order => ({
        Id: order.Id,
        billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c || '{}') : {},
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c || '{}') : {},
        items: order.items_c ? JSON.parse(order.items_c || '[]') : [],
        orderDate: order.order_date_c || new Date().toISOString(),
        status: order.status_c || 'Confirmed',
        total: order.total_c || 0
      }));
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "billing_info_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('order_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (!response.data) {
        throw new Error("Order not found");
      }
      
      // Map database fields to UI expected format
      const order = response.data;
      return {
        Id: order.Id,
        billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c || '{}') : {},
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c || '{}') : {},
        items: order.items_c ? JSON.parse(order.items_c || '[]') : [],
        orderDate: order.order_date_c || new Date().toISOString(),
        status: order.status_c || 'Confirmed',
        total: order.total_c || 0
      };
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error.message);
      throw new Error("Order not found");
    }
  },

  async create(orderData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const orderDate = new Date().toISOString();
      
      const params = {
        records: [{
          Name: `Order ${Date.now()}`,
          billing_info_c: JSON.stringify(orderData.billingInfo || {}),
          shipping_address_c: JSON.stringify(orderData.shippingAddress || {}),
          items_c: JSON.stringify(orderData.items || []),
          order_date_c: orderDate,
          status_c: 'Confirmed',
          total_c: orderData.total || 0
        }]
      };
      
      const response = await apperClient.createRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const order = successful[0].data;
          return {
            Id: order.Id,
            billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c || '{}') : {},
            shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c || '{}') : {},
            items: order.items_c ? JSON.parse(order.items_c || '[]') : [],
            orderDate: order.order_date_c || orderDate,
            status: order.status_c || 'Confirmed',
            total: order.total_c || 0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async updateStatus(id, status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: id,
          status_c: status
        }]
      };
      
      const response = await apperClient.updateRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const order = successful[0].data;
          return {
            Id: order.Id,
            billingInfo: order.billing_info_c ? JSON.parse(order.billing_info_c || '{}') : {},
            shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c || '{}') : {},
            items: order.items_c ? JSON.parse(order.items_c || '[]') : [],
            orderDate: order.order_date_c || new Date().toISOString(),
            status: order.status_c || status,
            total: order.total_c || 0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data?.message || error.message);
      throw new Error("Order not found");
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
      
      const response = await apperClient.deleteRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error.message);
      throw new Error("Order not found");
    }
  }
};