FILE="osmi-$(date +%s).zip"

zip -r ${FILE} osmi-tasks/

cp ${FILE} osmi-latest.zip

s3cmd put --acl-public ${FILE} s3://to-fix/${FILE}
s3cmd put --acl-public osmi-latest.zip s3://to-fix/osmi-latest.zip

rm -rf osmi-*.zip
