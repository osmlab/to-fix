var http = require('http'),
    Route = require('routes-router'),
    levelup = require('levelup'),
    leveldown = require('leveldown');

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
        var location = './' + opts.error + '.ldb';

        levelup(location, {createIfMissing: false}, function(err, db) {
            if (err) {
                // despite createIfMissing: false it still creates an empty dir, so we remove it
                return leveldown.destroy(location, function() {
                    error(res, 500, 'No such database');
                });
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
                    return error(res, 500, 'Something wrong with the database');
                });
        });
    }
});

function error(res, code, errString) {
    res.writeHead(code, headers);
    return res.end(errString);
}
