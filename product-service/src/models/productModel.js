const pool = require('../config/db');
const ProductModel = {
  create: async (name, description, price, stock) => {
    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description, price, stock]
    );
    return result.insertId;
  },
  findById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0];
  },
  update: async (id, name, description, price, stock) => {
    const [result] = await pool.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
      [name, description, price, stock, id]
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM products');
    return rows;
  }
};
module.exports = ProductModel;