var fs = require('fs');

var querystring = require('querystring'),
    omnivore = require('leaflet-omnivore'),
    BingLayer = require('./bing.js'),
    osmAuth = require('osm-auth'),
    store = require('store'),
    _ = require('underscore');

// is there anyway to keep the loaders completely seperate and only import them at runtime?
    // would this allow us to import external loaders, for example via a gist

var keepright = require('../loaders/keepright.js'),
    osmi_geom = require('../loaders/osmi_geom.js'),
    unconnected = require('../loaders/unconnected.js'),
    tigerdelta = require('../loaders/tigerdelta.js');

var templates = {
    sidebar: _(fs.readFileSync('./templates/sidebar.html', 'utf8')).template(),
    settings: _(fs.readFileSync('./templates/settings.html', 'utf8')).template()
};

var url = 'http://54.204.149.4:3001/';
if (qs('local')) url = 'http://127.0.0.1:3001/';

var auth = osmAuth({
    oauth_consumer_key: 'KcVfjQsvIdd7dPd1IFsYwrxIUd73cekN1QkqtSMd',
    oauth_secret: 'K7dFg6rfIhMyvS8cPDVkKVi50XWyX0ibajHnbH8S',
    landing: 'land.html'
});

var tasks = {
    'deadendoneway': {
        title: 'Impossible one-ways',
        loader: keepright },
    'impossibleangle': {
        title: 'Kinks',
        loader: keepright },
    'mixedlayer': {
        title: 'Mixed layers',
        loader: keepright },
    'nonclosedways': {
        title: 'Broken polygons',
        loader: keepright },
    'loopings': {
        title: 'Loopings',
        loader: keepright },
    'strangelayer': {
        title: 'Strange layer',
        loader: keepright },
    'highwayhighway': {
        title: 'Highway intersects highway',
        loader: keepright },
    'highwayfootpath': {
        title: 'Highway intersects footpath',
        loader: keepright },
    'highwayriverbank': {
        title: 'Highway intersects water',
        loader: keepright },
    'mispelledtags': {
        title: 'Mispelled tags',
        loader: keepright },
    'unconnected_major1': {
        title: 'Unconnected major < 1m',
        loader: unconnected },
    'unconnected_major2': {
        title: 'Unconnected major < 2m',
        loader: unconnected },
    'unconnected_major5': {
        title: 'Unconnected major < 5m',
        loader: unconnected },
    'unconnected_minor1': {
        title: 'Unconnected minor < 1m',
        loader: unconnected },
    'unconnected_minor2': {
        title: 'Unconnected minor < 2m',
        loader: unconnected },
    'tigerdelta-named': {
        title: 'Missing/misaligned TIGER',
        loader: tigerdelta },
    'duplicate_ways': {
        title: 'Duplicate Ways',
        loader: osmi_geom },
    'tokyo_dupes': {
        title: 'Tokyo Dupes',
        focus: true,
        loader: osmi_geom },
    'tokyo_islands': {
        title: 'Tokyo Islands',
        focus: true,
        loader: osmi_geom }
};

var DEFAULT = 'deadendoneway';
var ERROR_MESSAGE_TIMEOUT = 5000;

window.current = {};

window.featureStyle = {
    color: '#FF00B7',
    opacity: 1,
    weight: 4
};

window.altStyle = {
    color: '#00BFFF',
    opacity: 1,
    weight: 4
};

$('#sidebar').on('click', '#login', function(e) {
    e.preventDefault();
    auth.authenticate(function(err) {
        auth.xhr({
            method: 'GET',
            path: '/api/0.6/user/details'
        }, function(err, details) {
            if (err) return console.log(err);
            if (auth.authenticated()) {
                details = details.getElementsByTagName('user')[0];
                store.set('username', details.getAttribute('display_name'));
                store.set('userid', details.getAttribute('id'));
                store.set('avatar', details.getElementsByTagName('img')[0].getAttribute('href'));
                $('#sidebar').html(templates.sidebar({
                    tasks: tasks,
                    current: qs('error'),
                    authed: isAuthenticated()
                }));
                load();
            }
        });
    });
});

$('#sidebar').on('click', '#logout', function(e) {
    e.preventDefault();
    auth.logout();
    window.location.href = '';
});

$('#sidebar').html(templates.sidebar({
    tasks: tasks,
    current: qs('error'),
    authed: isAuthenticated(),
    avatar: store.get('avatar'),
    username: store.get('username')
}));

$('#settings').html(templates.settings());
$(load);

function next(err, current) {
    $('#map').addClass('loading');
    featureGroup.getLayers().forEach(function(layer) {
        featureGroup.removeLayer(layer);
    });
    load();
}

function showErrorMessage(jqXHR, textStatus, errorThrown) {
    var errorMessage = jqXHR.responseText;
    if (textStatus === 'timeout') errorMessage = 'Request timed out.';
    $('#error-message span').text(errorMessage).show();
    $('#error-message').slideDown();
    setTimeout(function() { 
        $('#error-message span').fadeOut(function(){
            $('#error-message').slideUp();
        });
    }, ERROR_MESSAGE_TIMEOUT);
}

// function markDone() {
//     Mousetrap.unbind(['enter', 'e']);

//     $.ajax({
//         crossDomain: true,
//         url: url + 'fixed/' + qs('error'),
//         type: 'post',
//         data: JSON.stringify({
//             user: store.get('username'),
//             state: current
//         })
//     })
//     .error(showErrorMessage)
//     .done(next);
// }

function isAuthenticated() {
    return (auth.authenticated() && store.get('username') && store.get('userid'));
}

function load() {
    if (!isAuthenticated()) {
        // set some temp vars
        // limit functionality
        // but otherwise, act like any other user
        return;
    }

    if (qs('error') === undefined) return window.location.href = window.location.href + '?error=' + DEFAULT;

    if (tasks[qs('error')].focus) {
        var title = $('#title');
        title.text(tasks[(qs('error'))].title);
        title.show();
    }

    $.ajax({
        crossDomain: true,
        url: url + 'error/' + qs('error'),
        type: 'post',
        data: JSON.stringify({user: store.get('username')})
    })
    .error(showErrorMessage)
    .done(function(data) {
        data = JSON.parse(data);
        current = data.value;
        current._id = data.key;

        $('#map').removeClass('loading');
        return tasks[qs('error') || DEFAULT].loader.next(load);
    });
}

function qs(name) {
    return querystring.parse(window.location.search.slice(1))[name];
}
