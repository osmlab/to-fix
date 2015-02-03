var fs = require('fs');

var querystring = require('querystring'),
    qs = querystring.parse(window.location.search.slice(1));

var core = require('../lib/core'),
    map = require('../lib/map'),
    editbar = require('../lib/editbar');
 
 var bridge_height = {
    auth: ['osm']
 }

 bridge_height.next = function() {
    map.init();
    editbar.init();

    core.item(qs.error, function() {
        L.marker([current.item.lat, current.item.lon])
            .addTo(featureGroup)
            .bindPopup('<table style="width:450px"> \
                            <tr> \
                                <td> Clearance Height </td> \
                                <td>'+ current.item.height +'</td> \
                            </tr> \
                            <tr> \
                                <td> Feature Carried </td> \
                                <td>'+ current.item['Feature.Carried'] +'</td> \
                            </tr> \
                            <tr> \
                                <td> Feature intersected </td> \
                                <td>'+ current.item['Features.Intersected'] +'</dt> \
                            </tr> \
                        </table>', {maxWidth:500})
            .openPopup();
        window.map.setView([current.item.lat, current.item.lon], 16);
        current.item._bounds = window.map.getBounds();
    });
 };

 module.exports = bridge_height;
 