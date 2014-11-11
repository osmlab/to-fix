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

    // process command line params, load geojson files
    var geojson = [];
    process.argv        
        .forEach(function(elem, i) {
            if (i <= 2) {
                // skip require params -- choosing not to use .filter() to make async logic simpler below
                return true;
            }

            // if using overlapping geojson files, this flag might be useful. otherwise, no.
            if (elem === '--slow') {
                quickMode = false;
            }
            else {
                fs.readFile(elem, function(err, data) {
                    if (err) console.log('# Error loading GeoJSON file ' + elem);                
                    var boundary = JSON.parse(data);
                    if((boundary===null) || (!boundary.features)) {
                        console.log('# failed to load valid GeoJSON from ' + elem);
                    }
                    else {
                        geojson.push(boundary);  
                        console.log('- loaded GeoJSON file ' + elem);  
                    }
                    
                    // if all params have been loaded, begin main processing
                    if(i === process.argv.length-1) ProcessLevelDB();
                });                
            }
        });
}

function ProcessLevelDB(){
    console.log('- opening leveldb database ' + process.argv[2]);
    levelup(process.argv[2], function(err, db) {
        if (err) throw(err);

        var maxOverlaps = 0;
        console.log('- checking for geometry overlap')
        db.createReadStream()
            .on('data', function(data) {
                data.value = JSON.parse(data.value);

                // if this task is already fixed, skip it
                if (key.decompose(data.key).skipval === 0) return;

                // check if point is in any geojson geometries
                var overlaps = 0;
                geojson.forEach(function(poly) {                    
                    if (!data.value.st_astext) {              
                        console.log('# missing geometry (st_astext) for key ' + data.key);
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
                    if (err) console.log('# error saving key ' + data.key + '#' + overlaps);
                });                
            })
            .on('end', function(){

                // iterate through all keys, adding (maxOverlaps - overlap) to each skipval
                console.log('- reordering tasks')
                var adjustmentsMade = 0;
                
                db.createReadStream()
                    .on('data', function(data) { 
                        data.value = JSON.parse(data.value);  
                       
                        var keyComponents = key.decompose(data.key);
                        var newKey = key.compose((keyComponents.skipval + (maxOverlaps - parseInt(data.value.overlaps))), keyComponents.hash);                    

                        if (parseInt(data.value.overlaps) > 0) {
                            adjustmentsMade++;
                        }

                        delete data.value.overlaps;
                        db.put(newKey, JSON.stringify(data.value), function(err) {
                            if (err) console.log('# error saving key ' + newKey);                            
                        });

                    })
                    .on('end', function() {
                        console.log('- finished, reprioritized ' + adjustmentsMade + ' tasks')
                    });
            });

    });
}