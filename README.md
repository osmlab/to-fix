##to-fix

Gathering and serving up OSM QA data in an actionable way.

### Installation
- create your instance (you need at least 10GB disk space, I usually use c3.large)
- log in: `ssh -i ~/.ssh/<your key.pem> ubuntu@<instance public DNS>`
- `cd /mnt`
- `sudo apt-get install git make`
- `git clone https://github.com/osmlab/to-fix.git && cd to-fix/`
- `sudo make install`

###Usage
Just run `sudo make <command>` and it will do that thing.

Commands:
- `install` - installs PostGIS, downloads and imports keepright and OSM Inspector data
- `backup` - backs up the databases using pg_dump
- `update` - updates everything in place
- `tasks` - packages up tasks as csvs and uploads them to s3

###Notes
- KeepRight includes lots of useful data but doesn't include geometry of the 
problem itself, just a reference
