var http = require('http'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    key = require('./lib/key.js');

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function debug(x){
    process.stderr.write(x + '\n');
}

app.get('/', function(req, res){
    res.send('hey hey hey');
});

app.post('/error/:error', function(req, res) {
    getNextItem(req.params.error, res, function(err, kv) {
        if (err) {
            debug('/error route', err);
            return error(res, 500, err);
        }
        track(req.params.error, req.body.user, 'got', {_id: kv.key});
        res.writeHead(200, headers);
        return res.end(JSON.stringify(kv));
    });
});

app.post('/fixed/:error', function(req, res) {
    var body = req.body;
    if (body.user && body.state._id) {
        track(req.params.error, body.user, 'fixed', body.state);

        // mark the thing as done

        res.writeHead(200, headers);
        return res.end('');
    }
});

app.post('/import', function(req, res) {
    // request the url that the user provides
        // download the csv to a tmp

    // endpoint + UI
        // specify tablename, use filename path.basename if no specified
        // specify file location
});

app.listen(3001);

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
