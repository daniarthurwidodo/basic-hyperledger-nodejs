const amqp = require('amqplib/callback_api');
const express = require('express');
const { log } = require("mercedlogger") // import mercedlogger's log function
const config = require('../../config.json');
const mongoose = require('mongoose');
const Temp = require("./monitor.model");

const app = express()
const PORT = 4001;

// db connection
// const { DATABASE_URL } = process.env 
mongoose.connect(config.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', () => log.red("ERROR CONNECTION", 'connection error:'));
db.once('open', () => log.green("DATABASE STATUS", `Connected to mongo `));


amqp.connect(config.rabbitmq_url, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'monitor';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (msg) {
            var obj = JSON.parse(msg.content.toString('utf-8'))
            console.log(" [x] Received %s", obj);

            Temp.create(obj)

        }, {
            noAck: true
        });
        // channel.ackAll()

    });
});

app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))