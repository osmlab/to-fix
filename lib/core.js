'use strict';

var $ = require('jquery');
var qs = require('querystring').parse(window.location.search.slice(1));
var store = require('store');

var core = {};
var url = 'http://54.204.149.4:3001/';
url = 'http://localhost:8000/';
// url = 'http://54.237.126.85:8000/';
if (qs.local) url = 'http://127.0.0.1:3001/';

function request(error, callback) {
    $.ajax({
        crossDomain: true,
        url: url + 'error/' + error,
        type: 'POST',
        data: JSON.stringify({user: store.get('username')})
    })
    .error(jqError)
    .done(callback);
}

core.item = function(error, callback) {
    // eventually remove the need for specifying error
    // can get by on callback only
    request(error, function(data) {
        data = JSON.parse(data);
        window.current.item = data.value;
        window.current.item._id = data.key;
        return callback();
    });
};

core.mark = function(status, callback) {
    // mark it as done/inadequate/needing review, mark it as something
    // do we do those mappings here or on the server?
    // literal strings?
    // leave the definitions fluid on purpose
    // let the loader pick what status to pay attention to and ignore?

    // not doing anything with status yet, we'll want to sort by it eventually
    // thinking about hstore for "state" eventually, need to think about it a bit

    $.ajax({
        crossDomain: true,
        url: url + 'fixed/' + qs.error,
        type: 'POST',
        data: JSON.stringify({
            user: store.get('username'),
            state: window.current.item
        }),
        contentType: 'text/plain'
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
        $('#error-message span').fadeOut(function() {
            $('#error-message').slideUp();
        });
    }, 5000);
};

core.upload = function(formData, callback) {
    $.ajax({
        crossDomain: true,
        url: url + 'csv',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
    })
    .error(callback)
    .done(function() {
        callback();
    });
};

function jqError(jqXHR, textStatus) {
    core.error(textStatus === 'timeout' ?
        'Request timed out.' :
        jqXHR.responseText
    );
}

module.exports = core;
