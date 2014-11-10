var http = require('http'),
    Route = require('routes-router'),
    levelup = require('levelup'),
    leveldown = require('leveldown'),
    fs = require('fs'),
    md5 = require('crypto').createHash('md5'),
    tofix = require('./to-fix.js');

var level = {};

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

var dbs = fs.readdirSync('./ldb/').filter(function(item) {
   return item.indexOf('.ldb') > -1;
});

dbs.forEach(function(ldb, idx) {
    debug('-- Loading db ' + ldb);
    levelup('./ldb/' + ldb, {
        createIfMissing: false,
        max_open_files: 500
    }, function(err, db) {
        if (err) debug('ERROR: ' + err);
        level[ldb] = db;
        loaded_db_count++;
        if (idx >= dbs.length-1) runPostInit();
    });
});

function runPostInit(){
    if (process.argv[2] === '--fixed') {
        fixed = {}; 
        var num_fixed = 0;
        Object.keys(level).forEach(function(db){
            fixed[db] = [];

            level[db].createReadStream({lt: '0001'})
                .on('data', function(data) {
                    fixed[db].push(tofix.decomposeID(data.key).hash);
                })
                .on('end', function(err) {
                    num_fixed++;
                    if (num_fixed === Object.keys(level).length) {
                        process.stdout.write(JSON.stringify(fixed));
                    }
                });
        });
    } else {
        http.createServer(router).listen(port, function() {
            debug('running on port ' + port);
        });
    }
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

                // check that submitted error type exists
                var db = level[opts.params.error + '.ldb'];
                if (!db) return error(res, 500, opts.params.error + ' is not a valid error type');

                // retrieve the record's current state -- we can't trust the submitted state
                // not to have been modified by the clientside JS
                db.get(body.state._id, function(err, value) {
                    
                    if (err) {
                        debug('error fetching key value', body.state._id);
                        return error(rs, 500, 'error fetching key value ' + body.state._id);  
                    } 

                    // delete the record from positive skipval keyspace
                    db.del(body.state._id, function(err) {
                        if (err){
                            debug('error deleting', err);
                            return error(rs, 500, 'error deleting key value ' + body.state._id);  
                        } 
                    
                        // move record into skipval=0 keyspace, meaning it's fixed
                        var oldID = tofix.decomposeID(body.state._id);
                        var newID = tofix.composeID(0, oldID.hash);
                        db.put(newID, value);
                    });

                    res.writeHead(200, headers);
                    return res.end('');

                });
            }
        });
    }
});

function getNextItem(error, res, callback) {
    var newKey = (+new Date() + lockperiod).toString() + Math.random().toString().slice(1, 4);

    if (error === (undefined || 'undefined')) {
        return callback('db type cannot be undefined');
    } else {            
        var db = level[error + '.ldb'];
        if (!db) {
            return callback('Database \'' + error + '\' not loaded');
        } else {
            db.createReadStream({limit: 1, gt: '0001'})
                .on('data', function(data) {
                    var task_data = JSON.parse(data.value);                    
                    if (task_data.ignore) {
                        debug('Empty task database for error ' + error);
                        return callback('No valid tasks available for this error type.');
                    } else {
                        db.del(data.key, function() {
                            var oldID = tofix.decomposeID(data.key);
                            var newID = tofix.composeID((oldID.skipval + 1), oldID.hash);

                            db.put(newID, JSON.stringify(task_data), function(err) {
                                if (err) debug('put', err);
                                data.key = newID;
                                data.value = JSON.parse(data.value);
                                return callback(null, data);
                            });
                        });
                    }
                })
                .on('error', function(err) {
                    debug('CreateReadStream error', err);
                    return callback('Something wrong with the database for error type \'' + err + '\'');
                });
        }
    }
}

function track(error, user, action, value) {
    // value must be an object
    var key = +new Date() + ':' + user;
    value._action = action;
    value._hash = tofix.decomposeID(value._id).hash;
    value = JSON.stringify(value);

    var db = level[error + '-tracking.ldb'];

    if (db) {
        db.put(key, value, function(err) {
            if (err) debug('put', err);
        });
    } else {
        debug('could not track: database does not exist for', error);
    }
}

function error(res, code, errString) {
    res.writeHead(code, headers);
    return res.end(errString);
}
