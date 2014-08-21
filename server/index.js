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
var port = 3001;
var lockperiod = 10*60;

http.createServer(router).listen(port, function() {
    console.log('running on port ' + port);
});

router.addRoute('/error/:error', {
    POST: function(req, res, opts) {
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            getNextItem(opts.error, res, function(err, kv) {
                if (err) return error(res, 500, err);
                track(error, +new Date() + ':' + body.user, {action: 'got', value: kv.key});
                res.writeHead(200, headers);
                return res.end(JSON.stringify(kv));
            });
        });
    }
});

function getNextItem(error, res, callback) {
    var location = './' + error + '.ldb';
    levelup(location, {createIfMissing: false}, function(err, db) {
        if (err) {
            // despite createIfMissing: false it still creates an empty dir, so we remove it
            return leveldown.destroy(location, function() {
                callback('No such database');
            });
        }

        var newKey = (+new Date() + lockperiod).toString() + Math.random().toString().slice(1, 4);

        db.createReadStream({limit: 1, lt: (+new Date())})
            .on('data', function(data) {
                db.del(data.key, function() {
                    // limbo
                    db.put(newKey, data.value, function(err) {
                        db.close();
                        data.key = newKey;
                        data.value = JSON.parse(data.value);
                        return callback(null, data);
                    });
                });
            })
            .on('error', function(data) {
                db.close();
                return callback('Something wrong with the database');
            });
    });
}

function track(error, key, value) {
    var trackingDb = './' + error + '-tracking.ldb';
    value = (typeof value == 'object') ? JSON.stringify(value) : value;
    levelup(trackingDb, function(err, db) {
        db.put(key, value, function(err) {
            db.close();
        });
    });
}

function error(res, code, errString) {
    res.writeHead(code, headers);
    return res.end(errString);
}
