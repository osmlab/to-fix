var http = require('http'),
    Route = require('routes-router'),
    pg = require('pg');

var router = Route(),
    port = 3000,
    connection = 'postgres://postgres@localhost/';

http.createServer(router).listen(port, function() {
    console.log('running on port ' + port);
});

router.addRoute('/problem/:db/:table/:id', {
    GET: function(req, res, opts) {
        // serves a random item
        var query = 'select * from ' + opts.table + ' where done = false limit 1;';
        quick_query(opts.db, query, function(err, result) {
            if (err) return console.log(err);
            console.log(result);
        });
        res.end(200);
    },
    POST: function(req, res, opts) {
        // update a specific item, requires :id
        if (opts.id) {
            // update item in pg
            // send success response
        } else {
            res.send(400);
        }
    }
});

function quick_query(database, query, cb) {
    var client = new pg.Client(conString + database)
        .connect(function(err) {
            if (err) return cb(err);
            client.query(function(err, result) {
                if (err) return cb(err);
                cb(false, result);
                client.end();
            });
        });
}

router.addRoute('/users', function(req, res) {
    // just dump the activity table
    // csv? 
    // hope to use it for vizualizations
    // make sure this reimportable to carry from instance to instance?
});
