"use strict";
const fs = require('fs');

fs.writeFile('text.txt', ' words go here', function(err){
    if (err) {
        throw err;
    }
    console.log('file saved!');
});