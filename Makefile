keepright-latest.zip:
	wget -N https://to-fix.s3.amazonaws.com/keepright-latest.zip
osmi-latest.zip:
	wget -N https://to-fix.s3.amazonaws.com/osmi-latest.zip
tigerdelta-latest.zip:
	wget -N https://to-fix.s3.amazonaws.com/tigerdelta-latest.zip
northeast_highway_intersects_building.csv:
	wget -N https://to-fix.s3.amazonaws.com/northeast_highway_intersects_building.csv

install:
	sh install.sh

load: northeast_highway_intersects_building.csv tigerdelta-latest.zip osmi-latest.zip keepright-latest.zip
	node fixed.js
	rm -rf ldb
	mkdir ldb
	sh load.sh

stats:
	sh getStats.sh

clean-ldb:
	rm -rf ldb
	mkdir ldb

clean: clean-ldb
	rm northeast_highway_intersects_building.csv tigerdelta-latest.zip osmi-latest.zip keepright-latest.zip
