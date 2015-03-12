'use strict';

var $ = require('jquery');
var querystring = require('querystring');
var qs = querystring.parse(window.location.search.slice(1));
var omnivore = require('leaflet-omnivore');

var core = require('../core');
var map = require('../map');
var editbar = require('../editbar');

var keepright = {
    auth: ['osm']
};

keepright.next = function() {
    map.init();
    editbar.init();

    core.item(qs.error, function() {
        current.item._osm_object_type = current.item.object_type;
        current.item._osm_object_id = current.item.object_id;
        var full = current.item._osm_object_type == 'way' ? '/full' : '';

        $.ajax({
            url: 'https://www.openstreetmap.org/api/0.6/' + current.item._osm_object_type + '/' + current.item._osm_object_id + full,
            dataType: 'xml',
            success: function (xml) {
                var layer = new L.OSM.DataLayer(xml)
                    .setStyle(featureStyle)
                    .addTo(featureGroup);
                current.item._bounds = layer.getBounds();
                window.map.fitBounds(current.item._bounds);
                omnivore.wkt.parse(current.item.st_astext).addTo(featureGroup);
            },
            error: function(err) {
                if (err) console.warn(err);
                return keepright.next();
            }
        });
    });
};

module.exports = keepright;
