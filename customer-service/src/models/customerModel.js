const pool = require('../config/db');
const CustomerModel = {
  create: async (userId, fullname, phone, address) => {
    const [result] = await pool.execute(
      'INSERT INTO customers (userId, fullname, phone, address) VALUES (?, ?, ?, ?)',
      [userId, fullname, phone, address]
    );
    return result.insertId;
  },
  findById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    return rows[0];
  },
  update: async (id, fullname, phone, address) => {
    const [result] = await pool.execute(
      'UPDATE customers SET fullname = ?, phone = ?, address = ? WHERE id = ?',
      [fullname, phone, address, id]
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM customers WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM customers');
    return rows;
  }
};
module.exports = CustomerModel;