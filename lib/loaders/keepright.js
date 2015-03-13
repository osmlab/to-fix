'use strict';

var $ = require('jquery');
var querystring = require('querystring');
var qs = querystring.parse(window.location.search.slice(1));
var omnivore = require('leaflet-omnivore');

var core = require('../core');
var map = require('../map');
var activity = require('../activity');
var stats = require('../stats');

module.exports = {
    auth: ['osm'],

    next: function() {
        var self = this;
        map.init();
        activity.init();
        stats.init();

        core.item(qs.error, function() {
            window.current.item._osm_object_type = window.current.item.object_type;
            window.current.item._osm_object_id = window.current.item.object_id;
            var full = window.current.item._osm_object_type == 'way' ? '/full' : '';

            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/' + window.current.item._osm_object_type + '/' + window.current.item._osm_object_id + full,
                dataType: 'xml',
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml)
                        .setStyle(window.featureStyle)
                        .addTo(window.featureGroup);
                    window.current.item._bounds = layer.getBounds();
                    window.map.fitBounds(window.current.item._bounds);
                    omnivore.wkt.parse(window.current.item.st_astext).addTo(window.featureGroup);
                },
                error: function(err) {
                    if (err) window.console.warn(err);
                    return self.next();
                }
            });
        });
    }
};
