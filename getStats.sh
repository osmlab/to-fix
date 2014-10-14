node stats.js

s3cmd --configure

for a in $(ls *-stats-*.csv); do
    s3cmd put --acl-public $a s3://to-fix/stats/$a
    rm -rf $a
    echo $a
done
