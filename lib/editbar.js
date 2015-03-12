'use strict';

var fs = require('fs');
var $ = require('jquery');
var _ = require('underscore');
var querystring = require('querystring');
var mouse = require('mousetrap');

var core = require('./core');
var map = require('./map');

var templates = { editbar: _(fs.readFileSync('./templates/editbar.html', 'utf8')).template() };

module.exports = {
    init: function() {
        if (!$('#editbar').length) {
            $('#main').append(templates.editbar(window.current));
            this.bind();
        } else {
            return false;
        }
    },

    bind: function() {
        $('#edit').on('click', this.edit);

        $('#skip').on('click', function() {
            map.clear();
            window.current.loader.next();
        });

        $('#fixed').on('click', function() {
            map.clear();
            core.mark('done', window.current.loader.next);
        });

        mouse.bind('e', function() {
            $('#edit').click();
        });

        mouse.bind('s', function() {
            $('#skip').click();
        });
    },

    edit: function() {
        var bottom = window.current.item._bounds._southWest.lat - 0.001;
        var left = window.current.item._bounds._southWest.lng - 0.001;
        var top = window.current.item._bounds._northEast.lat + 0.001;
        var right = window.current.item._bounds._northEast.lng + 0.001;

        $.ajax('http://localhost:8111/load_and_zoom?' + querystring.stringify({
            left: left,
            right: right,
            top: top,
            bottom: bottom,
            select: window.current.item._osm_object_type + window.current.item._osm_object_id
        }), {
            error: function() {
                // if JOSM doesn't respond fallback to iD
                var url = 'http://openstreetmap.us/iD/release/#';
                if (window.current.item._osm_object_type && window.current.item._osm_object_id) {
                    url += 'id=' + window.current.item._osm_object_type.slice(0, 1) + window.current.item._osm_object_id;
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
                window.setTimeout(function() {
                    $('#message').slideUp();
                }, 5000);
            }
        });
    }
};
