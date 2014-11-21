var fs = require('fs'),
    path = require('path'),
    gju = require('geojson-utils'),
    key = require('./lib/key.js'),
    levelup = require('levelup'),
    wellknown = require('wellknown'),
    queue = require('queue-async'),
    async = require('async');

// adjusts task skipvals based on geometry, prioritizing particular areas/markets
var quickMode = true;
var verbose = false;
var maxOverlaps = 0;
var geojson = {};

if (require.main === module) {
    verbose = true;
    var quick = true; // should we bother matching against every geometry or just quit after one hit?
    var geojsonFiles = [];

    process.argv
        .filter(function(elem, i) { return (i>2); })
        .forEach(function(elem, i) {
            // if using overlapping geojson files, this flag might be useful.
            // otherwise, no.
            if (elem === '--slow') {
                quick = false;
            } else {
                geojsonFiles.push(elem);
            }
        });

    prioritize(process.argv[2], geojsonFiles, quick, function(){});
}

function prioritize(task, geojsonFiles, quick, callback) {
    quickMode = quick;
    var q = queue();
    geojsonFiles.forEach(function(f) {
        q.defer(load, f);
    });
    q.awaitAll(function(err, results) {
        if (err) {
            callback(err);
        } else {
            processGeoJSON(task, function(err) { callback(err); });
        }
    });
}

function load(elem, callback) {
    fs.readFile(elem, function(err, data) {
        if (err) {
            if (verbose) console.log('# Error loading GeoJSON file ' + elem);
            callback(err);
        }

        var basename = path.basename(elem);
        var boundary = JSON.parse(data);
        if ((boundary === null) || !boundary.features) {
            var err = 'no valid GeoJSON in ' + elem;
            if (verbose) console.log('# ' + err);
            callback(err);
        } else {
            geojson[basename] = boundary;
            if (verbose) console.log('- loaded GeoJSON file ' + elem);
            callback(null);
        }
    });
}

function processGeoJSON(task, callback) {
    if (verbose) console.log('- opening leveldb database ' + task);

    levelup('./ldb/' + task + '.ldb', function(err, db) {
        if (err) return callback(err);

        var q = async.queue(function(data, qcallback) {
            checkOverlaps(db, data, qcallback);
        });

        q.drain = function() {
            reorder(db, maxOverlaps, function(err) {
                db.close(function(err) {
                    callback(err);
                });
            });
        };

        maxOverlaps = 0;
        if (verbose) console.log('- checking for geometry overlap');
        db.createReadStream()
            .on('data', function(data) {
                q.push(data);
            });
    });
}

function checkOverlaps(db, data, callback) {
    data.value = JSON.parse(data.value);

    // if this task is already fixed, skip it
    if (key.decompose(data.key).skipval === 0) return callback(null);

    // check if point is in any geojson geometries
    var overlapCount = 0;
    Object.keys(geojson).every(function(k) {
        
        // check for valid point geometry in the task object
        if (!data.value.st_astext) {
            if (verbose) console.log('# missing geometry (st_astext) for key ' + data.key);
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
        if (verbose && err) console.log('# error saving key ' + data.key + '#' + overlapCount);
        callback(err);
    });
}

function reorder(db, maxOverlaps, callback) {
    // iterate through all keys, adding (maxOverlaps - overlap) to each skipval
    if (verbose) console.log('- reordering tasks');
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
            db.del(data.key, function(err) {
                if (err && verbose) console.log('# error deleting key ' + newKey);
                db.put(newKey, JSON.stringify(data.value), function(err) {
                    if (err && verbose) console.log('# error saving key ' + newKey);
                    reordered++;
                });
            });
        })
        .on('end', function() {
            if (verbose) console.log('- finished, reprioritized ' + adjustmentsMade + '/' + reordered + ' tasks');
            callback(null);
        });
}

module.exports = prioritize;
