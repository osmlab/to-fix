var querystring = require('querystring'),
    omnivore = require('leaflet-omnivore'),
    BingLayer = require('./bing.js'),
    osmAuth = require('osm-auth'),
    store = require('store'),
    Mousetrap = require('mousetrap');

var url = 'http://54.83.186.206:3001/';
// var url = 'http://localhost:3001/';

var baseLayer = store.get('baseLayer'),
    menuState = store.get('menuState');

var auth = osmAuth({
    oauth_consumer_key: 'KcVfjQsvIdd7dPd1IFsYwrxIUd73cekN1QkqtSMd',
    oauth_secret: 'K7dFg6rfIhMyvS8cPDVkKVi50XWyX0ibajHnbH8S',
    landing: 'land.html'
});

var tasks = {
    'deadendoneway': {
        title: 'Impossible one-ways',
        loader: keeprights },
    'impossibleangle': {
        title: 'Kinks',
        loader: keeprights },
    'mixedlayer': {
        title: 'Mixed layers',
        loader: keeprights },
    'nonclosedways': {
        title: 'Broken polygons',
        loader: keeprights },
    'unconnected_major1': {
        title: 'Unconnected major < 1m',
        loader: unconnected },
    // 'unconnected_major2': {
    //     title: 'Unconnected major < 2m',
    //     loader: unconnected },
    'unconnected_major5': {
        title: 'Unconnected major < 5m',
        loader: unconnected },
    'unconnected_minor1': {
        title: 'Unconnected minor < 1m',
        loader: unconnected },
    // 'unconnected_minor2': {
    //     title: 'Unconnected minor < 2m',
    //     loader: unconnected },
    'tigermissing': {
        title: 'Missing/misaligned TIGER',
        loader: tigermissing },
    'northeast_highway_intersects_building': {
        title: 'Highway/building overlap',
        loader: nyc_overlaps }
};

var DEFAULT = 'deadendoneway';

var featureStyle = {
    color: '#FF00B7',
    opacity: 1,
    weight: 4
};

var altStyle = {
    color: '#00BFFF',
    opacity: 1,
    weight: 4
};

var current = {};

var map = L.mapbox.map('map', null, {
    fadeAnimation: false,
    zoomAnimation: false,
    maxZoom: 18,
    keyboard: false
}).setView([22.76, -25.84], 3);

var layerGroup = L.layerGroup().addTo(map);

map.attributionControl.setPosition('topright');
map.zoomControl.setPosition('topright');

var layers = {
    'Bing Satellite': new BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU'),
    'Mapbox Streets': L.mapbox.tileLayer('aaronlidman.inhj344j'),
    'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g', {
        detectRetina: false
    }),
    'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png')
};

if (baseLayer && layers[baseLayer]) {
    layers[baseLayer].addTo(map);
} else {
    layers['Mapbox Streets'].addTo(map);
}

L.control.layers(layers).addTo(map);

map.on('baselayerchange', function(e) {
    store.set('baseLayer', e.name);
});

$('#login').on('click', function() {
    auth.authenticate(function(err) {
        auth.xhr({
            method: 'GET',
            path: '/api/0.6/user/details'
        }, function(err, details) {
            if (err) return console.log(err);
            if (auth.authenticated()) {
                $('#login').addClass('hidden');
                details = details.getElementsByTagName('user')[0];
                store.set('username', details.getAttribute('display_name'));
                store.set('userid', details.getAttribute('id'));
                load();
            }
        });
    });
});

$(load);

function keeprights() {
    current._osm_object_type = current.object_type;
    current._osm_object_id = current.object_id;
    var full = current._osm_object_type == 'way' ? '/full' : '';

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/' + current._osm_object_type + '/' + current._osm_object_id + full,
        dataType: 'xml',
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(layerGroup);
            current.bounds = layer.getBounds();
            map.fitBounds(current.bounds);
            omnivore.wkt.parse(current.st_astext).addTo(layerGroup);
        }
    });

    renderUI({
        title: tasks[qs('error')].title
    });
}

// used for skipping or after marking something as fixed
function next() {
    $('#fixed').addClass('disabled').unbind();
    $('#map').addClass('loading');
    layerGroup.getLayers().forEach(function(layer) {
        layerGroup.removeLayer(layer);
    });
    load();
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
    }).done(next);
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
    $('#fixed').removeClass('disabled');

    Mousetrap.bind(['enter', 'e'], function() {
        $('#edit').click();
    });

    $('#fixed').on('click', markDone);
}

var alt = false;
Mousetrap.bind(['s'], function() {
    alt = !alt;
    if (alt) $('.leaflet-control-layers-base input:eq(1)').click();
    else $('.leaflet-control-layers-base input:eq(2)').click();
});

function load() {
    if (auth.authenticated() && store.get('username') && store.get('userid')) {
        renderMenu();
        if (qs('error') === undefined) {
            window.location.href = window.location.href + '?error=' + DEFAULT;
        }
        $.ajax({
            crossDomain: true,
            url: url + 'error/' + qs('error'),
            type: 'post',
            data: JSON.stringify({user: store.get('username')})
        }).done(function(data) {
            data = JSON.parse(data);
            current = data.value;
            current._id = data.key;
            $('#map').removeClass('loading');
            tasks[qs('error') || DEFAULT].loader();
        });
    } else {
        $('#login').removeClass('hidden');
    }
}

function nyc_overlaps() {
    current._osm_object_type = 'way';
    current._osm_object_id = current.bldg;

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/way/' + current.hwy + '/full',
        dataType: "xml",
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(altStyle).addTo(layerGroup);
            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/way/' + current.bldg + '/full',
                dataType: "xml",
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(layerGroup);
                    current.bounds = layer.getBounds();
                    map.fitBounds(current.bounds);
                }
            });
        }
    });

    renderUI({
        title: tasks[qs('error')].title
    });
}

function tigermissing() {
    var layer = omnivore.wkt.parse(current.st_astext).addTo(layerGroup);
    layer.setStyle(featureStyle);
    current.bounds = layer.getBounds();
    map.fitBounds(current.bounds);

    renderUI({
        title: tasks[qs('error')].title,
        name: current.name
    });
}

function unconnected() {
    current._osm_object_type = 'node';
    current._osm_object_id = current.node_id;

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/way/' + current.way_id + '/full',
        dataType: "xml",
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(layerGroup);
            current.bounds = layer.getBounds();
            map.fitBounds(current.bounds);
            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/node/' + current._osm_object_id,
                dataType: "xml",
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(layerGroup);
                }
            });
        }
    });
    renderUI({
        title: tasks[qs('error')].title
    });
}

function edit() {
    var bottom = current.bounds._southWest.lat - 0.0005;
    var left = current.bounds._southWest.lng - 0.0005;
    var top = current.bounds._northEast.lat + 0.0005;
    var right = current.bounds._northEast.lng + 0.0005;

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
    $('.controls').removeClass('hidden');
    if (data.title) $('#title').html(data.title);

    if (data.name && data.name.length) {
        $('#name')
            .text(data.name)
            .removeClass('hidden');
    } else {
        $('#name').addClass('hidden');
    }
}

function renderMenu() {
    var $menu = $('#menu').html('');
    var err = qs('error');
    for (var item in tasks) {
        $menu.append(
            $('<a></a>')
                .attr('href', '?' + querystring.encode({ error: item }))
                .attr('class', item == err ? 'active' : '')
                .text(tasks[item].title));
    }
}

function qs(name) {
    return querystring.parse(window.location.search.slice(1))[name];
}
