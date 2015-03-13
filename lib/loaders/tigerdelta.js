'use strict';

var $ = require('jquery');
var querystring = require('querystring');
var omnivore = require('leaflet-omnivore');

var qs = querystring.parse(window.location.search.slice(1));
var core = require('../core');
var map = require('../map');
var activity = require('../activity');
var stats = require('../stats');

module.exports = {
    auth: ['osm'],
    next: function () {
        map.init();
        activity.init();
        stats.init();

        $(window.map.getContainer()).addClass('loading');
        core.item(qs.error, function() {
            var layer = omnivore.wkt.parse(window.current.item.st_astext).addTo(window.featureGroup);
            layer.setStyle(window.featureStyle);
            window.current.item._bounds = layer.getBounds();
            window.map.fitBounds(window.current.item._bounds);
            $(window.map.getContainer()).removeClass('loading');
        });
    }
};
