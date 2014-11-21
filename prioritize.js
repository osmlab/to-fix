var fs = require('fs'),
    path = require('path'),
    gju = require('geojson-utils'),
    key = require('./lib/key.js'),
    levelup = require('levelup'),
    wellknown = require('wellknown'),
    queue = require('queue-async');

// adjusts task skipvals based on geometry, prioritizing particular areas/markets

var quickMode = true; // should we bother matching against every geometry or just quit after one hit?

if (process.stdin.isTTY) {
    if (process.argv.length < 4) {
        return console.log('file arguments are required\n`node prioritize.js [task] [geojson1 geojson2 ... ]`');
    }

    // process command line params, load geojson files
    var q = queue();
    var geojson = {};
    process.argv
        .filter(function(elem, i) { return (i>2); })
        .forEach(function(elem, i) {
            // if using overlapping geojson files, this flag might be useful. 
            // otherwise, no.
            if (elem === '--slow') {
                quickMode = false;
            } else {                
                q.defer(loadGeoJSON, elem);              
            }
        });

    q.awaitAll(ProcessLevelDB);
}

function loadGeoJSON(elem, callback) {
    fs.readFile(elem, function(err, data) {
        if (err) console.log('# Error loading GeoJSON file ' + elem);

        var basename = path.basename(elem);
        var boundary = JSON.parse(data);
        if ((boundary === null) || !boundary.features) {
            console.log('# failed to load valid GeoJSON from ' + elem);
        } else {
            geojson[basename] = boundary;  
            console.log('- loaded GeoJSON file ' + elem);  
        }    
        callback();
    });
}

function ProcessLevelDB(){
    console.log('- opening leveldb database ' + process.argv[2]);
    levelup('./ldb/' + process.argv[2] + '.ldb', function(err, db) {
        if (err) throw(err);

        var maxOverlaps = 0;
        console.log('- checking for geometry overlap');
        db.createReadStream()
            .on('data', function(data) {

                data.value = JSON.parse(data.value);

                // if this task is already fixed, skip it
                if (key.decompose(data.key).skipval === 0) return;

                // check if point is in any geojson geometries
                var overlapCount = 0;
                Object.keys(geojson).every(function(k) {
                    
                    // check for valid point geometry in the task object
                    if (!data.value.st_astext) {
                        console.log('# missing geometry (st_astext) for key ' + data.key);
                        return false;
                    } 

                    // test for presence of point in polygon
                    if (gju.pointInPolygon(wellknown.parse(data.value.st_astext), geojson[k].features[0].geometry)) {
                        if (!data.value.priority) data.value.priority = []; 
                        data.value.priority.push(k);
                        overlapCount++;
                        if (quickMode) return false;
                    }

                    return true;
                });

                // track maximum number of overlaps
                maxOverlaps = Math.max(maxOverlaps, overlapCount);

                // record findings in the task object record
                data.value.overlapCount = overlapCount;
                db.put(data.key, JSON.stringify(data.value), function(err) {
                    if (err) console.log('# error saving key ' + data.key + '#' + overlapCount);
                });
            })
            .on('end', function(){

                // iterate through all keys, adding (maxOverlaps - overlap) to each skipval
                console.log('- reordering tasks');
                var adjustmentsMade = 0;

                var reordered = 0;
                db.createReadStream()
                    .on('data', function(data) {
                        data.value = JSON.parse(data.value);

                        // increment skipval based on number of overlaps
                        var keyComponents = key.decompose(data.key);
                        var newKey = key.compose((keyComponents.skipval + (maxOverlaps - parseInt(data.value.overlapCount))), keyComponents.hash);
                        if (parseInt(data.value.overlapCount) > 0) adjustmentsMade++;

                        // rename the task ID to reflect the new skipval
                        delete data.value.overlapCount;
                        db.del(data.key, function(err){
                            if (err) console.log('# error deleting key ' + newKey);
                            db.put(newKey, JSON.stringify(data.value), function(err) {
                                if (err) console.log('# error saving key ' + newKey);
                                reordered++;
                            });
                        });
                    })
                    .on('end', function() {
                        console.log('- finished, reprioritized ' + adjustmentsMade + '/' + reordered + ' tasks');
                    });
            });
    });
}
