"use strict";
const fs = require('fs');

    fs.readFile('text.txt', function(err, data){
    if (err) {
        throw err;
    }
    console.log(data.toString());
});