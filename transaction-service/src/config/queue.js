const amqp = require('amqplib');

let channel;
let connection;

const connectQueue = async () => {
    try {
        connection = await amqp.connect(process.env.QUEUE_SERVICE_URL);
        channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('❌ RabbitMQ Connection Error:', error);
        setTimeout(connectQueue, 5000); // Retry after 5 seconds
    }
};

const sendEvent = async (eventName, data) => {
    try {
        if (!channel) await connectQueue();
        const exchange = 'ecommerce_events';
        await channel.assertExchange(exchange, 'topic', { durable: true });
        channel.publish(
            exchange,
            eventName,
            Buffer.from(JSON.stringify(data))
        );
        console.log(`✅ Event "${eventName}" sent:`, data);
    } catch (error) {
        console.error(`❌ Error sending event "${eventName}":`, error);
    }
};

const listenEvent = async (eventName, callback) => {
    try {
        if (!channel) await connectQueue();
        const exchange = 'ecommerce_events';
        await channel.assertExchange(exchange, 'topic', { durable: true });
        const queue = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(queue.queue, exchange, eventName);
        console.log(`✅ Listening to event "${eventName}"`);
        channel.consume(queue.queue, (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                callback(data);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error(`❌ Error listening to event "${eventName}":`, error);
    }
};

connectQueue();
module.exports = { sendEvent, listenEvent };
