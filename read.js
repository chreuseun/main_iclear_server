var fs = require('fs');

function read(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

var output = read('./file.txt', function(data) {
    console.log(data);
});