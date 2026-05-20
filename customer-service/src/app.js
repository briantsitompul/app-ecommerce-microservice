require('dotenv').config(); 
const express = require('express'); 
const app = express(); 
const customerRoutes = require('./routes/customerRoutes'); 
const { listenEvent } = require('./config/queue');

app.use(express.json()); 

app.use('/api/customers', customerRoutes); 

app.get('/', (req, res) => { 
    res.send('Welcome to Customer Service!'); 
}); 

const PORT = process.env.PORT || 3002; 
app.listen(PORT, () => { 
    console.log(`Customer Service running on port ${PORT}`); 
});

listenEvent('customer_queue', (msg) => {
    console.log('Event dari customer_queue:', msg);
});