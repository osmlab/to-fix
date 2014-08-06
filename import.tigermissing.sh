curl -f "http://trafficways.org/obsolete/missing.json.gz" -o missing.json.gz
sudo ungzip missing.json.gz

split -l 100000 missing.json chunks-

sudo -u postgres createdb -U postgres -T template_postgis -E UTF8 tigermissing

# http://gis.stackexchange.com/a/16357/26389
echo '{"type":"FeatureCollection","features":[' > head
echo ']}' > tail

# add commas to each line
for f in chunks-*;
    do
        awk '{print $0","}' $f > $f.commas
        rm -rf $f
    done

# add featurecollection head and tail
for f in chunks-*;
    do
        cat head $f tail > $f.json
        rm -f $f;
    done

# insert each chunk into postgis
for f in chunks-*.json;
    do
        sudo -u postgres ogr2ogr -update -append -f PostgreSQL PG:dbname=tigermissing $f;
    done
