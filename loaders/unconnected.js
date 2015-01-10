var fs = require('fs');

var querystring = require('querystring'),
    qs = querystring.parse(window.location.search.slice(1)),
    _ = require('underscore'),
    omnivore = require('leaflet-omnivore'),
    mouse = require('mousetrap');

var core = require('../lib/core'),
    map = require('../lib/map');

var templates = {
    editbar: _(fs.readFileSync('./templates/editbar.html', 'utf8')).template()
};

var unconnected = {
    auth: ['osm']
};

unconnected.next = function() {
    map.init();

    core.item(qs.error, function() {
        current.item._osm_object_type = 'node';
        current.item._osm_object_id = current.item.node_id;

        $.ajax({
            url: 'https://www.openstreetmap.org/api/0.6/way/' + current.item.way_id + '/full',
            dataType: 'xml',
            success: function (xml) {
                var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);
                current.item._bounds = layer.getBounds();
                window.map.fitBounds(current.item._bounds);

                $.ajax({
                    url: 'https://www.openstreetmap.org/api/0.6/node/' + current.item._osm_object_id,
                    dataType: 'xml',
                    success: function (xml) {
                        var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(featureGroup);

                        if (!$('#editbar').length) {
                            $('#main').append(templates.editbar());
                            unconnected.bind();
                        }
                    },
                    error: function(err) {
                        return unconnected.next();
                    }
                });

            },
            error: function(err) {
                return unconnected.next();
            }
        });
    });
};

unconnected.bind = function() {
    $('#edit').on('click', edit);

    $('#skip').on('click', function() {
        map.clear();
        unconnected.next();
    });

    $('#fixed').on('click', function() {
        map.clear();
        core.mark('done', unconnected.next);
    });

    mouse.bind('e', function() {
        $('#edit').click();
    });

    mouse.bind('s', function() {
        $('#skip').click();
    });
};

function edit() {
    var bottom = current.item._bounds._southWest.lat - 0.001;
    var left = current.item._bounds._southWest.lng - 0.001;
    var top = current.item._bounds._northEast.lat + 0.001;
    var right = current.item._bounds._northEast.lng + 0.001;

    // var newWindow = window.open('');

    $.ajax('http://localhost:8111/load_and_zoom?' + querystring.stringify({
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        select: current.item._osm_object_type + current.item._osm_object_id
    }), {
        error: function() {
            // if JOSM doesn't respond fallback to iD
            var url = 'http://openstreetmap.us/iD/release/#';
            if (current.item._osm_object_type && current.item._osm_object_id) {
                url += 'id=' + current.item._osm_object_type.slice(0, 1) + current.item._osm_object_id;
            } else {
                url += 'map=' + window.map.getZoom() + '/' + window.map.getCenter().lng + '/' + window.map.getCenter().lat;
            }

            $('#main')
                .append('<iframe id="iD" src="' + url + '"frameborder="0"></iframe>')
                .css('margin-left', '0px');

            $('#iD_escape')
                .removeClass('hidden')
                .on('click', function() {
                    $('#iD').remove();
                    $('#main').css('margin-left', '250px');
                    $('#sidebar').show();
                    $('#skip').click();
                    $('#iD_escape')
                        .addClass('hidden')
                        .unbind();
                });

            $('#sidebar').hide();

            // newWindow.location = url;
        },
        success: function() {
            // this newWindow dance is to get around some browser limitations
            // so we always open a new window, if we need it we populate the url, else, just close the empty window
            // this all happens quick enough to not cause issues for the user
            // it's all commented out because I want to make it a setting in the future
                // whether iD loads in an iframe or a new window
            // newWindow.close();
            $('#message')
                .text('Opened in JOSM')
                .show();
            $('#message').slideDown();
            setTimeout(function() {
                $('#message').slideUp();
            }, 5000);
        }
    });
}

module.exports = unconnected;
