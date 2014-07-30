mkdir tigerdelta-tasks

echo "
    COPY (select ST_AsText(wkb_geometry), name, way from ogrgeojson) to stdout DELIMITER ',' HEADER CSV;
" | psql -U postgres tigerdelta > tigerdelta-tasks/tigerdelta.csv
