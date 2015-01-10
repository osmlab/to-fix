var fs = require('fs');

var querystring = require('querystring'),
    qs = querystring.parse(window.location.search.slice(1)),
    _ = require('underscore'),
    omnivore = require('leaflet-omnivore'),
    mouse = require('mousetrap');

var core = require('../lib/core'),
    map = require('../lib/map'),
    editbar = require('../lib/editbar');

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
