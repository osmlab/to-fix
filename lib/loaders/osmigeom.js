'use strict';

var querystring = require('querystring');
var omnivore = require('leaflet-omnivore');

var core = require('../core');
var map = require('../map');
var editbar = require('../editbar');

var qs = querystring.parse(window.location.search.slice(1));
var osmi_geom = {
    auth: ['osm']
};

osmi_geom.next = function() {
    map.init();
    editbar.init();

    core.item(qs.error, function() {
        var layer = omnivore.wkt.parse(current.item.st_astext).addTo(featureGroup);
        layer.setStyle(featureStyle);
        current.item._bounds = layer.getBounds();
        window.map.fitBounds(current.item._bounds);
    });
};

module.exports = osmi_geom;
