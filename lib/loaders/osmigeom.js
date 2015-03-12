'use strict';

var querystring = require('querystring');
var omnivore = require('leaflet-omnivore');

var core = require('../core');
var map = require('../map');
var editbar = require('../editbar');

var qs = querystring.parse(window.location.search.slice(1));
var osmigeom = {
    auth: ['osm']
};

module.exports = {
    next: function() {
        map.init();
        editbar.init();

        core.item(qs.error, function() {
            var layer = omnivore.wkt.parse(window.current.item.st_astext).addTo(window.featureGroup);
            layer.setStyle(window.featureStyle);
            window.current.item._bounds = layer.getBounds();
            window.map.fitBounds(window.current.item._bounds);
        });
    }
};
