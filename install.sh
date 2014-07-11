apt-get -y update

echo "- installing postgres + postgis"
apt-get install -y postgres-xc-client
add-apt-repository --yes ppa:developmentseed/mapbox-streets

apt-get install -y libpq-dev libgeos-c1 libgeos++-dev proj-bin mapnik-utils postgresql-9.3 postgresql-9.3-postgis-2.1 postgresql-contrib-9.3 unzip postgresql-client-9.3 postgresql-common postgresql-client-common postgresql-plpython-9.3

sudo apt-get install -y git vim htop bzip2 curl gdal-bin s3cmd

echo "- setting up postgres permissions + database"
chmod a+rx $HOME

# postgis template
sudo -u postgres createdb -U postgres -E UTF8 template_postgis
sudo -u postgres psql -U postgres -d postgres -c "UPDATE pg_database SET datistemplate='true' WHERE datname='template_postgis';"
sudo -u postgres psql -U postgres -d template_postgis -c "CREATE EXTENSION postgis;"
sudo -u postgres psql -U postgres -d template_postgis -c "GRANT ALL ON geometry_columns TO PUBLIC;"
sudo -u postgres psql -U postgres -d template_postgis -c "GRANT ALL ON geography_columns TO PUBLIC;"
sudo -u postgres psql -U postgres -d template_postgis -c "GRANT ALL ON spatial_ref_sys TO PUBLIC;"

# play nicely with other users
sh -c 'echo "
local all postgres trust
local all all trust
host all all 127.0.0.1/32 trust
host all all ::1/128 trust
host replication postgres samenet trust
" > /etc/postgresql/9.3/main/pg_hba.conf'

sudo killall postgres

mkdir -p /mnt/data/postgres/
mv /var/lib/postgresql/9.3/main/ /mnt/data/postgres/
cd /var/lib/postgresql/9.3
ln -s /mnt/data/postgres/main main

sudo /etc/init.d/postgresql start
