var fs = require('fs'),
    md5 = require('MD5'),
    redis = require('redis'),
    csv = require('csv-parser'),
    levelup = require('levelup'),
    path = require('path');

var task = path.basename(process.argv[2]).split('.')[0],
    client = redis.createClient(),
    db = levelup('./' + task + '.ldb');

client.on('error', function(err) {
    console.log('err', err);
});

fs.createReadStream(process.argv[2])
    .pipe(csv())
    .on('data', function(data) {
        var key = md5(JSON.stringify(data));
        try {
            client.sadd(task, key);
            db.put(key, data, function (err) {
                console.log('put ' + key);
            });
        } catch (e) {
            console.log(e);
        }
    })
    .on('end', function() {
        client.quit();
    });
