'use strict';

var $ = require('jquery');
var _ = require('underscore');
var querystring = require('querystring');
var fs = require('fs');
var store = require('store');
var mouse = require('mousetrap');
var BingLayer = require('./ext/bing.js');

var core = require('./core');
var template = _(fs.readFileSync('./templates/map.html', 'utf8')).template();

// transparent street layer for putting on top of other layers
var contextLayer = L.mapbox.tileLayer('aaronlidman.87d3cc29', {
    detectRetina: false
});

var layers = {
    'Bing Satellite': new BingLayer('Arzdiw4nlOJzRwOz__qailc8NiR31Tt51dN2D7cm57NrnceZnCpgOkmJhNpGoppU'),
    'Mapbox Satellite': L.mapbox.tileLayer('aaronlidman.j5kfpn4g', { detectRetina: false }),
    'Streets': L.mapbox.tileLayer('aaronlidman.jgo996i0'),
    'OSM.org': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="http://osm.org">© OpenStreetMap contributors</a>'
    })
};

var baseLayer = store.get('baseLayer') || 'Streets';

window.featureStyle = {
    color: '#FF00B7',
    opacity: 1,
    weight: 4
};

window.altStyle = {
    color: '#00BFFF',
    opacity: 1,
    weight: 4
};

module.exports = {
    init: function() {

        // map is already initialized
        if ($('#map').length) return;
        $('#main').append(template(window.current));
        this.handlers(); // Attach handlers to edit bar

        window.map = L.mapbox.map('map', {'mapbox_logo': true}, {
            maxZoom: 18,
            keyboard: false
        }).setView([22.76, -25.84], 3);

        window.map.zoomControl.setPosition('topright');

        // Layer controller
        layers[baseLayer].addTo(window.map);
        if (baseLayer == 'Bing Satellite') contextLayer.addTo(window.map).bringToFront();
        L.control.layers(layers).addTo(window.map);
        window.map.on('baselayerchange', function(e) {
            store.set('baseLayer', e.name);
            if (e.name == 'Bing Satellite') {
                contextLayer.addTo(window.map).bringToFront();
            } else {
                if (window.map.hasLayer(contextLayer)) window.map.removeLayer(contextLayer);
            }
        });
        window.featureGroup = L.featureGroup().addTo(window.map);
    },

    handlers: function() {
        var self = this;
        $('#edit').on('click', function() {
            self.edit();
            return false;
        });

        $('#skip').on('click', function() {
            self.clear();
            window.current.loader.next();
            return false;
        });

        $('#fixed').on('click', function() {
            self.clear();
            core.mark('done', window.current.loader.next);
            return false;
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

        $('#map').addClass('loading');
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

                $('#main').append('<iframe id="iD" src="' + url + '"frameborder="0"></iframe>');
                $('#iD_escape')
                    .removeClass('hidden')
                    .on('click', function() {
                        $('#iD').remove();
                        $('#skip').click();
                        $('#iD_escape')
                            .addClass('hidden')
                            .unbind();

                        return false;
                    });
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
    },

    clear: function() {
        window.featureGroup.getLayers().forEach(function(layer) {
            window.featureGroup.removeLayer(layer);
        });
    }
};
