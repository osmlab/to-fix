# views are useful for telling which layers:
# http://tools.geofabrik.de/osmi/views/multipolygon/view.json
# http://tools.geofabrik.de/osmi/views/addresses/view.json
# http://tools.geofabrik.de/osmi/views/geometry/view.json
# http://tools.geofabrik.de/osmi/views/tagging/view.json
# http://tools.geofabrik.de/osmi/views/boundaries/view.json
# http://tools.geofabrik.de/osmi/views/water/view.json
# http://tools.geofabrik.de/osmi/views/places/view.json
# http://tools.geofabrik.de/osmi/views/highways/view.json

# I'm only interested in certain layers
# we could grab them all at once but this is a little more manageable
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=role_mismatch_hull" > role_mismatch_hull.gml
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=role_mismatch" > role_mismatch_ways.gml
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=intersections" > intersection_points.gml
curl -f "http://tools.geofabrik.de/osmi/view/multipolygon/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=intersection_lines" > intersection_lines.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_major5,unconnected_major2,unconnected_major1" > routing_major.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=unconnected_minor5,unconnected_minor2,unconnected_minor1" > routing_minor.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=islands" > islands.gml
curl -f "http://tools.geofabrik.de/osmi/view/routing/wxs?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=duplicate_ways" > duplicate_ways.gml
