var querystring = require('querystring'),
    omnivore = require('leaflet-omnivore'),
    BingLayer = require('./bing.js'),
    osmAuth = require('osm-auth'),
    store = require('store'),
    Mousetrap = require('mousetrap');

var url = 'http://54.80.108.9:3001/';
// var url = 'http://localhost:3001/';

var baseLayer = store.get('baseLayer'),
    menuState = store.get('menuState');

var PLAY = 0;
var randomPlay = [{
    way: {"type":"FeatureCollection","features":[{"geometry":{"type":"LineString","coordinates":[[-0.5605656,51.3243174],[-0.5606235,51.3242914],[-0.5607212,51.3242498],[-0.5608437,51.3241887],[-0.5609295,51.32414],[-0.5609951,51.3241058],[-0.5610768,51.3240632],[-0.5611601,51.3240219],[-0.5612531,51.3239709],[-0.5612718,51.32396],[-0.5614974,51.3238289],[-0.5615251,51.3238028],[-0.5615719,51.3237587]]},"type":"Feature","properties":{"highway":"residential","name":"Broomhall Lane"}}]},
    node: {"type":"FeatureCollection","features":[{"geometry":{"type":"Point","coordinates":[-0.5615719,51.3237587]},"type":"Feature","properties":{}}]}
}, {
    way: {"type":"FeatureCollection","features":[{"geometry":{"type":"LineString","coordinates":[[6.1773575,49.1255727],[6.1768639,49.1258967],[6.1766857,49.1260137],[6.1766721,49.1260365],[6.1766765,49.1260613],[6.1767016,49.1260829],[6.1767281,49.1260965],[6.1769134,49.1262067],[6.1769337,49.1262188]]},"type":"Feature","properties":{"highway":"pedestrian","name":"Square Paille-Maille","source":"cadastre-dgi-fr source : Direction Générale des Impôts - Cadastre. Mise à jour : 2009"}}]},
    node: {"type":"FeatureCollection","features":[{"geometry":{"type":"Point","coordinates":[6.1769337,49.1262188]},"type":"Feature","properties":{}}]}
}, {
    way: {"type":"FeatureCollection","features":[{"geometry":{"type":"LineString","coordinates":[[-0.5608437,51.3241887],[-0.5608931,51.3242352],[-0.5609987,51.324321],[-0.5612412,51.3245343]]},"type":"Feature","properties":{"highway":"residential","name":"Broomhall End"}}]},
    node: {"type":"FeatureCollection","features":[{"geometry":{"type":"Point","coordinates":[-0.5612412,51.3245343]},"type":"Feature","properties":{}}]}
}, {
    way: {"type":"FeatureCollection","features":[{"geometry":{"type":"LineString","coordinates":[[-2.1959028,51.2504598],[-2.1960627,51.2507108],[-2.1961876,51.2508979],[-2.1962628,51.2510072],[-2.1963248,51.2510954],[-2.1963602,51.2511509],[-2.1963853,51.2511974],[-2.196402,51.2512444],[-2.1964071,51.2512694],[-2.1964121,51.2512936],[-2.1964838,51.2515612]]},"type":"Feature","properties":{"highway":"residential","name":"School Lane","source":"Bing"}}]},
    node: {"type":"FeatureCollection","features":[{"geometry":{"type":"Point","coordinates":[-2.1964838,51.2515612]},"type":"Feature","properties":{}}]}
}];

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
var loopGroup = L.layerGroup().addTo(map);

map.attributionControl.setPosition('topright');
map.zoomControl.setPosition('topright');

var layers = {
    'Bing Satellite': new BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU'),
    'Mapbox Streets': L.mapbox.tileLayer('aaronlidman.inhj344j'),
    'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g', {detectRetina: false}),
    'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png')
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

var tour = $('.tourbus-legs').tourbus({
    onDepart: function() {
        renderMenu();
        $('#intro-modal').addClass('hidden');
        controls(true);
    },
    onStop: function() {
        controls(false);
        $('#intro-modal').removeClass('hidden');
    }
});

$('#start-walkthrough').on('click', function() {
    tour.trigger('depart.tourbus');
});

$('#go').on('click', function() {
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
    setTimeout(function() {
        $('#fixed').removeClass('disabled');
        Mousetrap.bind(['enter', 'e'], function() {
            $('#edit').click();
        });
        $('#fixed').on('click', markDone);
    }, 5000);
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

function load() {
    if (auth.authenticated() && store.get('username') && store.get('userid')) {
        $('#intro-modal').addClass('hidden');
        controls(true);
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
        pushLoop();
        var player = setInterval(pushLoop, 5000);
        $('#start-walkthrough')
            .removeClass('hidden')
            .on('click', function() {
            $('#hidden-controls').addClass('clickthrough');
                clearInterval(player);
            });
    }
}

function pushLoop() {
    // remove anything that might already be on the loopGroup
    loopGroup.getLayers().forEach(function(layer) {
        loopGroup.removeLayer(layer);
    });

    var way = L.geoJson(randomPlay[PLAY].way).addTo(loopGroup);
    var node = L.geoJson(randomPlay[PLAY].node).addTo(loopGroup);

    map.fitBounds(way.getBounds());
    node.setStyle(altStyle);
    way.setStyle(featureStyle);

    PLAY = (PLAY < randomPlay.length - 1) ? (PLAY + 1) : 0;
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
    $('#hidden-controls').removeClass('hidden');
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
