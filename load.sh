unzip keepright-latest.zip
unzip osmi-latest.zip
unzip tigerdelta-latest.zip

ls keepright-tasks/*.csv | node import-csv.js
ls osmi-tasks/*.csv | node import-csv.js
ls northeast_highway_intersects_building.csv | node import-csv.js
ls tigerdelta-tasks/*.csv | node import-csv.js
