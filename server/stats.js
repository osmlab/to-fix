var levelup = require('levelup'),
    leveldown = require('leveldown');

levelup(process.argv[2], {createIfMissing: false}, function(err, db) {
    if (err) {
        if (db && !db.isClosed()) db.close();
        console.log('db error');
    }

    var stats = {};
    var fixedCache = [];

    // first fill in shallow details
        // on end, loop through and fill in detail

    db.createReadStream()
        .on('data', function(event) {
            // take some event and the data associated with it
            // this all needs to be structured better

            // type, time, data
            // goal: csv

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
            // console.log(JSON.stringify(stats, null, 4));
            for (var user in stats) {
                // build the durations first
                for (var error in stats[user]) {
                    if ('fixed' in stats[user][error] && 'got' in stats[user][error]) {
                        // duration between got and fixed
                        var duration = stats[user][error].fixed.time - stats[user][error].got.time;
                    }
                }
            }

        });
});
