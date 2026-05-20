const CustomerModel = require('../models/customerModel');
const { sendEvent } = require('../config/queue');

const CustomerController = {
  createCustomer: async (req, res) => {
    const { userId, fullname, phone, address } = req.body;
    if (!userId || !fullname || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    try {
      const customerId = await CustomerModel.create(userId, fullname, phone, address);
      
      await sendEvent('customer_queue', {
        event: 'customer_created',
        customerId,
        userId,
        fullname,
        timestamp: new Date()
      });
      
      res.status(201).json({ message: 'Customer created successfully', customerId });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Error creating customer' });
    }
  },
  getCustomerById: async (req, res) => {
    const { id } = req.params;
    try {
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.status(200).json(customer);
    } catch (error) {
      console.error('Error getting customer:', error);
      res.status(500).json({ message: 'Error getting customer' });
    }
  },
  updateCustomer: async (req, res) => {
    const { id } = req.params;
    const { fullname, phone, address } = req.body;
    try {
      const affectedRows = await CustomerModel.update(id, fullname, phone, address);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      await sendEvent('customer_queue', {
        event: 'customer_updated',
        customerId: id,
        fullname,
        timestamp: new Date()
      });
      
      res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ message: 'Error updating customer' });
    }
  },
  deleteCustomer: async (req, res) => {
    const { id } = req.params;
    try {
      const affectedRows = await CustomerModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      await sendEvent('customer_queue', {
        event: 'customer_deleted',
        customerId: id,
        timestamp: new Date()
      });
      
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Error deleting customer' });
    }
  },
  getAllCustomers: async (req, res) => {
    try {
      const customers = await CustomerModel.getAll();
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error getting all customers:', error);
      res.status(500).json({ message: 'Error getting all customers' });
    }
  }
};
module.exports = CustomerController;