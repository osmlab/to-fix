var levelup = require('levelup'),
    key = require('./key.js'),
    queue = require('queue-async');

function countTasksBySkipval(callback) {
    levelup('./ldb/test.ldb', function(err, db) {
        if (err) return callback(err);
        var counts = {};
        db.createReadStream()
            .on('data', function(data) {
                var skipval = key.decompose(data.key).skipval;
                if (!counts[skipval]) counts[skipval] = 0;
                counts[skipval]++;
            })
            .on('end', function() {
                db.close(function(err) {
                    callback(err, counts);
                });
            });
    });
}

function markTasksAsDone(tasks, callback) {
    levelup('./ldb/test.ldb', function(err, db) {
        if (err) throw callback(err);
        var q = queue();
        tasks.forEach(function(task) {
            q.defer(function(task, deferCallback) {
                db.get(task, function(err, val) {
                    var k = key.decompose(task);
                    db.put(key.compose(0, k.hash), val, function() {
                        db.del(task, deferCallback);
                    });
                });
            }, task);
        });
        q.awaitAll(function() {
            db.close(function(err) {
                callback(err);
            }); 
            
        });
    });
}

function blankslate(clearFixed, callback){
    var q = queue();
    if (clearFixed) {
        q.defer(rimraf, './fixed/test');
        q.defer(rimraf, './fixed/test-tracking');
    }
    q.defer(rimraf, './ldb/test.ldb');
    q.defer(rimraf, './ldb/test-tracking.ldb');
    q.awaitAll(function(err, results) {
        callback(err);
    });
}

module.exports = {
    countTasksBySkipval: countTasksBySkipval,
    markTasksAsDone: markTasksAsDone,
    blankslate: blankslate
};
