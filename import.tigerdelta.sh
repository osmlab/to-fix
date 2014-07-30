curl -f "http://trafficways.org/obsolete/preserved.json.gz" -o preserved.json.gz
sudo ungzip preserved.json.gz

split -l 10000 preserved.json chunks-

sudo -u postgres createdb -U postgres -T template_postgis -E UTF8 tigerdelta

# http://gis.stackexchange.com/a/16357/26389
echo '{"type":"FeatureCollection","features":[' > head
echo ']}' > tail

for f in chunks-*;
    do
        cat head $f tail > $f.json
        rm -f $f;
    done

for f in chunks-*.json;
    do
        sudo -u postgres ogr2ogr -update -append -f PostgreSQL PG:dbname=tigerdelta $f;
    done
