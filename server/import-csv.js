var fs = require('fs'),
    csv = require('csv-parser'),
    levelup = require('levelup'),
    path = require('path');

if (process.stdin.isTTY) {
    if (process.argv[2] === undefined) {
        return console.log('file argument required \n`node import-csv.js [file].csv`');
    }
    loadTask(process.argv[2]);
} else {
    process.stdin.on('readable', function() {
        var buf = process.stdin.read();
        if (buf === null) return;
        buf.toString().split('\n').forEach(function(file) {
            if (file.length) loadTask(file);
        });
    });
}

function loadTask(fileLoc) {
    var task = path.basename(fileLoc).split('.')[0],
    db = levelup('./' + task + '.ldb'),
    count = 0;

    console.log('importing ' + task);

    fs.createReadStream(fileLoc)
        .pipe(csv())
        .on('data', function(data) {
            // should batch these
            db.put(count, JSON.stringify(data), function (err) {
                if (err) console.log('-- error --', err);
            });
            count++;
        })
        .on('end', function() {
            setTimeout(function() {
                db.close();
                console.log('done with ' + task + '. ' + count + ' items imported');
            }, 5000);
        });
}
