#!/bin/sh

unzip -o keepright-latest.zip
unzip -o osmi-latest.zip
unzip -o tigerdelta-latest.zip

find osmi-tasks -type f | grep csv | parallel "node import-csv.js {}"
find keepright-tasks -type f | grep csv | parallel "node import-csv.js {}"
find tigerdelta-tasks -type f | grep csv | parallel "node import-csv.js {}"
node import-csv.js northeast_highway_intersects_building.csv

rm -rf keepright-tasks
rm -rf tigerdelta-tasks
rm -rf osmi-tasks
