var fs = require('fs');

var qs = require('querystring').parse(window.location.search.slice(1)),
    omnivore = require('leaflet-omnivore'),
    BingLayer = require('./bing.js'),
    osmAuth = require('osm-auth'),
    store = require('store'),
    _ = require('underscore');

// is there anyway to keep the loaders completely seperate and only import them at runtime?
    // would this allow us to import external loaders, for example via a gist

// how to simplify
    // don't declare any loaders in index.js
        // pull them in when needed, they are fully bundled themselves
        // if they're missing, catch and display an error
    // map titles and descriptions get put in the loaders themselves

var keepright = require('../loaders/keepright.js'),
    osmi_geom = require('../loaders/osmi_geom.js'),
    unconnected = require('../loaders/unconnected.js'),
    tigerdelta = require('../loaders/tigerdelta.js');

var templates = {
    sidebar: _(fs.readFileSync('./templates/sidebar.html', 'utf8')).template(),
    settings: _(fs.readFileSync('./templates/settings.html', 'utf8')).template()
};

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
    'duplicate_ways': {
        title: 'Duplicate Ways',
        loader: osmi_geom },
    'tigerdelta-named': {
        title: 'Missing/misaligned TIGER',
        loader: tigerdelta }
};

var DEFAULT = 'deadendoneway';

window.current = {};

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
                    current: qs.error,
                    authed: isAuthenticated(),
                    username: store.get('username'),
                    avatar: store.get('avatar')
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
    current: qs.error,
    authed: isAuthenticated(),
    avatar: store.get('avatar'),
    username: store.get('username')
}));

$('#settings').html(templates.settings());

function isAuthenticated() {
    return (auth.authenticated() && store.get('username') && store.get('userid'));
}

if (qs.error === undefined) window.location.href = window.location.href + '?error=' + DEFAULT;

function load() {
    var task = tasks[qs.error].loader;
        // this task hash should be it's own module that can be called by core for core.mark('done')
            // without needing a callback
    current.loader = task;
        // temporary, needs a real module

    // eventually, remove everything ".loader."
    // the loader will have everything in it, so calling tasks.smthng will take care of it
    if (!task.auth || (task.auth && isAuthenticated())) {
        // eventually task.auth will be an array with the different types of allowable authentications
            // this will correspond with details in localstorage
        task.next();
    } else {
        return;
    }
}

$(load);
