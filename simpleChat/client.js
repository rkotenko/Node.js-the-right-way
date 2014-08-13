'use strict';
const
    zmq = require('zmq'),
    readline = require('readline'),  // used for command line prompt and reading
    subscriber = zmq.socket('sub').connect('tcp://127.0.0.1:5434'),  // used to receive messages
    chatClient = zmq.socket('req').connect('tcp://127.0.0.1:5433');  // used to send messages to server

let
    userName = '',
    rl = readline.createInterface(process.stdin, process.stdout);

// prompt first for a name
rl.question('Welcome.  Please give your name: ', function(name){
    userName = name;

    // pass the name to the server
    let newUser = JSON.stringify({
        new: true,
        name: name
    });
    chatClient.send(newUser);
    rl.prompt(true);
});

rl.on('line', function(line){
    chatClient.send(JSON.stringify({
        name: userName,
        content: line
    }));
});

// subscribe to get the chat messages from the publisher
subscriber.subscribe('');

// data comes in as simple string
subscriber.on('message', function(data){
    let response = JSON.parse(data);
    if(response.name !== userName) {
        if(response.joined){
            console.log(response.name + ' joined the chat');
        }
        else {
            console.log(response.name + ': ' + response.content);
        }

    }

    rl.prompt(true);
});

