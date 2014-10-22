var http = require('http'),
    Route = require('routes-router'),
    levelup = require('levelup'),
    leveldown = require('leveldown'),
    fs = require('fs');

var level = {};

fs.readdirSync('./ldb/').filter(function(item) {
   return item.indexOf('.ldb') > -1;
}).forEach(function(ldb) {    
    console.log('-- Loading db ' + ldb);
    levelup('./ldb/' + ldb, {
        createIfMissing: false,
        max_open_files: 500
    }, function(err, db) {
        if(err) {
            console.log('ERROR: ' + err);
        }
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
    var newKey = (+new Date() + lockperiod).toString() + Math.random().toString().slice(1, 4);

    if((error===undefined)||(error==='undefined')){
        return callback('db type cannot be undefined');
    }
    else {            
        var db = level[error + '.ldb'];
        if(!db){
            return callback('Database \'' + error + '\' not loaded');
        }
        else {
            db.createReadStream({limit: 1, lt: (+new Date())})
                .on('data', function(data) {
                    var task_data = JSON.parse(data.value);

                    if ((task_data.id===-1) && (task_data.task_data===null)) {
                        console.log('Empty task database for error ' + error);
                        return callback('No valid tasks available for this error type.')
                    }
                    else {
                        db.del(data.key, function() {
                            var data_id = JSON.parse(data.value).id;
                            var task_data = JSON.parse(data.value).task_data;
                            db.put(newKey, JSON.stringify({id: data_id, task_data: task_data}), function(err) {
                                if (err) console.log('put', err);
                                data.key = newKey;
                                data.value = JSON.parse(data.value);
                                return callback(null, data);
                            });
                        });
                    }
                })
                .on('error', function(err) {
                    console.log('CreateReadStream error', err);
                    return callback('Something wrong with the database');
                }); 
        }
    }
    
}

function track(error, user, action, value) {
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
    res.writeHead(code, headers);
    return res.end(errString);
}
