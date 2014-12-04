var test = require('tape'),
    imprt = require('../lib/import');

test('csv import', function(t) {
    imprt.csv('csvtest', './test/fixtures/test.csv', function(err, count) {
        if (err) return t.fail(err);
        t.equal(count, 1000, 'imports a csv');
        t.end();
    });
});
