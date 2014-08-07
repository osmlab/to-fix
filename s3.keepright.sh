FILE="keepright-$(date +%s).zip"

echo $FILE

zip -r ${FILE} keepright-tasks/

cp ${FILE} keepright-latest.zip

s3cmd put --acl-public ${FILE} s3://to-fix/$FILE
s3cmd put --acl-public keepright-latest.zip s3://to-fix/keepright-latest.zip

rm -rf keepright-*.zip
