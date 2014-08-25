var levelup = require('levelup'),
    leveldown = require('leveldown');

levelup(process.argv[2], {createIfMissing: false}, function(err, db) {
    if (err) {
        if (db && !db.isClosed()) db.close();
        console.log('db error');
    }

    var count = 0;
    var stats = {};

    db.createReadStream()
        .on('data', function(data) {
            // take some event and data that is associated with it
            // this all needs to be structured better

            data.key = data.key.split(':');
            var time = data.key[0];
            var user = data.key[1];
            data.value = JSON.parse(data.value);
            var id = data.value._id;
            var action = data.value._action;

            if (!stats[user]) stats[user] = {};
            if (!stats[user][id]) stats[user][id] = {};
            if (!stats[user][id][action]) stats[user][id][action] = [];

            stats[user][id][action] = Math.round(time);

            // not sure how we want to organize this
            // how are we going to display it?

            count++;
        })
        .on('error', function(data) {
            db.close();
            console.log('some error');
        })
        .on('end', function() {
            console.log('' + count + ' items.');
            console.log(JSON.stringify(stats, null, 4));
        });
});
