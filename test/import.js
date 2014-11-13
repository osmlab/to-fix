var tape = require('tape'),
    levelup = require('levelup');
    importcsv = require('../import-csv.js'),
    key = require('../lib/key.js'),
    queue = require('queue-async');

function countTasksBySkipval(opts, callback) {
    levelup('./ldb/test.ldb', function(err, db) {
        if (err) throw(err);
        var counts = {};
        db.createReadStream(opts)
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

tape('Basic import', function(t){
    t.plan(1);

    var q = queue();
    q.defer( importcsv.deleteTask, 'test' )
    .await( function() {
        importcsv.loadTask('./test/fixtures/test.csv', function(){
            countTasksBySkipval({}, function(count) { 
                var numTasks = 0;
                Object.keys(count).forEach(function(k) { numTasks += count[k]; });
                t.equal(numTasks, 1000); 
            });
        });
    }); 
});
