const pool = require('../config/db');

const TransactionModel = {

    // 1. MEMBUAT TRANSAKSI BARU (Tabel: transactions)
    createTransaction: async (
        customerId,
        totalAmount,
        status = 'pending'
    ) => {
        const [result] = await pool.execute(
            `
            INSERT INTO transactions
            (customer_id, total_amount, status)
            VALUES (?, ?, ?)
            `,
            [customerId, totalAmount, status]
        );

        return result.insertId;
    },

    // 2. MENAMBAH ITEM TRANSAKSI (Tabel: transaction_items)
    addTransactionItem: async (
        transactionId,
        productId,
        quantity,
        pricePerItem
    ) => {
        const [result] = await pool.execute(
            `
            INSERT INTO transaction_items
            (transaction_id, product_id, quantity, price_per_item)
            VALUES (?, ?, ?, ?)
            `,
            [
                transactionId,
                productId,
                quantity,
                pricePerItem
            ]
        );

        return result.insertId;
    },

    // 3. MENCARI TRANSAKSI BERDASARKAN ID (Tabel: transactions & transaction_items)
    findById: async (id) => {
        const [rows] = await pool.execute(
            `
            SELECT
                t.*,
                ti.id AS item_id,
                ti.product_id,
                ti.quantity,
                ti.price_per_item
            FROM transactions t
            JOIN transaction_items ti
                ON t.id = ti.transaction_id
            WHERE t.id = ?
            `,
            [id]
        );

        return rows;
    },

    // 4. MENCARI TRANSAKSI BERDASARKAN ID CUSTOMER (Tabel: transactions & transaction_items)
    findByCustomerId: async (customerId) => {
        const [rows] = await pool.execute(
            `
            SELECT
                t.*,
                ti.id AS item_id,
                ti.product_id,
                ti.quantity,
                ti.price_per_item
            FROM transactions t
            JOIN transaction_items ti
                ON t.id = ti.transaction_id
            WHERE t.customer_id = ?
            ORDER BY t.transaction_date DESC
            `,
            [customerId]
        );

        return rows;
    },

    // 5. UPDATE STATUS TRANSAKSI (Tabel: transactions)
    updateStatus: async (id, status) => {
        const [result] = await pool.execute(
            `
            UPDATE transactions
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        return result.affectedRows;
    },

    // 6. HAPUS TRANSAKSI (Tabel: transactions)
    delete: async (id) => {
        const [result] = await pool.execute(
            `
            DELETE FROM transactions
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    },

    // 7. AMBIL SEMUA DATA TRANSAKSI (Tabel: transactions & transaction_items)
    getAll: async () => {
        const [rows] = await pool.execute(
            `
            SELECT
                t.*,
                ti.id AS item_id,
                ti.product_id,
                ti.quantity,
                ti.price_per_item
            FROM transactions t
            JOIN transaction_items ti
                ON t.id = ti.transaction_id
            ORDER BY t.transaction_date DESC
            `
        );

        return rows;
    }

};

module.exports = TransactionModel;
