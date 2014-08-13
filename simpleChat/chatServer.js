'use strict';
const
    zmq = require('zmq'),
    publisher = zmq.socket('pub').bind('tcp://127.0.0.1:5434'),
    chatServer = zmq.socket('rep');

// listen for messages.  These will be turned around and sent out to all clients
chatServer.on('message', function(data){
    let message = JSON.parse(data);
    console.log(message);

    // response sockets require a response being sent.  There has to be a better way to do
    //this without needing to send this as well as publish and answer
    chatServer.send('');

    if(message.new) {
        publisher.send(JSON.stringify({
            name: message.name,
            joined: true
        }));
    }
    else {
        publisher.send(JSON.stringify({
            name: message.name,
            content: message.content
        }));
    }
});

chatServer.bind('tcp://127.0.0.1:5433', function(err){
    console.log("Waiting for users");
});