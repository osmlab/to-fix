var fs = require('fs'),
    gju = require('geojson-utils'),
    key = require('./lib/key.js'),
    levelup = require('levelup'),
    wellknown = require('wellknown');

// adjusts skipvals based on geometry, prioritizing particular areas/markets

if (process.stdin.isTTY) {
    var quickMode = true; // should we bother matching against every geometry or just quit after one hit?

    if (process.argv.length < 4) {
        return console.log('file arguments are required\n`node prioritize.js [leveldb] [geojson1 geojson2 .. ]`');
    }

    // load geojson files
    var geojson = [];
    process.argv        
        .forEach(function(elem, i) {
            if (i <= 2) {
                // skip these -- not using .filter() to make async logic simpler
                return true;
            }
            if (elem === '--slow') {
                quickMode = false;
            }
            else {
                console.log('+ loading ' + elem);
                fs.readFile(elem, function(err, data) {
                    if (err) console.log('# Error loading GeoJSON file ' + elem);
                    console.log('- Adding GeoJSON file ' + elem);
                    geojson.push(JSON.parse(data));
                
                    if(i === process.argv.length-1) ProcessLevelDB();
                });                
            }
        });
}

function ProcessLevelDB(){
    console.log('- Opening LevelDB database ' + process.argv[2]);
    levelup(process.argv[2], function(err, db) {
        if (err) throw(err);

        var maxOverlaps = 0;
        console.log('- Checking for geometry overlap')
        db.createReadStream()
            .on('data', function(data) {
                data.value = JSON.parse(data.value);

                // if this task is already fixed, skip it
                if (key.decompose(data.key).skipval === 0) return;

                // check if point is in any geojson geometries
                var overlaps = 0;
                geojson.forEach(function(poly) {                    
                    if (!data.value.st_astext) {              
                        console.log('# Missing geometry (st_astext) for key ' + data.key);
                        return false;
                    } 

                    if( gju.pointInPolygon(wellknown.parse(data.value.st_astext), poly.features[0].geometry)) {
                        overlaps++;
                        if (quickMode) return false;
                    }
                });

                // track maximum number of overlaps
                maxOverlaps = Math.max(maxOverlaps, overlaps);

                data.value.overlaps = overlaps;
                db.put(data.key, JSON.stringify(data.value), function(err) {
                    if (err) console.log('# Error saving key ' + data.key + '#' + overlaps);
                });                
            })
            .on('end', function(){

                // iterate through all keys, adding (maxOverlaps - overlap) to each skipval
                console.log('- Reordering tasks')
                db.createReadStream()
                    .on('data', function(data) { 
                        data.value = JSON.parse(data.value);                               
                        var keyComponents = key.decompose(data.key);
                        var newKey = key.compose((keyComponents.skipval + (maxOverlaps - parseInt(data.overlaps))), keyComponents.hash);                    

                        // delete data.value.overlaps;
                        db.put(newKey, JSON.stringify(data.value), function(err) {
                            if (err) console.log('# Error saving key ' + newKey);                            
                        })
                    });

            });

    });
}