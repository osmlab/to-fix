var tape = require('tape'),
    levelup = require('levelup');
    importcsv = require('../import-csv.js'),
    fixed = require('../fixed.js'),
    queue = require('queue-async'),
    rimraf = require('rimraf'),
    prioritize = require('../prioritize.js'),
    common = require('../lib/test-common.js');


tape('Prioritization', function(t) {
    t.plan(2);
    var q = queue(1);
    q.defer(common.blankslate, true)     
     .defer(importcsv, './test/fixtures/test.csv')
     .defer(prioritize, 'test', ['./test/fixtures/africa.geojson', './test/fixtures/north_america.geojson'], true)
     .defer(common.countTasksBySkipval)
     .defer(common.blankslate, true) 
     .awaitAll(function(err, results){        
        if (err) {
            t.fail(err);
        }
        else {
            var count = results[3];
            t.equal(count['1'], 175, 'Prioritized 175 tasks');     
            t.equal(count['2'], 825, 'Did not prioritize 825 tasks');
        }
     });    
});


