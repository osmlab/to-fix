wget https://to-fix.s3.amazonaws.com/keepright-latest.zip
wget https://to-fix.s3.amazonaws.com/osmi-latest.zip
wget https://to-fix.s3.amazonaws.com/tigermissing.csv
wget https://to-fix.s3.amazonaws.com/northeast_highway_intersects_building.csv

unzip keepright-latest.zip
unzip osmi-latest.zip

ls keepright-tasks/*.csv | node import-csv.js
ls osmi-tasks/*.csv | node import-csv.js
ls tigermissing.csv | node import-csv.js
ls northeast_highway_intersects_building.csv | node import-csv.js
