#!/bin/sh

unzip -o keepright-latest.zip
unzip -o osmi-latest.zip
unzip -o tigerdelta-latest.zip

ls keepright-tasks/*.csv | node import-csv.js $1
ls osmi-tasks/*.csv | node import-csv.js $1
ls northeast_highway_intersects_building.csv | node import-csv.js $1
ls tigerdelta-tasks/*.csv | node import-csv.js $1

rm -rf keepright-tasks
rm -rf tigerdelta-tasks
rm -rf osmi-tasks
