var querystring = require('querystring'),
    omnivore = require('leaflet-omnivore'),
    BingLayer = require('./bing.js'),
    osmAuth = require('osm-auth'),
    store = require('store'),
    Mousetrap = require('mousetrap');

var url = 'http://54.82.204.158:3000/error/';

var baseLayer = store.get('baseLayer'),
    menuState = store.get('menuState');

var auth = osmAuth({
    oauth_consumer_key: 'KcVfjQsvIdd7dPd1IFsYwrxIUd73cekN1QkqtSMd',
    oauth_secret: 'K7dFg6rfIhMyvS8cPDVkKVi50XWyX0ibajHnbH8S',
    landing: location.href.replace('/index.html', '').replace(location.search, '') + '/land.html'
});

var title = {
    'deadendoneway': 'Impossible one-ways',
    'impossibleangle': 'Kinks',
    'mixedlayer': 'Mixed layers',
    'nonclosedways': 'Broken polygons',
    'unconnected_major1': 'Unconnected major < 1m',
    'unconnected_major2': 'Unconnected major < 2m',
    'unconnected_major5': 'Unconnected major < 5m',
    'unconnected_minor1': 'Unconnected minor < 1m',
    'unconnected_minor2': 'Unconnected minor < 2m',
    'tigermissing': 'Missing/misaligned TIGER'
};

var DEFAULT = 'deadendoneway';

var featureStyle = {
    color: '#FF00B7',
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

map.attributionControl.setPosition('topright');
map.zoomControl.setPosition('topright');

var layers = {
    'Bing Satellite': new BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU'),
    'Mapbox Streets': L.mapbox.tileLayer('aaronlidman.inhj344j'),
    'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g'),
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
        if (err) return console.log(err);
        if (auth.authenticated()) {
            $('#login').addClass('hidden');
            load();
        }
    });
});

$(load);

var loader = {
    deadendoneway: keeprights,
    highwaywater: keeprights,
    impossibleangle: keeprights,
    mixedlayer: keeprights,
    nonclosedways: keeprights,
    unconnected_major1: unconnected,
    unconnected_major2: unconnected,
    unconnected_major5: unconnected,
    unconnected_minor1: unconnected,
    unconnected_minor2: unconnected,
    tigermissing: tigermissing
};

function keeprights(data) {
    data = JSON.parse(data);
    current = data;
    var full = data.object_type == 'way' ? '/full' : '';

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/' + data.object_type + '/' + data.object_id + full,
        dataType: 'xml',
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(map);
            current.bounds = layer.getBounds();
            map.fitBounds(current.bounds);
            omnivore.wkt.parse(data.st_astext).addTo(map);
        }
    });

    renderUI({
        title: title[qs('error')]
    });
}

$('#next').on('click', function() {
    $('#map').addClass('loading');
    load();
});

$('#josm').on('click', loadJOSM);

Mousetrap.bind(['right', 'j'], function() {
    $('#next').click();
});

Mousetrap.bind(['enter', 'e'], function() {
    $('#josm').click();
});

var alt = false;
Mousetrap.bind(['s'], function() {
    alt = !alt;
    if (alt) $('.leaflet-control-layers-base input:eq(1)').click();
    else $('.leaflet-control-layers-base input:eq(2)').click();
});

function load() {
    // if (auth.authenticated()) {
        renderMenu();
        if (qs('error') === '') {
            window.location.href = window.location.href + '?error=' + Object.keys(title)[0];
            // trailing slash from simplehttpserver is screwing things up
        }

        $.ajax({
            crossDomain: true,
            url: url + qs('error')
        }).done(function(data) {
            $('#map').removeClass('loading');
            loader[qs('error') || DEFAULT](data);
        });
    // } else {
    //     $('#login').removeClass('hidden');
    // }
}

function tigermissing(data) {
    data = JSON.parse(data);
    current = data;

    var layer = omnivore.wkt.parse(data.st_astext).addTo(map);
    layer.setStyle(featureStyle);
    current.bounds = layer.getBounds();
    map.fitBounds(current.bounds);

    renderUI({
        title: title[qs('error')],
        name: current.name
    });
}

function unconnected(data) {
    data = JSON.parse(data);
    current = data;
    // we're assuming they all have a node and a way, which might not hold true
    // first the way, then the node
    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/way' + '/' + data.way_id + '/full',
        dataType: "xml",
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(map);
            current.bounds = layer.getBounds();
            map.fitBounds(current.bounds);
            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/node' + '/' + data.node_id,
                dataType: "xml",
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(map);
                }
            });
        }
    });
    renderUI({
        title: title[qs('error')]
    });
}

function loadJOSM() {
    var bottom = current.bounds._southWest.lat - 0.0005;
    var left = current.bounds._southWest.lng - 0.0005;
    var top = current.bounds._northEast.lat + 0.0005;
    var right = current.bounds._northEast.lng + 0.0005;
    $.ajax('http://localhost:8111/load_and_zoom?' + querystring.stringify({
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        select: current.object_type + current.object_id
    }), {
        error: function() {
            alert('JOSM is not running - start JOSM and enable Remote Control');
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
    for (var item in title) {
        $menu.append(
            $('<a></a>')
                .attr('href', '?' + querystring.encode({ error: item }))
                .attr('class', item == err ? 'active' : '')
                .text(title[item]));
    }
}

function qs(name) {
    return querystring.parse(window.location.search.slice(1))[name];
}
