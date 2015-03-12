'use strict';

var querystring = require('querystring');
var qs = querystring.parse(window.location.search.slice(1));

var core = require('../core');
var map = require('../map');
var editbar = require('../editbar');

var unconnected = { auth: ['osm'] };
var layer;

unconnected.next = function() {
    map.init();
    editbar.init();

    core.item(qs.error, function() {
        current.item._osm_object_type = 'node';
        current.item._osm_object_id = current.item.node_id;

        $.ajax({
            url: 'https://www.openstreetmap.org/api/0.6/way/' + current.item.way_id + '/full',
            dataType: 'xml',
            success: function(xml) {
                layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
                current.item._bounds = layer.getBounds();
                window.map.fitBounds(current.item._bounds);

                $.ajax({
                    url: 'https://www.openstreetmap.org/api/0.6/node/' + current.item._osm_object_id,
                    dataType: 'xml',
                    success: function(xml) {
                        layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
                    },
                    error: function(err) {
                        if (err) console.warn(err);
                        return unconnected.next();
                    }
                });
            },
            error: function(err) {
                if (err) console.warn(err);
                return unconnected.next();
            }
        });
    });
};

module.exports = unconnected;
