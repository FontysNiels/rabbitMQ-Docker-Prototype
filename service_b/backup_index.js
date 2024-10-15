const express = require('express');
const app = express();
const cors = require('cors');
const rabbit = require("rabbitmq-stream-js-client");

const port = 5001;

app.use(cors());

var client = null;


async function setup() {
    const client = await rabbit.connect({
        hostname: "rabbitmq",
        port: 5672,
        username: "rabbitmq",
        password: "rabbitmq",
    });

    const streamName = "hello-nodejs-stream";
    
    console.log("Subscribing to stream...");
    const consumer = await client.declareConsumer({
        stream: streamName,
        offset: "first", // Start consuming from the first message
        messageHandler: (msg) => {
            const messageContent = msg.getContent().toString();
            console.log(`Received message: ${messageContent}`);
        },
    });
}

app.get('/', async (req, res) => {
    console.log(`Listening for messages on stream: ${streamName}`);
    res.send('Hello from Service B!');
});

setup();
app.listen(port, () => {
  console.log(`Service B listening on port ${port}`);
});