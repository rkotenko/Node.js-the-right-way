var fs = require('fs');

fs.open('text.txt', 'r', function(err, fd) {
    if (err) {throw err; }
    var buf = new Buffer(5),
        offset = 0,
        length = buf.length,
        position = 5;

    fs.read(fd, buf, offset, length, position, function() {
        console.log(buf.toString());
        fs.read(fd, buf, 0, length, 10, function() {
            console.log(buf.toString());
        });
    });
    /*var writeBuffer = new Buffer('writing this'),
        bufferOffset = 0,
        bufferLength = writeBuffer.length,
        filePosition = null;

    fs.write(
        fd,
        writeBuffer,
        bufferOffset,
        bufferLength,
        filePosition,
        function(err, written){
            if (err) { throw err; }
            console.log('wrote ' + written + ' bytes');
        }
    );*/
});



