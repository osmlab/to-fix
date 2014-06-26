# views:
# http://tools.geofabrik.de/osmi/view

# layers:
# http://tools.geofabrik.de/osmi/views/multipolygon/view.json
# http://tools.geofabrik.de/osmi/views/addresses/view.json
# http://tools.geofabrik.de/osmi/views/geometry/view.json
# http://tools.geofabrik.de/osmi/views/tagging/view.json
# http://tools.geofabrik.de/osmi/views/boundaries/view.json
# http://tools.geofabrik.de/osmi/views/water/view.json
# http://tools.geofabrik.de/osmi/views/places/view.json
# http://tools.geofabrik.de/osmi/views/highways/view.json
# http://tools.geofabrik.de/osmi/views/routing/view.json

sudo -u postgres createdb -U postgres -T template_postgis -E UTF8 osmi

# I'm only interested in certain layers
# commented out lines send 500 err, I think there are just too many, want to find a way around that
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=role_mismatch_hull" > role_mismatch_hull.gml
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=role_mismatch" > role_mismatch_ways.gml
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=intersections" > intersection_points.gml
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=intersection_lines" > intersection_lines.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_major5" > routing_major5.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_major2" > routing_major2.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_major1" > routing_major1.gml
# curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_minor5" > routing_minor5.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_minor2" > routing_minor2.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_minor1" > routing_minor1.gml
# curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=islands" > islands.gml
# curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=duplicate_ways" > duplicate_ways.gml

for a in $(ls *.gml); do
    sudo -u postgres ogr2ogr -overwrite -f PostgreSQL PG:dbname=osmi $a
done

rm -rf *.gml
