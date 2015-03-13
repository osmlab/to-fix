'use strict';

var $ = require('jquery');
var querystring = require('querystring');
var qs = querystring.parse(window.location.search.slice(1));

var core = require('../core');
var map = require('../map');
var activity = require('../activity');
var stats = require('../stats');

var layer;

module.exports = {
    auth: ['osm'],
    next: function() {
        var self = this;
        map.init();
        activity.init();
        stats.init();

        core.item(qs.error, function() {
            window.current.item._osm_object_type = 'node';
            window.current.item._osm_object_id = window.current.item.node_id;

            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/way/' + window.current.item.way_id + '/full',
                dataType: 'xml',
                success: function(xml) {
                    layer = new L.OSM.DataLayer(xml).setStyle(window.featureStyle).addTo(window.featureGroup);
                    window.current.item._bounds = layer.getBounds();
                    window.map.fitBounds(window.current.item._bounds);
                    $(window.map.getContainer()).removeClass('loading');

                    $.ajax({
                        url: 'https://www.openstreetmap.org/api/0.6/node/' + window.current.item._osm_object_id,
                        dataType: 'xml',
                        success: function(xml) {
                            layer = new L.OSM.DataLayer(xml).setStyle(window.featureStyle).addTo(window.featureGroup);
                        },
                        error: function(err) {
                            if (err) window.console.warn(err);
                            return self.next();
                        }
                    });
                },
                error: function(err) {
                    if (err) window.console.warn(err);
                    return self.next();
                }
            });
        });
    }
};
