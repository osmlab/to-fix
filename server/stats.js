// generates a -stats.csv file for a specified database
// if no database is specified, it creates one for each *.ldb it finds

var levelup = require('levelup'),
    leveldown = require('leveldown'),
    fs = require('fs');

if (process.argv[2]) {
    makeStats(process.argv[2]);
} else {
    fs.readdir('./', function(err, erthing) {
        erthing.forEach(function(path) {
            if (path.indexOf('-tracking.ldb') !== -1) makeStats(path);
        });
    });
}

function makeStats(dbLocation) {
    levelup(dbLocation, {createIfMissing: false}, function(err, db) {
        if (err) {
            if (db && !db.isClosed()) db.close();
            return console.log('opening error', err);
        }

        var stats = {};
        var fileName = dbLocation.split('-tracking.ldb').join('-stats.csv');
        var file = fs.createWriteStream(fileName);

        db.createReadStream()
            .on('data', function(event) {
                var data = JSON.parse(event.value);
                event.key = event.key.split(':');
                var type = data._action;
                delete data._action;
                var time = event.key[0];
                var user = event.key[1];
                var id = data._id || data.id;
                    // data.id was done in the first version by accident
                    // will remove when those databases are gone completely

                if (!stats[user]) stats[user] = {};
                if (!stats[user][id]) stats[user][id] = {};

                stats[user][id][type] = {
                    time: +time,
                    data: data
                };

            }).on('error', function(err) {
                db.close();
                return console.log('reading error', err);
            }).on('end', function() {
                file.write('time,action,user,duration');

                // this is nightmarish, might just do it clientside and deal
                for (var user in stats) {
                    for (var id in stats[user]) {
                        if ('fixed' in stats[user][id] && 'got' in stats[user][id]) {
                            // duration between got and fixed
                            var duration = stats[user][id].fixed.time - stats[user][id].got.time;
                            stats[user][id].fixed.data.duration = duration;
                        }

                        for (var type in stats[user][id]) {
                            var line = stats[user][id][type].time + ',';
                            line += type + ',';
                            line += user + ',';
                            if (type == 'fixed') {
                                line += stats[user][id][type].data.duration || 0;
                            } else {
                                line += 0;
                            }
                            file.write('\n' + line);
                        }

                        // just overall stats for now
                        // will want individual user stats soon
                    }
                }

                file.write('\n');
                file.end();
            });
    });
}
