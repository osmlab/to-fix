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
	sh load.sh
stats:
	sh getStats.sh
clean:
	rm northeast_highway_intersects_building.csv tigerdelta-latest.zip osmi-latest.zip keepright-latest.zip
	rm -rf *.ldb