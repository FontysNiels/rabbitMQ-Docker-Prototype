const express = require('express')
const cors = require('cors');
const amqplib = require('amqplib')

const app = express()
app.use(cors());

const port = 5001;

var connection = null;
var channel = null;
var queue = "a_b";

async function setup(){
    connection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq')
    channel = await connection.createChannel()
  
    var exchange = 'direct_logs';
        var args = process.argv.slice(2);
        var msg = args.slice(1).join(' ') || 'I sent this message';
        var severity = (args.length > 0) ? args[0] : 'info';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);

        // setTimeout(function () {
        //     connection.close();
        //     process.exit(0);
        // }, 500);
}

app.get('/', async (req, res) => {
    channel.sendToQueue("a_a", Buffer.from('Hello World!'))
    return res.send('Hello World B!')
})

setup()
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})