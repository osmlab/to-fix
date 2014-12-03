var csvParse = require('csv-parser'),
    fs = require('fs'),
    key = require('./key.js'),
    pg = require('pg').native;

// just k/v for now, geom requires some thinking and UI work

// user provides a table name and a csv
    // create the table
        // key, value, state
        // index key and state (primary)
    // benchmark many inserts vs COPY stream
        // COPY stream if necessary

var conString = "postgres://aaron@localhost/tofix";

function connect(callback) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if (err) return console.log(err);
        callback(client);
    });
}

function endClientErr(client, err) {
    console.log(err);
    return client.end();
}

function csv(tableName, csvLocation, callback) {
    connect(function(client) {
        var create = 'CREATE TABLE ' + tableName + ' (state INTEGER, key TEXT, value TEXT);';
        client.query(create, function(err, result) {
            if (err) return endClientErr(client, err);

            client.query('BEGIN', function(err, result) {
                if (err) return endClientErr(client, err);

                var stream = fs.createReadStream('../keepright-tasks/island.csv').pipe(csvParse());
                stream.on('data', function(data) {
                    var k = key.hashObject(data);
                    var v = JSON.stringify(data);
                    var insert = "INSERT INTO " + tableName + " VALUES(0,$1,$2)";
                    stream.pause();
                    client.query(insert, [k,v], function(err, result) {
                        if (err) {
                            return endClientErr(client, err);
                        }
                        // possibly set a counter and push on (x)n and end
                        stream.resume();
                    });
                }).on('end', function() {
                    client.query('COMMIT', client.end.bind(client));
                    callback();
                });

            });

        });
    });
}

// going to need special rows for the tables
    // or a special table with metadata about each table?
        // just a single row for each table?
    // tofix_meta
    // authed users, settings and such

module.exports = {
    csv: csv
};
