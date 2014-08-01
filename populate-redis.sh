wget http://to-fix.s3.amazonaws.com/osmi-latest.zip
wget http://to-fix.s3.amazonaws.com/keepright-latest.zip

rm -rf osmi-tasks/ keepright-tasks/

unzip osmi-latest.zip
unzip keepright-latest.zip

for f in osmi-tasks/*.csv;
    do
        node csv2redis.js $f
    done

for f in keepright-tasks/*.csv;
    do
        node csv2redis.js $f
    done
