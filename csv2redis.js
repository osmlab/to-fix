var fs = require('fs'),
    md5 = require('MD5'),
    redis = require('redis'),
    csv = require('csv-parser');

var client = redis.createClient();
var task = process.argv[2].split('.')[0];

client.on('error', function(err) {
    console.log('err', err);
});

// if this gets too slow checkout multi
// https://github.com/mranney/node_redis#clientmulticommands

fs.createReadStream(process.argv[2])
    .pipe(csv())
    .on('data', function(data) {
        var key = md5(JSON.stringify(data));
        try {
            client.sadd(task, key);
            client.hmset(task + ':' + key, data);
        } catch (e) {
            console.log(e);
        }
    })
    .on('end', function() {
        client.quit();
    });
