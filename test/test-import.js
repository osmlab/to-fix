var tape = require('tape'),
    levelup = require('levelup');
    importcsv = require('../import-csv.js'),
    fixed = require('../fixed.js'),
    queue = require('queue-async'),
    rimraf = require('rimraf'),
    common = require('../lib/test-common.js');

var doneTasks = [
    '0001-f5fb24d3845649bc670d8d4d6edadfca',
    '0001-f6902ab0db17ab26bf5a78ca11365919',
    '0001-f722cf3e5fa0f3925fc4b24d36faa304',
    '0001-f754245da12019323c2b947296173f0a',
    '0001-f7998822f3346c34bb3ee6ada58307ab',
    '0001-f7b84c0ad5324c44b2a98e7d382d3334',
    '0001-f854472855320d3d3c24797830423d38',
    '0001-f8d0dc4d1424ade02530bd8ab084da67',
    '0001-f8f3bdabf0aea2c92ba2954226bfe4fc',
    '0001-f973d6f807b11cfd99a211b7dabb17ac',
    '0001-f9acf7e4afbfe3ea1f40f8e1ec0c0721',
    '0001-fa0667c241cb709b37d3e9d83adb2c4b',
    '0001-faa2d1de31d022a43cf16f9cc763793b',
    '0001-fabf656259e97997e83ede4154eabaa8',
    '0001-fb143b4aaf980ae5e50248cb114ab2b7',
    '0001-fb8af10e27274fd7548d9efb1e3b13c5',
    '0001-fc22b3c01f3487e49af11fa129f08fb8',
    '0001-fca5363cbdb074ab127c1f1759a1b380',
    '0001-fcaa2d763c8a9983bfeab30280eb6d97',
    '0001-fd518eca70733b65ad5df9383b945e42'
];

function blankslate(clearFixed, callback) {
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

tape('Basic import', function(t) {
    t.plan(1);
    var q = queue(1);
    q.defer(blankslate, true)
     .defer(importcsv, './test/fixtures/test.csv')
     .defer(common.countTasksBySkipval)
     .defer(blankslate, true) 
     .awaitAll(function(err, results) {
        if (err) {
            t.fail(err);
        } else {
            var count = results[2];
            var numTasks = 0;
            Object.keys(count).forEach(function(k) {
                numTasks += count[k];
            });
            t.equal(numTasks, 1000, 'Imported 1000 tasks');
        }
     });
});

tape('correct countTasksBySkipval() behavior', function(t) {
    t.plan(2);

    var q = queue(1);
    q.defer(blankslate, true)
     .defer(importcsv, './test/fixtures/test.csv')
     .defer(common.markTasksAsDone, doneTasks)
     .defer(common.countTasksBySkipval)
     .defer(blankslate, true)
     .awaitAll(function(err, results) {
        if (err) {
            t.fail(err);
        } else {
            var count = results[3];
            t.equal(count['0'], 20, 'Found 20 completed tasks');
            t.equal(count['1'], 980, 'Found 980 incomplete tasks');
        }
     });
});

tape('importing fixed tasks', function(t) {
    t.plan(2);
    var q = queue(1);

    // load and mark tasks as done
    q.defer(blankslate, true)
     .defer(importcsv, './test/fixtures/test.csv')
     .defer(common.markTasksAsDone, doneTasks)
    
    // record their fixed status
     .defer(fixed)
    
    // delete all tasks but keep the fixed records
     .defer(blankslate, false)
    
    // reload all tasks
     .defer(importcsv, './test/fixtures/test.csv')
    
    // check that their fixed status was retained
     .defer(common.countTasksBySkipval)
    
    // clean things up, including the fixed/test record
     .defer(blankslate, true) 
     
     .awaitAll(function(err, results) {
        if(err) {
            t.fail(err);
        } else {
            var count = results[6];
            t.equal(count['0'], undefined, '20 fixed tasks were not imported');
            t.equal(count['1'], 980, 'Found 980 incomplete tasks');
        }
     });
});
