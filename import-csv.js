var fs = require('fs'),
    path = require('path'),
    csv = require('csv-parser'),
    levelup = require('levelup'),
    key = require('./lib/key.js'),
    queue = require('queue-async'),
    rimraf = require('rimraf');

var verbose = false;
if (require.main === module) {
    verbose = true;
    if (process.argv[2] === undefined) {
        return console.log('file argument required \n`node import-csv.js [source csv]`');
    }
    loadTask(process.argv[2], function() { });
}

module.exports = loadTask;

function loadTask(fileLoc, callback) {    
    var task = path.basename(fileLoc).split('.')[0],
        topq = queue();

    // ensure that we create & close the tracking database before loading anything
    topq.defer(function(tqcallback){
        levelup('./ldb/' + task + '-tracking.ldb', {}, function(err, trackingdb){
            if (err) return tqcallback(err);
            trackingdb.close(function(err){                                                
                tqcallback(err);
            });
        });
    });

    topq.awaitAll(function(err, results){        
        // perform some tests to see if there's a 'fixed' file for this task
        var fixedq = queue();
        fixedq            
            .defer(function(fqcallback){
                fs.readdir('./fixed', function(err, files){ 
                    if (err) return fqcallback(err); 
                    fqcallback(err, (files.indexOf(task) > -1)); 
                });
            })
            .defer(function(fqcallback){
                fs.stat('./fixed/' + task, function(err, info){ 
                    if (err) return fqcallback(err); 
                    fqcallback(err, (info.size > 0)); 
                });
            });

        // once the tests come back, check if they're all positive. if so, load fixes & tasks.
        fixedq.awaitAll(function(err, results){                        
            if((!err) && results.every(function(x) { return x; })) {
                fs.readFile('./fixed/' + task, function(err, data){
                    var fixed_list = data.toString().split("\n");
                    _doImport(fileLoc, task, fixed_list, callback);
                });
            }            
            else {
                _doImport(fileLoc, task, [], callback);
            }
        });
    });   
} 

function _doImport(fileLoc, task, fixed_list, callback) {
    if (verbose) console.log('importing task from ' + fileLoc);

    var count = 0;

    levelup('./ldb/' + task + '.ldb', function(err, db){

        if (err) throw callback(err);

        var q = queue();

        q.defer(function(qcallback){                
            fs.createReadStream(fileLoc)
                .pipe(csv())
                .on('data', function(data) {                    
                    var object_hash = key.hashObject(data);
                    if (fixed_list.indexOf(object_hash) === -1) {
                        // item is not fixed
                        var object_id = key.compose(1, object_hash);
                        count++;
                        q.defer(function(qsubcallback) {
                            db.put(object_id, JSON.stringify(data), function(err){
                                qsubcallback(err);
                            });
                        });                            
                    }
                })
                .on('end', function(err){                    
                    if(count === 0) {
                        var keyval = key.compose(1, 'random');
                        q.defer(function(qsubcallback) {
                            db.put(keyval, JSON.stringify({ignore: true}), function(err) {
                                qsubcallback(err);
                            });
                        });
                    }
                    qcallback(err);
                });
            });
        
        q.awaitAll(function(err, results){
            if (verbose) { console.log('done with ' + task + '. ' + count + ' items imported'); }
            db.close(function(err){                
                if (callback) callback(err);    
            });                             
        });    
    }); 
}

/*
function deleteTask(task, callback){    
    var q = queue();
    if (verbose) { console.log('deleting task ' + task); }
    q.defer(rimraf, './ldb/' + task + '.ldb')
     .defer(rimraf, './ldb/' + task + '-tracking.ldb')
     .awaitAll(function(err, results) {         
        callback(err, results);
     });  
}
*/