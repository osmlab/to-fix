var fs = require('fs'),
    csv = require('csv-parser'),
    levelup = require('levelup'),
    path = require('path'),
    key = require('./lib/key.js');

if (process.stdin.isTTY) {
    if (process.argv[2] === undefined) {
        return console.log('file argument required \n`node import-csv.js [source csv] [fixed json]`');
    }
    loadTask(process.argv[2], process.argv[3]);
} else {
    process.stdin.on('readable', function() {
        var buf = process.stdin.read();
        if (buf === null) return;
        buf.toString().split('\n').forEach(function(file) {
            if (file.length) loadTask(file, process.argv[2]);
        });
    });
}

function loadTask(fileLoc, fixedLoc) {
    var task = path.basename(fileLoc).split('.')[0],
        db = levelup('./ldb/' + task + '.ldb'),
        count = 0;

    // load list of IDs that are already fixed
    var fixed_list = [];
    if (fixedLoc !== undefined) {
        if (fixedLoc[0] !== '/') fixedLoc = './' + fixedLoc;
        fixed_list = require(fixedLoc);
        fixed_list = fixed_list[task + '.ldb'] ? fixed_list[task + '.ldb'] : [];
    }

    var tracking = levelup('./ldb/' + task + '-tracking.ldb');
    tracking.close();

    console.log('importing ' + task);

    fs.createReadStream(fileLoc)
        .pipe(csv())
        .on('data', function(data) {
            var object_hash = key.hashObject(data);
            if (fixed_list.indexOf(object_hash) === -1) {
                // item is not fixed
                var object_id = key.compose(1, object_hash);
                db.put(object_id, JSON.stringify(data), function (err) {
                    if (err) console.log('-- error --', err);
                });
                count++;
            }
        })
        .on('end', function() {
            setTimeout(function() {
                // insert a dummy object in unfixed keyspace if nothing has been inserted
                // prevents blocking on levelup readstream creation against an empty db
                if (count === 0) {
                    var keyval = key.compose(1, 'random');
                    db.put(keyval, JSON.stringify({ignore: true}));
                }
                db.close();

                console.log('done with ' + task + '. ' + count + ' items imported');
            }, 5000);
        });
}
