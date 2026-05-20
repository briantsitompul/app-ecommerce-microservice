const ProductModel = require('../models/productModel');
const { sendEvent } = require('../config/queue');

const ProductController = {
  createProduct: async (req, res) => {
    const { name, description, price, stock } = req.body;
    if (!name || !price || !stock) {
      return res.status(400).json({ message: 'Name, price, and stock are required' });
    }
    try {
      const productId = await ProductModel.create(name, description, price, stock);
      
      await sendEvent('product_queue', {
        event: 'product_created',
        productId,
        name,
        price,
        stock,
        timestamp: new Date()
      });
      
      res.status(201).json({ message: 'Product created successfully', productId });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Error creating product' });
    }
  },
  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Error getting product:', error);
      res.status(500).json({ message: 'Error getting product' });
    }
  },
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    try {
      const affectedRows = await ProductModel.update(id, name, description, price, stock);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      await sendEvent('product_queue', {
        event: 'product_updated',
        productId: id,
        name,
        price,
        stock,
        timestamp: new Date()
      });
      
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product' });
    }
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const affectedRows = await ProductModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      await sendEvent('product_queue', {
        event: 'product_deleted',
        productId: id,
        timestamp: new Date()
      });
      
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const products = await ProductModel.getAll();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting all products:', error);
      res.status(500).json({ message: 'Error getting all products' });
    }
  }
};
module.exports = ProductController;