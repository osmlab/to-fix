var fs = require('fs');

var _ = require('underscore'),
    querystring = require('querystring');

var core = require('./core'),
    map = require('./map');

var templates = {
    editbar: _(fs.readFileSync('./templates/editbar.html', 'utf8')).template()
};

var editbar = {};

editbar.init = function() {
    if (!$('#editbar').length) {
        $('#main').append(templates.editbar(current));
        editbar.bind();
    } else {
        return false;
    }
};

editbar.bind = function() {
    $('#edit').on('click', editbar.edit);

    $('#skip').on('click', function() {
        map.clear();
        current.loader.next();
    });

    $('#fixed').on('click', function() {
        map.clear();
        core.mark('done', current.loader.next);
    });

    mouse.bind('e', function() {
        $('#edit').click();
    });

    mouse.bind('s', function() {
        $('#skip').click();
    });
};

editbar.edit = function() {
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

            // newWindow.localhosttion = url;
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
};

module.exports = editbar;
