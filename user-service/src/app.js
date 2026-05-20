require('dotenv').config(); 
const express = require('express'); 
const app = express(); 
const userRoutes = require('./routes/userRoutes'); 
const { listenEvent } = require('./config/queue');

app.use(express.json()); 

app.use('/api/users', userRoutes); 

app.get('/', (req, res) => { 
    res.send('Welcome to User Service!'); 
}); 

const PORT = process.env.PORT || 8081; 
app.listen(PORT, () => { 
    console.log(`User Service running on port ${PORT}`); 
});

listenEvent('user_queue', (msg) => {
    console.log('Event dari user_queue:', msg);
});