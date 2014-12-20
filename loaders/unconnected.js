var fs = require('fs');

var _ = require('underscore'),
    omnivore = require('leaflet-omnivore');

var templates = {
    editbar: _(fs.readFileSync('./templates/editbar.html', 'utf8')).template()
};

var unconnected = {};

unconnected.initialize = function unconnected(current, callback) {
    current._osm_object_type = 'node';
    current._osm_object_id = current.node_id;

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/way/' + current.way_id + '/full',
        dataType: 'xml',
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
            current._bounds = layer.getBounds();
            map.fitBounds(current._bounds);

            $.ajax({
                url: 'https://www.openstreetmap.org/api/0.6/node/' + current._osm_object_id,
                dataType: 'xml',
                success: function (xml) {
                    var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
                    $('#main').append(templates.editbar());
                    if (callback) return callback(null, current);
                },
                error: function(err) {
                    if (callback) return callback(err, current);
                }
            });

        },
        error: function(err) {
            if (callback) return callback(err, current);
        }
    });

};

module.exports = unconnected;
