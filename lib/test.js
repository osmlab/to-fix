var imprt = require('./import.js');

imprt.csv('un1', 'osmi-tasks/unconnected_major2.csv', function(err) {
    if (!err) return console.log('done!');
    console.log(err);
});
