FILE="tigermissing-$(date +%s).zip"

zip -r ${FILE} tigermissing-tasks/

cp ${FILE} tigermissing-latest.zip

s3cmd put --acl-public ${FILE} s3://to-fix/${FILE}
s3cmd put --acl-public tigermissing-latest.zip s3://to-fix/tigermissing-latest.zip

rm -rf tigermissing-*.zip
