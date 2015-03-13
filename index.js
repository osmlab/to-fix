require('mapbox.js');
require('leaflet-osm');

var $ = require('jquery');
var fs = require('fs');
var qs = require('querystring').parse(window.location.search.slice(1));
var osmAuth = require('osm-auth');
var store = require('store');
var _ = require('underscore');
var route = require('./lib/route');
var Raven = require('raven-js');

L.mapbox.accessToken = 'pk.eyJ1IjoiYWFyb25saWRtYW4iLCJhIjoiNTVucTd0TSJ9.wVh5WkYXWJSBgwnScLupiQ';
Raven.config('https://e45a6671d39447fda045d873eba13840@app.getsentry.com/35914').install();

/* TODO is there anyway to keep the loaders completely seperate and only import
 * them at runtime?
 *
 * Would this allow us to import external loaders, for example via a gist how to simplify
 * - Don't declare any loaders in index.js
 * - Pull them in when needed, they are fully bundled themselves
 * - If they're missing, catch and display an error
 * - Map titles and descriptions get put in the loaders themselves
 */
var keepright = require('./lib/loaders/keepright.js');
var osmigeom = require('./lib/loaders/osmigeom.js');
var unconnected = require('./lib/loaders/unconnected.js');
var tigerdelta = require('./lib/loaders/tigerdelta.js');

var templates = {
    app: _(fs.readFileSync('./templates/app.html', 'utf8')).template(),
    sidebar: _(fs.readFileSync('./templates/sidebar.html', 'utf8')).template(),
    settings: _(fs.readFileSync('./templates/settings.html', 'utf8')).template()
};

var auth = osmAuth({
    url: 'https://www.openstreetmap.org',
    oauth_consumer_key: 'KcVfjQsvIdd7dPd1IFsYwrxIUd73cekN1QkqtSMd',
    oauth_secret: 'K7dFg6rfIhMyvS8cPDVkKVi50XWyX0ibajHnbH8S',
    landing: 'land.html'
});

// just use another qs
// loader=keepright&error=deadendoneway

// then all the possible titles are in the loader?
// do we just have a description.json ?
var tasks = {
    'deadendoneway': {
        title: 'Impossible one-ways',
        loader: keepright
    },
    'impossibleangle': {
        title: 'Kinks',
        loader: keepright
    },
    'mixedlayer': {
        title: 'Mixed layers',
        loader: keepright
    },
    'nonclosedways': {
        title: 'Broken polygons',
        loader: keepright
    },
    'loopings': {
        title: 'Loopings',
        loader: keepright
    },
    'strangelayer': {
        title: 'Strange layer',
        loader: keepright
    },
    'highwayhighway': {
        title: 'Highway intersects highway',
        loader: keepright
    },
    'highwayfootpath': {
        title: 'Highway intersects footpath',
        loader: keepright
    },
    'highwayriverbank': {
        title: 'Highway intersects water',
        loader: keepright
    },
    'mispelledtags': {
        title: 'Misspelled tags',
        loader: keepright
    },
    'unconnected_major': {
        title: 'Unconnected major',
        loader: unconnected
    },
    'unconnected_minor1': {
        title: 'Unconnected minor',
        loader: unconnected
    },
    'duplicate_ways': {
        title: 'Duplicate Ways',
        loader: osmigeom
    },
    'tigerdelta-named': {
        title: 'Missing/misaligned TIGER',
        loader: tigerdelta
    }
};

var DEFAULT = 'deadendoneway';

window.current = {};

$('body').append(templates.app({
    sidebar: store.get('sidebar')
}));

$('.js-login').on('click', function() {
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
                $('#sidebar').remove();
                $('#sidebar').html(templates.sidebar({
                    tasks: tasks,
                    current: qs.error,
                    authed: isAuthenticated(),
                    username: store.get('username'),
                    avatar: store.get('avatar')
                }));

                // this is a bit hacky, just refresh?
                if ($('#editbar').length) $('#editbar').remove();

                load();
            }
        });
    });
    return false;
});

$('.logout').on('click', function() {
    auth.logout();
    window.location.href = '';
    return false;
});

$('#sidebar').html(templates.sidebar({
    tasks: tasks,
    current: qs.error,
    authed: isAuthenticated(),
    avatar: store.get('avatar'),
    username: store.get('username')
}));

$('#settings').html(templates.settings());

$('.js-sidebar-toggle').on('click', function() {
    var $el = $(this);
    var $sidebar = $('#sidebar');

    if ($el.is('.active')) {
        $el.removeClass('active');
        $sidebar.removeClass('active');
        store.remove('sidebar');
    } else {
        $sidebar.addClass('active');
        $el.addClass('active');
        store.set('sidebar', true);
    }
    return false;
});

var $modeControls = $('.js-mode-controls').find('a');
$modeControls.on('click', function() {
    var $el = $(this);
    if (!$el.is('.active')) {
        var mode = $el.data('mode');
        $modeControls.removeClass('active');
        $('.js-mode').removeClass('active');
        $el.addClass('active');
        $('#' + mode).addClass('active');
    }
    return false;
});

function isAuthenticated() {
    return (auth.authenticated() && store.get('username') && store.get('userid'));
}

if (qs.error === undefined) {
    var prepend = (Object.keys(qs).length) ? '&' : '?';
    window.location.href = window.location.href + prepend + 'error=' + DEFAULT;
}

function load() {
    /* TODO This task hash should be it's own module that can be called by core
     * for core.mark('done')
     *
     * eventually, remove everything '.loader.'
     * the loader will have everything in it, so calling tasks.smthng will take
     * care of it
     *
     * allow all tasks reguardless of auth for now, demo purposes and such
     * if (!current.loader.auth || (current.loader.auth && isAuthenticated())) {'
     *      // eventually task.auth will be an array with the different types of allowable authentication
     *      // this will correspond with details in localstorage
     *      current.loader.next();
     *  } else {
     *      return;
     *      }
     */
     window.current.auth = isAuthenticated();
     window.current.error = tasks[qs.error].title;
     window.current.loader = tasks[qs.error].loader;
     window.current.loader.next();
}

route({
    auth: isAuthenticated(),
    qs: qs,
    callback: load
});
