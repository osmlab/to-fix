var levelup = require('levelup'),
    leveldown = require('leveldown');

levelup(process.argv[2], {createIfMissing: false}, function(err, db) {
    if (err) {
        if (db && !db.isClosed()) db.close();
        console.log('db error');
    }

    var count = 0;
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

            if (!stats[user]) stats[user] = [];

            stats[user].push({
                time: Math.round(time),
                type: type,
                data: data
            });

            count++;
        })
        .on('error', function(data) {
            db.close();
            console.log('some error');
        })
        .on('end', function() {
            console.log(JSON.stringify(stats, null, 4));

            console.log('\n\n\n');

            for (var user in stats) {
                // build the durations first
                for (var a = 0; a >= stats[user].length; a++) {
                    console.log();
                }
            }

        });
});
