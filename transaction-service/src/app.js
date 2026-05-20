require('dotenv').config(); 
const express = require('express'); 
const app = express(); 
const transactionRoutes = require('./routes/transactionRoutes'); 
const { listenEvent } = require('./config/queue');

app.use(express.json()); 

app.use('/api/transactions', transactionRoutes); 

app.get('/', (req, res) => { 
    res.send('Welcome to Transaction Service!'); 
}); 

const PORT = process.env.PORT || 3004; 
app.listen(PORT, () => { 
    console.log(`Transaction Service running on port ${PORT}`); 
});

listenEvent('transaction_queue', (msg) => {
    console.log('Event dari transaction_queue:', msg);
});