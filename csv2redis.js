var fs = require('fs'),
    md5 = require('MD5'),
    redis = require('redis'),
    csv = require('csv-parser');

var client = redis.createClient();
var task = process.argv[2].split('.')[0];

client.on('error', function(err) {
    console.log('err', err);
});

fs.createReadStream(process.argv[2])
    .pipe(csv())
    .on('data', function(data) {
        data = JSON.stringify(data);
        var key = md5(data);
        client.sadd(task, key);
        client.hset(task + ':' + key, 'error', data);
    })
    .on('end', function() {
        client.quit();
    });
