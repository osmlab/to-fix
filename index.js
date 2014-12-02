var http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    key = require('./lib/key.js');

app.use(bodyParser.json());

function debug(x){
    process.stderr.write(x + '\n');
}

var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400'
};
var port = 3001;

app.get('/', function(req, res){
  res.send('hello world');
});

app.post('/error/:error', function(req, res) {
    getNextItem(opts.params.error, res, function(err, kv) {
        if (err) {
            debug('/error route', err);
            return error(res, 500, err);
        }
        track(opts.params.error, req.body.user, 'got', {_id: kv.key});
        res.writeHead(200, headers);
        return res.end(JSON.stringify(kv));
    });
});

app.post('/fixed/:error', function(req, res) {
    var body = req.body;
    if (body.user && body.state._id) {
        track(opts.params.error, body.user, 'fixed', body.state);

        // mark the thing as done

        res.writeHead(200, headers);
        return res.end('');
    }
});

app.listen(port);

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
