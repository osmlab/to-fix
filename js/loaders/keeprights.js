module.export = function() {
    current._osm_object_type = current.object_type;
    current._osm_object_id = current.object_id;
    var full = current._osm_object_type == 'way' ? '/full' : '';

    $.ajax({
        url: 'https://www.openstreetmap.org/api/0.6/' + current._osm_object_type + '/' + current._osm_object_id + full,
        dataType: 'xml',
        success: function (xml) {
            var layer = new L.OSM.DataLayer(xml).setStyle(featureStyle).addTo(layerGroup);
            current.bounds = layer.getBounds();
            map.fitBounds(current.bounds);
            omnivore.wkt.parse(current.st_astext).addTo(layerGroup);
        }
    });

    renderUI({
        title: tasks[qs('error')].title
    });
};
