"use strict";
const
    fs = require('fs'),
    spawn = require('child_process').spawn,
    filename = process.argv[2];

var options = Array();

// arguments for the process to be spawned start at argv 4
for (var i = 4; i < process.argv.length; i++){
    options.push(process.argv[i]);
}

if (!filename) {
    throw Error("A file to watch must be specified.");
}

fs.watch(filename, function() {
    let ls = spawn(process.argv[3], options);
    ls.stdout.pipe(process.stdout);
});

console.log("Now watching " + filename + " for changes...");