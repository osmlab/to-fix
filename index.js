var http = require('http'),
    Route = require('routes-router'),
    pg = require('pg');

var router = Route(),
    port = 3000,
    connection = 'postgres://postgres@localhost/';

http.createServer(router).listen(port, function() {
    console.log('running on port ' + port);
});

router.addRoute('/error/:db/:table', {
    GET: function(req, res, opts) {
        // serves a random item
        var query = 'select object_type, object_id, ST_AsText(wkb_geometry) from ' + opts.table + ' order by random() limit 1;';
        quick_query(opts.db, query, function(err, result) {
            if (err) return console.log(err);
            console.log(result);
            // will res.end the results here
        });
        res.end('hello');
    },
    POST: function(req, res, opts) {
        // lets not for now
    }
});

function quick_query(database, query, cb) {
    pg.connect(connection + database, function(err, client) {
        if (err) return cb(err);
        client.query(query, function(err, result) {
            if (err) {
                client.end();
                return cb(err);
            }
            cb(result.rows[0]);
            client.end();
        });
    });
}
