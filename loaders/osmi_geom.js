var fs = require('fs');

var _ = require('underscore'),
    omnivore = require('leaflet-omnivore');

var templates = {
    editbar: _(fs.readFileSync('./templates/editbar.html', 'utf8')).template()
};

var osmi_geom = {};

osmi_geom.initialize = function(current, callback) {
    var layer = omnivore.wkt.parse(current.st_astext).addTo(featureGroup);
    layer.setStyle(featureStyle);
    current._bounds = layer.getBounds();
    map.fitBounds(current._bounds);
    $('#main').append(templates.editbar());
    if (callback) callback(null, current);
};

module.exports = osmi_geom;
