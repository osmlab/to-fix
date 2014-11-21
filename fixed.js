var fs = require('fs'),
    levelup = require('levelup'),
    leveldown = require('leveldown'),
    queue = require('queue-async'),
    key = require('./lib/key.js'),
    rimraf = require('rimraf');

function fixed(callback) {
    var dbs = fs.readdirSync('./ldb/').filter(function(item) {
       return item.indexOf('.ldb') > -1;
    });

    if (!fs.existsSync('./fixed')) {
        fs.mkdirSync('./fixed');
    }

    var q = queue();

    dbs.forEach(function(ldb, idx) {
        q.defer(function(qcallback) {
            levelup('./ldb/' + ldb, {
                createIfMissing: false,
                max_open_files: 500
            }, function(err, db) {
                if (err) return console.log(err);
                var filePath = './fixed/' + ldb.split('.ldb')[0];
                var file = fs.createWriteStream(filePath);
                file.once('open', function() {
                    db.createReadStream({lt: '0001'})
                        .on('data', function(data) {
                            file.write(key.decompose(data.key).hash + '\n');
                        })
                        .on('end', function(data) {
                            file.end();
                            db.close(function(err) {
                                qcallback(err);
                            });
                        });
                });
            });
        });
    });

    q.awaitAll(function(err, results) {
        if (callback) callback(err);
    });
}

module.exports = fixed;
if (require.main === module) { fixed(); }
