var levelup = require('levelup'),
    key = require('./key.js'),
    queue = require('queue-async');

function countTasksBySkipval(callback) {
    levelup('./ldb/test.ldb', function(err, db) {
        if (err) throw(err);
        var counts = {};
        db.createReadStream()
            .on('data', function(data) {
                var skipval = key.decompose(data.key).skipval;
                if (!counts[skipval]) counts[skipval] = 0;
                counts[skipval]++;
            })
            .on('end', function() {
                callback(counts);                
            });
    });
}

function markTasksAsDone(db, tasks, callback) {
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
    q.awaitAll(callback);
}

module.exports = {
    countTasksBySkipval: countTasksBySkipval,
    markTasksAsDone: markTasksAsDone
}