var fs = require('fs');

var _ = require('underscore'),
    map = require('../lib/map.js'),
    omnivore = require('leaflet-omnivore');

var templates = {
    editbar: _(fs.readFileSync('./templates/editbar.html', 'utf8')).template()
};

var keepright = {};

keepright.initialize = function(current, callback) {
    map();
};

keepright.next = function() {
    current._osm_object_type = current.object_type;
    current._osm_object_id = current.object_id;
    var full = current._osm_object_type == 'way' ? '/full' : '';

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/' + current._osm_object_type + '/' + current._osm_object_id + full,
        dataType: 'xml',
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
            current._bounds = layer.getBounds();
            map.fitBounds(current._bounds);
            omnivore.wkt.parse(current.st_astext).addTo(featureGroup);
            $('#main').append(templates.editbar());
            if (callback) callback(null, current);
        },
        error: function(err) {
            if (callback) callback(err, current);
        }
    });
};

keepright.bind = function() {
    $('#edit').on('click', function() {
        console.log('edit');
    });

    $('#submit').on('click', function() {
        console.log('submit');
    });
};

// when switching #main views
// $('#main').find('*').unbind();

module.exports = keepright;
