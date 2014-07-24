# create the db
sudo -u postgres createdb -U postgres -T template_postgis -E UTF8 keepright

# download keepright dump
curl -f http://keepright.ipax.at/keepright_errors.txt.bz2 > errors.txt.bz2
echo "unzipping error file"
bunzip2 errors.txt.bz2

echo "
    CREATE TYPE obj_type AS ENUM('node', 'way', 'relation');
" | psql -U postgres keepright

echo "
    CREATE TYPE the_state AS ENUM('new','reopened','ignore_temporarily','ignore');
" | psql -U postgres keepright

echo "
    CREATE TABLE errors (
        schema varchar(6) NOT NULL,
        error_id integer NOT NULL,
        error_type integer NOT NULL,
        error_name varchar(255) NOT NULL,
        object_type obj_type NOT NULL,
        object_id bigint NOT NULL,
        state the_state NOT NULL,
        first_occurrence timestamp NOT NULL,
        last_checked timestamp NOT NULL,
        object_timestamp timestamp NOT NULL,
        user_name varchar(255) NOT NULL,
        lat integer NOT NULL,
        lon integer NOT NULL,
        comment varchar(10000),
        comment_timestamp bytea,
        msgid bytea,
        txt1 bytea,
        txt2 bytea,
        txt3 bytea,
        txt4 bytea,
        txt5 bytea
    );
" | psql -U postgres keepright
# using bytea for now because I couldn't figure out encoding problems

echo "removing the header"
tail -n +2 errors.txt > errors-nohead.txt
rm -rf errors.txt
# fix NULL issues, NULLs for text in MySQL, not in Postgres
sed -i 's/\\N/NULLs/g' errors-nohead.txt
# COPY takes slashes literally, remove them
sed -i 's/\\//g' errors-nohead.txt
# way sloppy

echo "importing errors to database"
echo "
    COPY errors from '$PWD/errors-nohead.txt';
" | psql -U postgres keepright

echo "
    ALTER TABLE errors ADD COLUMN wkb_geometry GEOMETRY (POINT, 4326);
    UPDATE errors SET wkb_geometry = ST_SetSRID(ST_MakePoint(lon/10000000.0, lat/10000000.0), 4326);
" | psql -U postgres keepright

# let's pick a few errors: https://gist.github.com/aaronlidman/7bb7b84f2a6689f7e94f
echo "importing select error layers"
echo "
    CREATE TABLE nonclosedways AS SELECT object_type, object_id, wkb_geometry from errors where error_name = 'non-closed areas' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE deadendoneway AS SELECT object_type, object_id, wkb_geometry from errors where error_name = 'dead-ended one-ways' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE impossibleangle AS SELECT object_type, object_id, wkb_geometry from errors where error_name = 'impossible angles' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE mixedlayer as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'mixed layers intersections' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE highwaywater as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'highway-waterway' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE doubledplaces as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'doubled places' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE highwayfootpath as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'highway-cyclew/footp' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE mispelledtags as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'misspelled tags' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE island as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'floating islands' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE almostjunction as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'almost-junctions' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE highwayhighway as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'highway-highway' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE highwayriverbank as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'highway-riverbank' order by random();
" | psql -U postgres keepright

echo "
    CREATE TABLE strangelayer as SELECT object_type, object_id, wkb_geometry from errors where error_name = 'strange layers' order by random();
" | psql -U postgres keepright

# drop the rest of the db that we don't need right now
echo "
    DROP TABLE errors;
" | psql -U postgres keepright
