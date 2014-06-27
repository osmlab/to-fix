sudo su
TIME=$(data +%s)

 echo "
    COPY (select wkb_geometry from intersection_lines) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > intersection_lines-$TIME.csv

 echo "
    COPY (select wkb_geometry from intersections) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > intersections-$TIME.csv

 echo "
    COPY (select wkb_geometry from role_mismatch) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > role_mismatch-$TIME.csv

 echo "
    COPY (select wkb_geometry from role_mismatch_hull) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > role_mismatch_hull-$TIME.csv

 echo "
    COPY (select wkb_geometry from unconnected_major1) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > unconnected_major1-$TIME.csv

 echo "
    COPY (select wkb_geometry from unconnected_major2) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > unconnected_major2-$TIME.csv

 echo "
    COPY (select wkb_geometry from unconnected_major5) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > unconnected_major5-$TIME.csv

 echo "
    COPY (select wkb_geometry from unconnected_minor1) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > unconnected_minor1-$TIME.csv

 echo "
    COPY (select wkb_geometry from unconnected_minor2) to stdout DELIMITER ',' CSV;
" | psql -U postgres osmi > unconnected_minor2-$TIME.csv

# chop them up and name then with unique reproduceable hashes
