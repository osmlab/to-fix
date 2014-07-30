var fs = require('fs'),
    md5 = require('MD5'),
    redis = require('redis'),
    csv = require('csv-parser'),
    argv = require('minimist')(process.argv.slice(2));

var client = redis.createClient();

client.on('error', function(err) {
    console.log('err', err);
});

fs.createReadStream(argv._[0])
    .pipe(csv())
    .on('data', function(data) {
        data = JSON.stringify(data);
        client.set(md5(data), data);
    })
    .on('end', function() {
        client.quit();
    });
