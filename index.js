var http = require('http'),
    Route = require('routes-router'),
    fs = require('fs'),
    key = require('./lib/key.js');

function debug(x){
    process.stderr.write(x + '\n');
}

var router = Route();
var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400'
};
var port = 3001;
var lockperiod = 10*60;

function runPostInit(){
    http.createServer(router).listen(port, function() {
        debug('running on port ' + port);
    });
}

router.addRoute('/error/:error', {
    POST: function(req, res, opts) {
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            body = JSON.parse(body);
            getNextItem(opts.params.error, res, function(err, kv) {
                if (err) {
                    debug('/error route', err);
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
        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            body = JSON.parse(body);
            if (body.user && body.state._id) {
                track(opts.params.error, body.user, 'fixed', body.state);

                // mark the thing as done

                res.writeHead(200, headers);
                return res.end('');
            }
        });
    }
});

function getNextItem(error, res, callback) {
    if (error === (undefined || 'undefined')) {
        return callback('db type cannot be undefined');
    } else {
        // get the thing
    }
}

function track(error, user, action, value) {
    // hstore?
}

function error(res, code, errString) {
    res.writeHead(code, headers);
    return res.end(errString);
}
