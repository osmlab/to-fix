var http = require('http'),
    Route = require('routes-router'),
    pg = require('pg');

var router = Route(),
    port = 3000,
    connection = 'postgres://postgres@localhost/';

var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400'
};

http.createServer(router).listen(port, function() {
    console.log('running on port ' + port);
});

router.addRoute('/error/keepright/:table', {
    GET: function(req, res, opts) {
        var query = 'select object_type, object_id, ST_AsText(wkb_geometry) from ' + opts.table + ' order by random() limit 1;';
        quick_query('keepright', query, function(err, result) {
            if (err) {
                console.log(err);
                res.writeHead(404, headers);
                return res.end('ERROR');
            }
            res.writeHead(200, headers);
            res.end(JSON.stringify(result));
        });
    },
    POST: function(req, res, opts) {
        // lets not for now
    }
});

router.addRoute('/error/osmi/:table', {
    GET: function(req, res, opts) {
        var query = '';
        switch (opts.table) {
            case 'intersections' || 'intersection_lines':
                query = 'select rel_id ';
                break;
            // case role_mismatch:

            //     break;
            // case role_mismatch_hull:

            //     break;
            case 'unconnected_major1' ||
                'unconnected_major2' ||
                'unconnected_major5' ||
                'unconnected_minor1' ||
                'unconnected_minor2':
                    query = 'select way_id, node_id, error_desc ';
                    break;
            default:
                console.log('no hit');
                res.writeHead(404, headers);
                return res.end('ERROR');
        }

        query += ' from ' + opts.table + ' order by random() limit 1;';
        quick_query('osmi', query, function(err, result) {
            if (err) return console.log(err);
            res.writeHead(200, headers);
            res.end(JSON.stringify(result));
        });
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
            client.end();
            cb(null, result.rows[0]);
        });
    });
}
