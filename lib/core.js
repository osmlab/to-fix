var qs = require('querystring').parse(window.location.search.slice(1)),
    store = require('store');

var core = {};

var url = 'http://54.204.149.4:3001/';
if (qs.local) url = 'http://127.0.0.1:3001/';

function request(error, callback) {
    $.ajax({
        crossDomain: true,
        url: url + 'error/' + error,
        type: 'post',
        data: JSON.stringify({user: store.get('username')})
    })
    .error(jqError)
    .done(callback);
}

core.item = function(error, callback) {
    request(error, function(data) {
        data = JSON.parse(data);
        window.current = data.value;
        window.current._id = data.key;
        return callback();
    });
};

core.mark = function(error, status, callback) {
    // mark it as done/inadequate/needing review, mark it as something
    // do we do those mappings here or on the server?
        // literal strings?
        // leave the definitions fluid on purpose
        // let the loader pick what status to pay attention to and ignore?

    $.ajax({
        crossDomain: true,
        url: url + 'fixed/' + error,
        type: 'post',
        data: JSON.stringify({
            user: store.get('username'),
            state: current
        })
    })
    .error(jqError)
    .done(callback);

    // state: current
    // not liking that at all
};

core.error = function(message) {
    $('#error-message span').text(message).show();
    $('#error-message').slideDown();
    setTimeout(function() {
        $('#error-message span').fadeOut(function(){
            $('#error-message').slideUp();
        });
    }, 5000);
};

function jqError(jqXHR, textStatus, errorThrown) {
    core.error(textStatus === 'timeout' ?
        errorMessage = 'Request timed out.' :
        jqXHR.responseText
    );
}

module.exports = core;
