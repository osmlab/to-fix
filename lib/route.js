function route(obj) {
    if (obj.isAuthenticated && obj.qs._ == 'upload') {
        // render the upload page in #main
        // just launch a template and run cooresponding code?
        // how does this jive with with current single load()?
        console.log('uploading');
    } else {
        // remove the page and run the default callback
        var string = '';
        var query = Object.keys(obj.qs).filter(function(q) {
            return q != '_';
        }).map(function(x) {
            string += '&' + x + '=' + obj.qs[x];
        });
        history.pushState('', 'nothing', '?' + string.slice(1));
        obj.callback();
    }
}

module.exports = route;
