var fs = require('fs');

var querystring = require('querystring'),
    omnivore = require('leaflet-omnivore'),
    BingLayer = require('./bing.js'),
    osmAuth = require('osm-auth'),
    store = require('store'),
    Mousetrap = require('mousetrap'),
    _ = require('underscore');

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

var baseLayer = store.get('baseLayer');
var menuState = store.get('menuState');

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
    'inconsistent': {
        loader: inconsistent },
    'duplicate_ways': {
        title: 'Duplicate Ways',
        loader: osmi_geom },
    'unconnected_major_tokyo': {
        title: 'Unconnected Tokyo',
        focus: true,
        loader: unconnected_tokyo },
    'unconnected_minor_tokyo': {
        title: 'Unconnected minor Tokyo',
        focus: true,
        loader: unconnected_tokyo },
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

window.map = L.mapbox.map('map', null, {
    maxZoom: 18,
    keyboard: false
}).setView([22.76, -25.84], 3);

map.attributionControl.setPosition('bottomright');
map.zoomControl.setPosition('topleft');

window.featureGroup = L.featureGroup().addTo(map);

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

var layers = {
    'Bing Satellite': new BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU'),
    'Streets': L.mapbox.tileLayer('aaronlidman.inhj344j', {
        accessToken: 'pk.eyJ1IjoiYWFyb25saWRtYW4iLCJhIjoiNTVucTd0TSJ9.wVh5WkYXWJSBgwnScLupiQ'
    }),
    'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g', {
        accessToken: 'pk.eyJ1IjoiYWFyb25saWRtYW4iLCJhIjoiNTVucTd0TSJ9.wVh5WkYXWJSBgwnScLupiQ',
        detectRetina: false
    }),
    'Outdoors': L.mapbox.tileLayer('aaronlidman.jgo996i0', {
        accessToken: 'pk.eyJ1IjoiYWFyb25saWRtYW4iLCJhIjoiNTVucTd0TSJ9.wVh5WkYXWJSBgwnScLupiQ'
    }),
    'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="http://osm.org">© OpenStreetMap contributors</a>'
    })
};

if (baseLayer && layers[baseLayer]) {
    layers[baseLayer].addTo(map);
} else {
    layers['Mapbox Satellite'].addTo(map);
}

L.control.layers(layers).addTo(map);

map.on('baselayerchange', function(e) {
    store.set('baseLayer', e.name);
});

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
    $('#fixed').addClass('disabled').unbind();
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

function markDone() {
    Mousetrap.unbind(['enter', 'e']);

    $.ajax({
        crossDomain: true,
        url: url + 'fixed/' + qs('error'),
        type: 'post',
        data: JSON.stringify({
            user: store.get('username'),
            state: current
        })
    })
    .error(showErrorMessage)
    .done(next);
}

$('#skip').on('click', next);
$('#edit').on('click', edit);

Mousetrap.bind(['right', 'j'], function() {
    $('#skip')
        .addClass('active')
        .click();
    setTimeout(function() {
        $('#skip').removeClass('active');
    }, 200);
});

function enableDone() {
    // super temporary
    // setTimeout(function() {
        $('#fixed').removeClass('disabled');
        Mousetrap.bind(['enter', 'e'], function() {
            $('#edit').click();
        });
        $('#fixed').on('click', markDone);
    // }, 500);
}

var alt = false;
Mousetrap.bind(['s'], function() {
    alt = !alt;
    if (alt) $('.leaflet-control-layers-base input:eq(1)').click();
    else $('.leaflet-control-layers-base input:eq(2)').click();
});

function controls(show) {
    if (show) {
        $('#hidden-controls').removeClass('hidden');
        $('.leaflet-control-container').removeClass('hidden');
    } else {
        $('.leaflet-control-container').addClass('hidden');
        $('#hidden-controls')
            .addClass('hidden')
            .removeClass('clickthrough');
    }
}

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

    $('#intro-modal').addClass('hidden');
    controls(true);

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
        tasks[qs('error') || DEFAULT].loader.initialize(current);

        // super temporary
        enableDone();
    });
}

function inconsistent() {
    current._osm_object_type = 'way';
    current._osm_object_id = current.incomplete_way_id;

    // possible wrong name (altStyle)
    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/way/' + current.incomplete_way_id + '/full',
        dataType: 'xml',
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
            current._bounds = layer.getBounds();
            map.fitBounds(current._bounds);

            // context ways
            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/way/' + current.src_before_way_id + '/full',
                dataType: 'xml',
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml).setStyle(altStyle).addTo(featureGroup);
                }
            });

            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/way/' + current.src_after_way_id + '/full',
                dataType: 'xml',
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml).setStyle(altStyle).addTo(featureGroup);
                }
            });

        }
    });

    renderUI({
        name: current.name || current.ref
    });
}

function npsdiff() {
    var layer = omnivore.wkt.parse(current.st_astext).addTo(featureGroup);
    layer.setStyle(featureStyle);
    current._bounds = layer.getBounds();
    map.fitBounds(current._bounds);
}

function unconnected_tokyo() {
    current._osm_object_type = 'node';
    current._osm_object_id = current.node_id;

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/way/' + current.way_id + '/full',
        dataType: 'xml',
        success: function (xml) {

            var users = ['Rub21', 'ediyes', 'Luis36995', 'RichRico', 'dannykath'];
            // this is obviously very near sighted, but whatever, move fast, etc...
            // check if the way was touched by one of the users
            var user = xml.getElementsByTagName('way')[0].getAttribute('user');
            if (users.indexOf(user) > -1) {
                console.log('way previously touched by', user);
                // consider it done
                return markDone();
            }

            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
            current._bounds = layer.getBounds();
            map.fitBounds(current._bounds);
            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/node/' + current._osm_object_id,
                dataType: 'xml',
                success: function (xml) {

                    var user = xml.getElementsByTagName('node')[0].getAttribute('user');
                    if (users.indexOf(user) > -1) {
                        console.log('node previously touched by', user);
                        // consider it done
                        return markDone();
                    }

                    var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
                },
                error: function(err) {
                    if (err.status == 410) return markDone();
                    return next();
                }
            });
        },
        error: function(err) {
            if (err.status == 410) return markDone();
            return next();
        }
    });

    renderUI();
}

function edit() {
    var bottom = current._bounds._southWest.lat - 0.001;
    var left = current._bounds._southWest.lng - 0.001;
    var top = current._bounds._northEast.lat + 0.001;
    var right = current._bounds._northEast.lng + 0.001;

    var newWindow = window.open('');

    $.ajax('http://localhost:8111/load_and_zoom?' + querystring.stringify({
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        select: current._osm_object_type + current._osm_object_id
    }), {
        error: function() {
            // fallback to iD
            var url = 'http://openstreetmap.us/iD/release/#';
            if (current._osm_object_type && current._osm_object_id) {
                url += 'id=' + current._osm_object_type.slice(0, 1) + current._osm_object_id;
            } else {
                url += 'map=' + map.getZoom() + '/' + map.getCenter().lng + '/' + map.getCenter().lat;
            }
            newWindow.location = url;
            enableDone();
        },
        success: function() {
            newWindow.close();
            enableDone();
        }
    });
}

function renderUI(data) {
    if (!data) data = {};

    $('#hidden-controls').removeClass('hidden');

    if (data.name && data.name.length) {
        $('#name')
            .text(data.name)
            .removeClass('hidden');
    } else {
        $('#name').addClass('hidden');
    }
}

function qs(name) {
    return querystring.parse(window.location.search.slice(1))[name];
}
