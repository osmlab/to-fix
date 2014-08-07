var querystring = require('querystring'),
    omnivore = require('leaflet-omnivore'),
    Mousetrap = require('mousetrap');

var url = 'http://54.82.204.158:3000/error/';

var auth = osmAuth({
    oauth_consumer_key: 'KcVfjQsvIdd7dPd1IFsYwrxIUd73cekN1QkqtSMd',
    oauth_secret: 'K7dFg6rfIhMyvS8cPDVkKVi50XWyX0ibajHnbH8S',
    landing: location.href.replace('/index.html', '').replace(location.search, '') + '/land.html'
});

var title = {
    'deadendoneway': 'One-way without exit',
    // 'highwaywater': 'Highways crossing water',
    'impossibleangle': 'Sharp angles',
    'mixedlayer': 'Mixed layer tagging',
    'nonclosedways': 'Nonclosed ways',
    'unconnected_major1': 'Unconnected major < 1m',
    'unconnected_major2': 'Unconnected major < 2m',
    'unconnected_major5': 'Unconnected major < 5m',
    'unconnected_minor1': 'Unconnected minor < 1m',
    'unconnected_minor2': 'Unconnected minor < 2m',
    'tigermissing': 'Missing TIGER'
};

var current = {};

var map = L.mapbox.map('map', null, {
    fadeAnimation: false,
    zoomAnimation: false,
    maxZoom: 18,
    keyboard: false
}).setView([22.76, -25.84], 3);

var layers = {
    'Bing Satellite': new L.BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU'),
    'Mapbox Streets': L.mapbox.tileLayer('aaronlidman.inhj344j'),
    'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g'),
    'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png')
};

// set the initial baselayer
var baseLayer = localStorage.getItem('baseLayer');
var menuState = localStorage.getItem('menuState');

if (baseLayer && layers[baseLayer]) {
    layers[baseLayer].addTo(map);
} else {
    layers['Mapbox Streets'].addTo(map);
}

L.control.layers(layers).addTo(map);

map.on('baselayerchange', function(e) {
    localStorage.setItem('baseLayer', e.name);
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

var loader = {};
loader.deadendoneway = keeprights;
loader.highwaywater = keeprights;
loader.impossibleangle = keeprights;
loader.mixedlayer = keeprights;
loader.nonclosedways = keeprights;

loader.unconnected_major1 = unconnected;
loader.unconnected_major2 = unconnected;
loader.unconnected_major5 = unconnected;
loader.unconnected_minor1 = unconnected;
loader.unconnected_minor2 = unconnected;

loader.tigermissing = tigermissing;

function keeprights(data) {
    data = JSON.parse(data);
    current = data;
    console.log(current);
    var full = data.object_type == 'way' ? '/full' : '';

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/' + data.object_type + '/' + data.object_id + full,
        dataType: 'xml',
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).addTo(map);
            current.bounds = layer.getBounds();
            map.fitBounds(current.bounds);
            omnivore.wkt.parse(data.st_astext).addTo(map);
        }
    });

    renderUI({
        title: title[qs('error')]
    });
}

$('h1').on('click', function() {
    if ($('#menu').hasClass('hidden')) {
        $('#menu').removeClass('hidden');
        localStorage.setItem('menuState', true);
        // no longer hidden
    } else {
        $('#menu').addClass('hidden');
        localStorage.setItem('menuState', 'hidden');
        // hidden
    }
});

$('#next').on('click', function() {
    $('#map').addClass('loading');
    load();
});

$('#josm').on('click', loadJOSM);

Mousetrap.bind(['right', 'j'], function() {
    $('#next').click();
});

Mousetrap.bind(['enter'], function() {
    $('#josm').click();
});

var alt = false;
Mousetrap.bind(['s'], function() {
    if (alt = !alt) $('.leaflet-control-layers-base input:eq(1)').click();
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
            loader[qs('error')](data);
        });
    // } else {
    //     $('#login').removeClass('hidden');
    // }
}

function tigermissing(data) {
    data = JSON.parse(data);
    current = data;

    var layer = omnivore.wkt.parse(data.st_astext).addTo(map);
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
    console.log(current);
    // first the way, then the node
    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/way' + '/' + data.way_id + '/full',
        dataType: "xml",
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).addTo(map);
            current.bounds = layer.getBounds();
            map.fitBounds(current.bounds);
            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/node' + '/' + data.node_id,
                dataType: "xml",
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml).addTo(map);
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
        console.log($('#name').addClass('hidden'));
    }
}

function renderMenu() {
    var html = '';
    for (var item in title) {
        if (item != qs('error')) html += '<a href="' + window.location.href.split(qs('error')).join(item) + '">' + title[item] + '</a>';
    }
    $('#menu').html(html);
    if (localStorage.getItem('menuState') !== 'hidden') $('#menu').removeClass('hidden');
}

function qs(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
