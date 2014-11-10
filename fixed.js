var fs = require('fs'),
    levelup = require('levelup'),
    leveldown = require('leveldown'),
    key = require('./lib/key.js');

var dbs = fs.readdirSync('./ldb/').filter(function(item) {
   return item.indexOf('.ldb') > -1;
});

fs.stat('./fixed', function(err, stats) {
    if (err && (err.errno == 34)) fs.mkdirSync('./fixed');
});

dbs.forEach(function(ldb, idx) {
    levelup('./ldb/' + ldb, {
        createIfMissing: false,
        max_open_files: 500
    }, function(err, db) {
        if (err) return console.log(err);
        var file = fs.createWriteStream('./fixed/' + ldb);
        file.once('open', function() {
            db.createReadStream({lt: '0001'})
                .on('data', function(data) {
                    file.write(key.decompose(data.key).hash + '\n');
                })
                .on('end', function(data) {
                    file.end();
                });
        });
    });
});
