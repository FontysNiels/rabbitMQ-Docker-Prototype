const express = require('express')
const cors = require('cors');
const amqplib = require('amqplib')

const app = express()
app.use(cors());

const port = 5000;
var args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}
var connection = null;
var channel = null;
var queue = "q_a";

var exchange = 'direct_logs';

async function setup() {
    connection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq')
    channel = await connection.createChannel()

    channel.assertExchange(exchange, 'direct', {
        durable: false
    });
    await channel.assertQueue(queue, { exclusive: true })

    console.log(' [*] Waiting for logs. To exit press CTRL+C');

    args.forEach(function (severity) {
        channel.bindQueue(queue, exchange, severity);
    });

    channel.consume(queue, function (msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
    }, {
        noAck: true
    })
}

app.get('/', async (req, res) => {
    // channel.sendToQueue("q_b", Buffer.from('Hello World!'))
    return res.send('Hello World!')
})

setup()
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})