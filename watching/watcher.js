const
    fs = require('fs'),
    filename = 'target.txt';
var watcher = '';

fs.stat(filename, function(err, stat){
    if (err){
        console.log(err.code == 'ENOENT' ? 'File does not exist' : err.code);
        return;
    }

    watcher = fs.watch(filename, function() {
        fs.open(filename, 'r',  function(err){
            if(err) {
                console.log(err.code == 'ENOENT' ? 'File was deleted' : err.code);
                watcher.close();
            } else {
                console.log("File " + filename + " just changed!");
            }
        });


    });

    console.log("Now watching " + filename + " for changes...");
});


