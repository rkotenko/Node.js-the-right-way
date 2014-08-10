'use strict';
const
    cluster = require('cluster'),
    fs = require('fs'),
    zmq = require('zmq');

if (cluster.isMaster) {
    // master process - create router and dealer sockets, bind endpoints
    let
        pusher = zmq.socket('push').bind('ipc://push.ipc'),
        puller = zmq.socket('pull').bind('ipc://pull.ipc'),
        readyWorkers = 0;


    puller.on('message', function(data){
        let message = JSON.parse(data);

        if(message.ready){
            readyWorkers++;

            if(readyWorkers === 3) {
                // send 30 'job' messages to the workers
                for (var i = 0; i < 30; i++){
                    pusher.send(JSON.stringify({
                        job: true,
                        index: i
                    }));
                }
            }
        }
        else if(message.result) {
            console.log('Result from process ' + message.pid + ' for job number ' + message.index);
        }
    });
    // listen for workers to come online
    cluster.on('online', function(worker){
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    // fork three worker processes
    for(let i = 0; i < 3; i++){
        cluster.fork();
    }

    // watch for exit events on the cluster and fork a new worker if needed
    cluster.on('exit', function(worker, code, signal){
        console.log('worker %d died on (%s).  Restarting...', worker.process.pid, code || signal);
        cluster.fork();
    });
}
else {
    let
        pusher = zmq.socket('push').connect('ipc://pull.ipc'),  // to allow worker to send back to main
        puller = zmq.socket('pull').connect('ipc://push.ipc');  // to allow worker to receive from main

    puller.on('message', function(data){
        let message = JSON.parse(data);

        console.log('Job number ' + message.index + ' received for ' + process.pid);
        pusher.send(JSON.stringify({
            index: message.index,
            pid: process.pid
        }));
    });

    // send ready messages
    pusher.send(JSON.stringify({
        ready: true
    }));
}