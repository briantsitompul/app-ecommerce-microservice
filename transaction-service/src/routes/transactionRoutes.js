const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
router.post('/', TransactionController.createTransaction);
router.get('/:id', TransactionController.getTransactionById);
router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);
router.get('/', TransactionController.getAllTransactions);
module.exports = router;