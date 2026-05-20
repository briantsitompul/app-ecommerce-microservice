require('dotenv').config(); 
const express = require('express'); 
const proxy = require('express-http-proxy'); 
const app = express(); 

app.use('/api/users', proxy(process.env.USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl
})); 

app.use('/api/customers', proxy(process.env.CUSTOMER_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl
})); 

app.use('/api/products', proxy(process.env.PRODUCT_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl
})); 

app.use('/api/transactions', proxy(process.env.TRANSACTION_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl
})); 

app.get('/', (req, res) => { 
    res.send('Welcome to the Main E-commerce API Gateway!'); 
}); 

const PORT = process.env.PORT
app.listen(PORT, () => { 
    console.log(`API Gateway running on port ${PORT}`); 
    console.log(`Frontend can access all routes through http://localhost:${PORT}/api`); 
});