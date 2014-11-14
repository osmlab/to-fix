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
                // test to ensure this is a file, not a directory
                // unclear why this is newly necessary, but it is
                var filePath = './fixed/' + ldb.split('.ldb')[0];
                fs.stat(filePath, function(err, stats) {
                    if (err) return qcallback(err);
                    if (stats.isFile()) {
                        var file = fs.createWriteStream(filePath);
                        file.once('open', function() {
                            db.createReadStream({lt: '0001'})
                                .on('data', function(data) {
                                    file.write(key.decompose(data.key).hash + '\n');
                                })
                                .on('end', function(data) {
                                    file.end();
                                    db.close(function(err){
                                        qcallback(err);   
                                    });                        
                                });
                        });                        
                    }
                    else {
                        qcallback(null);
                    }

                });
                
            });
        });
    });

    q.awaitAll(function(err, results){
        if (callback) callback(err); 
    });
}


module.exports = fixed;

if (require.main === module) { fixed(); }
