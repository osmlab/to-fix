var http = require('http'),
    Route = require('routes-router'),
    redis = require('redis');

var client = redis.createClient();
var router = Route();
var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400'
};
var port = 3000;

http.createServer(router).listen(port, function() {
    console.log('running on port ' + port);
});

router.addRoute('/error/:error', {
    GET: function(req, res, opts) {
        client.send_command('SRANDMEMBER', [opts.error], function(err, key) {
            if (err) {
                return console.log(err);
                res.writeHead(404, headers);
                return res.end('ERROR');
            }
            client.hgetall(opts.error + ':' + key, function(err, value) {
                if (err) {
                    return console.log(err);
                    res.writeHead(404, headers);
                    return res.end('ERROR');
                }
                res.writeHead(200, headers);
                return res.end(JSON.stringify(value));
            });
        });
    }
});
