var tape = require('tape'),
    levelup = require('levelup');
    importcsv = require('../import-csv.js'),
    fixed = require('../fixed.js'),
    queue = require('queue-async'),
    rimraf = require('rimraf'),
    common = require('../lib/test-common.js');

var doneTasks = [
        '0001-f3e3a9a24a8247bc22ad26848920a8f6',
        '0001-f4811f854c3b20bdccf9c98a3e606118',
        '0001-f4ded9025cbb31e27e965bc816f74e50',
        '0001-f50d7e95015d7770b21233751680c15c',
        '0001-f52d1a8452a91a1594176abd1cfceb98',
        '0001-f6597e570fd8f147e867a10e2a8b6470',
        '0001-f6d6e41424483b624815412d0f76da4a',
        '0001-f77bec838c462f9d5a79fd0e6e747255',
        '0001-f7e9605ed5447a5410a37fdceeafd786',
        '0001-f81d61a3ac07d5fde526848144b683ad',
        '0001-f86264120e43978c151c2f9a419b6145',
        '0001-f8b73527bf386ddcc5ab95d859cbdcb4',
        '0001-f8c69489ba02c7af5b095adb50c736ee',
        '0001-f98d03edd15cb8c723cb8d6456dd9e40',
        '0001-fa44e3608d880482aab69bf7ec965f68',
        '0001-fb1bb68477ebb6ca3bfe5e7fbba9e3af',
        '0001-fb89fa2e6ee1a6f4fead7d6605aef77f',
        '0001-fcb77a0b0033748697b6b2312a29f767',
        '0001-fd36eb36865e0d23ac6260c802b60335',
        '0001-fea2e1d44fec1f0c0d21fca866f79951'
    ];

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


tape('Basic import', function(t) {
    t.plan(1);
    var q = queue(1);
    q.defer(blankslate, true)     
     .defer(importcsv, './test/fixtures/test.csv')
     .defer(common.countTasksBySkipval)
     .defer(blankslate, true) 
     .awaitAll(function(err, results){        
        if (err) {
            t.fail();
            return console.log(err);
        }
        else {
            var count = results[2];
            var numTasks = 0;
            Object.keys(count).forEach(function(k) { numTasks += count[k]; });
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
     .awaitAll(function(err, results){
        if (err) {
            console.log(err);
        }
        else {
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
     
     .awaitAll(function(err, results){
        if(err) {
            console.log(err);        
        }
        else {
            var count = results[6];
            t.equal(count['0'], undefined, '20 fixed tasks were not imported');
            t.equal(count['1'], 980, 'Found 980 incomplete tasks');
        }
     });

});

