require('dotenv').config(); 
const express = require('express'); 
const app = express(); 
const productRoutes = require('./routes/productRoutes'); 
const { listenEvent } = require('./config/queue');

app.use(express.json()); 

app.use('/api/products', productRoutes); 

app.get('/', (req, res) => { 
    res.send('Welcome to Product Service!'); 
}); 

const PORT = process.env.PORT || 3003; 
app.listen(PORT, () => { 
    console.log(`Product Service running on port ${PORT}`); 
});

listenEvent('product_queue', (msg) => {
    console.log('Event dari product_queue:', msg);
});