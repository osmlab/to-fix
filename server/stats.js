var levelup = require('levelup'),
    leveldown = require('leveldown'),
    overall = require('fs').createWriteStream('overall.csv');

levelup(process.argv[2], {createIfMissing: false}, function(err, db) {
    if (err) {
        if (db && !db.isClosed()) db.close();
        console.log('db error');
    }

    var stats = {};

    db.createReadStream()
        .on('data', function(event) {
            var data = JSON.parse(event.value);
            event.key = event.key.split(':');
            var type = data._action;
            delete data._action;
            var time = event.key[0];
            var user = event.key[1];
            var id = data._id;

            if (!stats[user]) stats[user] = {};
            if (!stats[user][id]) stats[user][id] = {};

            stats[user][id][type] = {
                time: +time,
                data: data
            };

        }).on('error', function(data) {
            db.close();
            console.log('some error');
        }).on('end', function() {
            overall.write('time,action,user,duration');

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
                            line += stats[user][id][type].data.duration;
                        } else {
                            line += 0;
                        }
                        overall.write('\n' + line);
                    }

                    // just overall stats for now
                    // will want individual user stats soon
                }
            }

            overall.write('\n');
            overall.end();
        });
});
