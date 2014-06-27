##to-fix

Gathering and serving up OSM QA data in an actionable way.

###Usage
Just run `make <command>` and it will do that thing.

Commands:
- install - installs PostGIS, downloads and imports keepright and OSM Inspector data.
- reimport - deletes the keepright and OSMI database, redownloads and imports everything
- backup - backs up the keepright and OSMI databases using pg_dump
- clean - drops and keepright and OSMI database

###Notes
- KeepRight includes lots of useful data but doesn't include geometry of the 
problem itself, just a reference
- OSM Inspector includes geometry of a problem but not the OSM ID or anything else
useful
