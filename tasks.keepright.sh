sudo su
TIME=$(data +%s)

echo "
    COPY (select wkb_geometry from deadendoneway) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > "deadendoneway-$(data +%s).csv"

echo "
    COPY (select wkb_geometry from impossibleangle) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > impossibleangle-$TIME.csv

echo "
    COPY (select wkb_geometry from mixedlayer) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > mixedlayer-$TIME.csv

echo "
    COPY (select wkb_geometry from nonclosedways) to stdout DELIMITER ',' CSV;
" | psql -U postgres keepright > nonclosedways-$TIME.csv

# chop them up and name then with unique reproduceable hashes
