const TransactionModel = require('../models/transactionModel');
const { sendEvent } = require('../config/queue');

const TransactionController = {
  createTransaction: async (req, res) => {
    const { customerId, productId, quantity, totalPrice, status } = req.body;
    if (!customerId || !productId || !quantity || !totalPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    try {
      const transactionId = await TransactionModel.create(customerId, productId, quantity, totalPrice, status || 'pending');
      
      await sendEvent('transaction_queue', {
        event: 'transaction_created',
        transactionId,
        customerId,
        productId,
        quantity,
        totalPrice,
        status: status || 'pending',
        timestamp: new Date()
      });
      
      res.status(201).json({ message: 'Transaction created successfully', transactionId });
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ message: 'Error creating transaction' });
    }
  },
  getTransactionById: async (req, res) => {
    const { id } = req.params;
    try {
      const transaction = await TransactionModel.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.status(200).json(transaction);
    } catch (error) {
      console.error('Error getting transaction:', error);
      res.status(500).json({ message: 'Error getting transaction' });
    }
  },
  updateTransaction: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const affectedRows = await TransactionModel.update(id, status);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      await sendEvent('transaction_queue', {
        event: 'transaction_updated',
        transactionId: id,
        status,
        timestamp: new Date()
      });
      
      res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ message: 'Error updating transaction' });
    }
  },
  deleteTransaction: async (req, res) => {
    const { id } = req.params;
    try {
      const affectedRows = await TransactionModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      await sendEvent('transaction_queue', {
        event: 'transaction_deleted',
        transactionId: id,
        timestamp: new Date()
      });
      
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ message: 'Error deleting transaction' });
    }
  },
  getAllTransactions: async (req, res) => {
    try {
      const transactions = await TransactionModel.getAll();
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error getting all transactions:', error);
      res.status(500).json({ message: 'Error getting all transactions' });
    }
  }
};
module.exports = TransactionController;