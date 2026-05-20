require('dotenv').config();
const express = require('express');
const { listenEvent } = require('./config/queue');
const CustomerModel = require('./models/customerModel');
const ProductModel = require('./models/productModel');

const app = express();
const transactionRoutes = require('./routes/transactionRoutes');

app.use(express.json());

async function initRabbitMQ() {
    try {
        await listenEvent("CREATE_CUSTOMER", createCustomer);
        await listenEvent("UPDATE_CUSTOMER", updateCustomer);
        await listenEvent("CREATE_PRODUCT", createProduct);
        await listenEvent("UPDATE_PRODUCT", updateProduct);
        console.log("✅ RabbitMQ Consumers are successfully registered.");
    } catch (error) {
        console.error("❌ Failed to initialize RabbitMQ consumers:", error);
    }
}


async function createProduct(data) {
    try {
        console.log("Menerima event CREATE_PRODUCT:", data);
        await ProductModel.create(data.id, data.name, data.imageUrl);
        console.log(`✅ Produk ID ${data.id} berhasil disinkronisasi ke DB Transaksi.`);
    } catch (error) {
        console.error(`❌ Gagal menyimpan produk ID ${data.id} ke DB Transaksi:", error.message);
    }
}

async function updateProduct(data) {
    try {
        console.log("✅ Menerima event UPDATE_PRODUCT:", data);
        await ProductModel.update(data.id, data.name, data.imageUrl);
        console.log(`✅ Produk ID ${data.id} berhasil diperbarui di DB Transaksi.`);
    } catch (error) {
        console.error(`❌ Gagal memperbarui produk ID ${data.id} di DB Transaksi:", error.message);
    }
}

async function createCustomer(data) {
    try { await CustomerModel.create(data.id, data.name, data.email); } catch (e) { console.error(e); }
}

async function updateCustomer(data) {
    try { await CustomerModel.update(data.id, data.name, data.email); } catch (e) { console.error(e); }
}


// Hanya mendaftarkan rute transaksi
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Transaction Service!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Transaction Service running on port ${PORT}`);
    initRabbitMQ();
});
