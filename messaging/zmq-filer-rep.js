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
});