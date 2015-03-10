var upload = require('./upload.js');

function route(obj) {
    if (obj.auth && obj.qs._ == 'upload') {
        upload.init();
    } else {
        // remove the page and run the default callback
        var string = '';
        var query = Object.keys(obj.qs).filter(function(q) {
            return q != '_';
        }).map(function(x) {
            if (obj.qs[x]) {
                string += '&' + x + '=' + obj.qs[x];
            } else {
                string += '&' + x;
            }
        });
        history.pushState('', 'nothing', '?' + string.slice(1));
        obj.callback();
    }
}

module.exports = route;
