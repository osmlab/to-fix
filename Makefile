install:
	sh install.sh
	sh import.keepright.sh
	sh import.osmi.sh

reimport:
	make dropdbs
	sh import.keepright.sh
	sh.import.osmi.sh

keepright.sql:
	FILE="keepright-$(date +%s).sql"
	sudo -u postgres pg_dump keepright > $FILE
	echo "new backup: $FILE"

osmi.sql:
	FILE="osmi-$(date +%s).sql"
	sudo -u postgres pg_dump osmi > $FILE
	echo "new backup: $FILE"

backup:
	make keepright.sql
	make osmi.sql

dropdbs:
	echo 'dropping databases'
	echo "DROP DATABASE osmi;" | psql -U postgres
	echo "DROP DATABASE keepright;" | psql -U postgres

tasks:
	rm -rf keepright-tasks
	rm -rf osmi-tasks
	sh tasks.keepright.sh
	sh tasks.osmi.sh
	# need to figure out hashing

s3push:
	make s3clean
	s3cmd put --acl-public --resursive keepright-tasks s3://to-fix/
	s3cmd put --acl-public --recursive osmi-tasks s3://to-fix/

s3clean:
	s3cmd del --recursive s3://to-fix/keepright-tasks/
	s3cmd del --recursive s3://to-fix/osmi-tasks/
