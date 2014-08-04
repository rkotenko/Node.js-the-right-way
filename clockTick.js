var EventEmitter = require('events').EventEmitter,
    util         = require('util');

var Ticker = function(){
    var self = this;
    setInterval(function(){
        self.emit('tick');
        console.log('tick event emitted');
    }, 1000)
};

util.inherits(Ticker, EventEmitter);


var clock = new Ticker();
clock.on('tick', function(){
    console.log('TICK');
});


