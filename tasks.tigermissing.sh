mkdir tigermissing-tasks

echo "
    COPY (select ST_AsText(wkb_geometry), name, way from ogrgeojson) to stdout DELIMITER ',' HEADER CSV;
" | psql -U postgres tigermissing > tigermissing-tasks/tigermissing.csv
