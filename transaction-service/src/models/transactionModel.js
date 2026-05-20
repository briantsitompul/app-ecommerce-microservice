const pool = require('../config/db');
const TransactionModel = {
  create: async (customerId, productId, quantity, totalPrice, status) => {
    const [result] = await pool.execute(
      'INSERT INTO transactions (customerId, productId, quantity, totalPrice, status) VALUES (?, ?, ?, ?, ?)',
      [customerId, productId, quantity, totalPrice, status]
    );
    return result.insertId;
  },
  findById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );
    return rows[0];
  },
  update: async (id, status) => {
    const [result] = await pool.execute(
      'UPDATE transactions SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM transactions WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM transactions');
    return rows;
  }
};
module.exports = TransactionModel;