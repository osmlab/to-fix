mkdir keepright-tasks

echo "
    COPY (select object_type, object_id, ST_AsText(wkb_geometry) from deadendoneway) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > keepright-tasks/deadendoneway.csv

echo "
    COPY (select object_type, object_id, ST_AsText(wkb_geometry) from impossibleangle) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > keepright-tasks/impossibleangle.csv

echo "
    COPY (select object_type, object_id, ST_AsText(wkb_geometry) from mixedlayer) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > keepright-tasks/mixedlayer.csv

echo "
    COPY (select object_type, object_id, ST_AsText(wkb_geometry) from nonclosedways) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > keepright-tasks/nonclosedways.csv

for a in $(ls keepright-tasks/*.csv);
do
    dirname=$(basename $a '.csv')
    mkdir -p keepright-tasks/$dirname
    count=0
    while read line
    do
        echo $line > keepright-tasks/$dirname/$count
        count=$(($count + 1))
    done < $a
done
