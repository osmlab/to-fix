var tape = require('tape'),
    levelup = require('levelup');
    importcsv = require('../import-csv.js'),
    fixed = require('../fixed.js'),
    queue = require('queue-async'),
    common = require('../lib/test-common.js');

tape('Basic import', function(t) {
    t.plan(1);
    var q = queue(1);
    q.defer( importcsv.deleteTask, 'test' )
    .await( function() {             
        importcsv.loadTask('./test/fixtures/test.csv', function(){
            common.countTasksBySkipval(function(count) { 
                var numTasks = 0;
                Object.keys(count).forEach(function(k) { numTasks += count[k]; });
                t.equal(numTasks, 1000); 
            });
        });
    }); 
});

