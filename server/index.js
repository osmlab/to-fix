var http = require('http'),
    Route = require('routes-router'),
    levelup = require('levelup');

var router = Route();
var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400'
};
var port = 3000;
var lockperiod = 10*60;

http.createServer(router).listen(port, function() {
    console.log('running on port ' + port);
});

router.addRoute('/error/:error', {
    GET: function(req, res, opts) {
        try {
            db = levelup('./' + opts.error + '.ldb', {
                createIfMissing: false
            });
        } catch (e) {
            res.writeHead(404, headers);
            return res.end('No such error');
        }

        var newKey = (+new Date() + lockperiod).toString() + Math.random().toString().slice(1, 4);

        // how is leveldb sorting?
        db.createReadStream({limit: 1, lt: (+new Date())})
            .on('data', function(data) {
                db.del(data.key, function() {
                    // limbo
                    db.put(newKey, data.value, function(err) {
                        db.close();
                        data.key = newKey;
                        data.value = JSON.parse(data.value);
                        res.writeHead(200, headers);
                        return res.end(JSON.stringify(data));
                    });
                });
            })
            .on('error', function(data) {
                db.close();
                res.writeHead(404, headers);
            });
    }
});
