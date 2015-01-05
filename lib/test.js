var imprt = require('./import.js');

imprt.csv('csvtest', './test/fixtures/test.csv', function(err, count) {
    if (err) return console.log(err);
    console.log(count);
});
