var fs = require('fs');

var core = require('../lib/core'),
    qs = require('querystring').parse(window.location.search.slice(1)),
    _ = require('underscore'),
    map = require('../lib/map'),
    omnivore = require('leaflet-omnivore'),
    querystring = require('querystring');

var templates = {
    editbar: _(fs.readFileSync('./templates/editbar.html', 'utf8')).template()
};

var keepright = {};

keepright.auth = ['osm'];

keepright.next = function() {
    map.init();

    core.item(qs.error, function(data) {
        current._osm_object_type = current.object_type;
        current._osm_object_id = current.object_id;
        var full = current._osm_object_type == 'way' ? '/full' : '';

        $.ajax({
            url: 'https://www.openstreetmap.org/api/0.6/' + current._osm_object_type + '/' + current._osm_object_id + full,
            dataType: 'xml',
            success: function (xml) {
                var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
                current._bounds = layer.getBounds();
                window.map.fitBounds(current._bounds);
                omnivore.wkt.parse(current.st_astext).addTo(featureGroup);

                if (!$('#editbar').length) {
                    $('#main').append(templates.editbar());
                    keepright.bind();
                }
            },
            error: function(err) {
                return keepright.next();
            }
        });
    });
};

keepright.bind = function() {
    $('#edit').on('click', edit);

    $('#skip').on('click', function() {
        map.clear();
        keepright.next();
        // core.mark('skip', keepright.next);
    });

    $('#fixed').on('click', function() {
        map.clear();
        // core.mark('done', keepright.next);
    });
};

function edit() {
    var bottom = current._bounds._southWest.lat - 0.001;
    var left = current._bounds._southWest.lng - 0.001;
    var top = current._bounds._northEast.lat + 0.001;
    var right = current._bounds._northEast.lng + 0.001;

    // var newWindow = window.open('');

    $.ajax('http://localhost:8111/load_and_zoom?' + querystring.stringify({
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        select: current._osm_object_type + current._osm_object_id
    }), {
        error: function() {
            // fallback to iD
            var url = 'http://openstreetmap.us/iD/release/#';
            if (current._osm_object_type && current._osm_object_id) {
                url += 'id=' + current._osm_object_type.slice(0, 1) + current._osm_object_id;
            } else {
                url += 'map=' + window.map.getZoom() + '/' + window.map.getCenter().lng + '/' + window.map.getCenter().lat;
            }

            $('#sidebar').hide();
            $('#main').append('<iframe id="iD-frame" src="' + url + '"frameborder="0"></iframe>');
            $('#main').css('margin-left', '0px');

            // newWindow.location = url;
        },
        success: function() {
            // newWindow.close();
        }
    });
}

module.exports = keepright;
