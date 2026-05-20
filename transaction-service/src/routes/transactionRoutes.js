const express = require('express');

const router = express.Router();

const TransactionController =
    require('../controllers/transactionController');

// Create Transaction
router.post(
    '/',
    TransactionController.createTransaction
);

// Get All Transactions
router.get(
    '/',
    TransactionController.getAllTransactions
);

// Get Transaction By ID
router.get(
    '/:id',
    TransactionController.getTransactionById
);

// Get transactions by customer ID
router.get(
    '/customer/:customerId',
    TransactionController.getTransactionsByCustomerId
);

// Update transaction status
router.put(
    '/:id/status',
    TransactionController.updateTransactionStatus
);

// Delete transaction
router.delete(
    '/:id',
    TransactionController.deleteTransaction
);

module.exports = router;
