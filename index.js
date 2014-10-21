var http = require('http'),
    Route = require('routes-router'),
    levelup = require('levelup'),
    leveldown = require('leveldown'),
    fs = require('fs');

var level = {};

fs.readdirSync('./').filter(function(item) {
   return item.indexOf('.ldb') > -1;
}).forEach(function(ldb) {
    levelup(ldb, {
        createIfMissing: false,
        max_open_files: 500
    }, function(err, db) {
        level[ldb] = db;
    });
});

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
        console.log('--- POST /error');
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            body = JSON.parse(body);
            getNextItem(opts.params.error, res, function(err, kv) {
                if (err) {
                    console.log('/error route', err);
                    return error(res, 500, err);
                }
                track(opts.params.error, body.user, 'got', {_id: kv.key});
                res.writeHead(200, headers);
                return res.end(JSON.stringify(kv));
            });
        });
    }
});

router.addRoute('/fixed/:error', {
    POST: function(req, res, opts) {
        console.log('--- POST /fixed');

        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            body = JSON.parse(body);
            if (body.user && body.state._id) {
                track(opts.params.error, body.user, 'fixed', body.state);

                level[opts.params.error + '.ldb'].del(body.state._id, function(err) {
                    if (err) console.log('delete', err);
                });

                res.writeHead(200, headers);
                return res.end('');
            }
        });
    }
});

function getNextItem(error, res, callback) {

    console.log('--- getNextItem()');

    var newKey = (+new Date() + lockperiod).toString() + Math.random().toString().slice(1, 4);

    if((error===undefined)||(error==='undefined')){
        return callback('db type cannot be undefined');
    }
    else {
        var db = level[error + '.ldb'];        
        db.createReadStream({limit: 1, lt: (+new Date())})
            .on('data', function(data) {
                db.del(data.key, function() {
                    db.put(newKey, data.value, function(err) {
                        if (err) console.log('put', err);
                        data.key = newKey;
                        data.value = JSON.parse(data.value);
                        return callback(null, data);
                    });
                });
            })
            .on('error', function(err) {
                console.log('CreateReadStream error', err);
                return callback('Something wrong with the database');
            }); 
    }
    
}

function track(error, user, action, value) {
    console.log('--- track()');


    // value must be an object
    var key = +new Date() + ':' + user;
    value._action = action;
    value = JSON.stringify(value);

    var db = level[error + '-tracking.ldb'];
    db.put(key, value, function(err) {
        if (err) console.log('put', err);
    });
}

function error(res, code, errString) {
    console.log('--- error()');

    res.writeHead(code, headers);
    return res.end(errString);
}
