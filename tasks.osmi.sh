mkdir osmi-tasks

echo "
    COPY (select ogc_fid, wkb_geometry from intersection_lines) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/intersection_lines.csv

echo "
    COPY (select ogc_fid, wkb_geometry from intersections) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/intersections.csv

echo "
    COPY (select ogc_fid, wkb_geometry from role_mismatch) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/role_mismatch.csv

echo "
    COPY (select ogc_fid, wkb_geometry from role_mismatch_hull) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/role_mismatch_hull.csv

echo "
    COPY (select ogc_fid, wkb_geometry from unconnected_major1) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/unconnected_major1.csv

echo "
    COPY (select ogc_fid, wkb_geometry from unconnected_major2) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/unconnected_major2.csv

echo "
    COPY (select ogc_fid, wkb_geometry from unconnected_major5) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/unconnected_major5.csv

echo "
    COPY (select ogc_fid, wkb_geometry from unconnected_minor1) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/unconnected_minor1.csv

echo "
    COPY (select ogc_fid, wkb_geometry from unconnected_minor2) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > osmi-tasks/unconnected_minor2.csv
