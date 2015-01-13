var fs = require('fs');

var _ = require('underscore'),
    store = require('store'),
    BingLayer = require('../js/bing.js');

var templates = {
    map: _(fs.readFileSync('./templates/map.html', 'utf8')).template()
};

L.mapbox.accessToken = 'pk.eyJ1IjoiYWFyb25saWRtYW4iLCJhIjoiNTVucTd0TSJ9.wVh5WkYXWJSBgwnScLupiQ';

// transparent street layer for putting on top of other layers
var contextLayer = L.mapbox.tileLayer('aaronlidman.87d3cc29', {
    detectRetina: false
});

var layers = {
    'Bing Satellite': new BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU'),
    'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g', { detectRetina: false }),
    'Streets': L.mapbox.tileLayer('aaronlidman.jgo996i0'),
    'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="http://osm.org">© OpenStreetMap contributors</a>'
    })
};

var baseLayer = store.get('baseLayer') || 'Streets';

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

var mapz = {};

mapz.init = function(div) {
    if ($('#map').length) return false; // map already initialized

    div = div || 'map';
    $('#main').append(templates.map());

    window.map = L.mapbox.map('map', null, {
        maxZoom: 18,
        keyboard: false
    }).setView([22.76, -25.84], 3);

    layers[baseLayer].addTo(map);
    if (baseLayer == 'Bing Satellite') contextLayer.addTo(map).bringToFront();
    L.control.layers(layers).addTo(map);

    map.on('baselayerchange', function(e) {
        store.set('baseLayer', e.name);

        if (e.name == 'Bing Satellite') {
            contextLayer.addTo(map).bringToFront();
        } else {
            if (map.hasLayer(contextLayer)) map.removeLayer(contextLayer);
        }
    });

    window.featureGroup = L.featureGroup().addTo(map);

    map.attributionControl.setPosition('bottomright');
    map.zoomControl.setPosition('topleft');
};

mapz.clear = function() {
    window.featureGroup.getLayers().forEach(function(layer) {
        window.featureGroup.removeLayer(layer);
    });
};

module.exports = mapz;
