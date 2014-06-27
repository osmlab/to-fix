echo "
    COPY (select wkb_geometry from deadendoneway) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > deadendoneway.csv

echo "
    COPY (select wkb_geometry from impossibleangle) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > impossibleangle.csv

echo "
    COPY (select wkb_geometry from mixedlayer) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > mixedlayer.csv

echo "
    COPY (select wkb_geometry from nonclosedways) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > nonclosedways.csv

# chop them up and name then with unique reproduceable hashes
