"use strict";
const
    fs = require('fs'),
    zmq = require('zmq'),
    // socket to reply to client requests
    responder = zmq.socket('rep');
// handle incoming requests
responder.on('message', function(data){
    // parse incoming message
    let request = JSON.parse(data);
    console.log('Received request to get: ' + request.path);

    // read and reply with content
    fs.readFile(request.path, function(err, content){
        let response;

        if(err) {
            response = JSON.stringify({
                error: 'File could not be read'
            });
        }
        else {
            response = JSON.stringify({
                content: content.toString(),
                timestamp: Date.now(),
                pid: process.pid
            });
        }
        console.log('Sending response content');
        responder.send(response);
    });
});

// listen on TCP port 5433
responder.bind('tcp://127.0.0.1:5433', function(err){
    console.log('Listening for zmq requesters');
});

// close the responder when Node process ends
process.on('SIGINT', function(){
    console.log('Shutting down...');
    responder.close();
});