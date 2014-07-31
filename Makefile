.PHONY: keepright-tasks osmi-tasks

# need tigerdelta
	# import, tasks, backup
	# waiting for it to stabilize

install:
	sh install.sh
	sh import.keepright.sh
	sh import.osmi.sh

update:
	make update-keepright
	make update-osmi

tasks:
	make keepright-tasks
	make osmi-tasks
	make keepright-zip
	make osmi-zip

update-keepright:
	echo 'updating keepright'
	echo "DROP DATABASE keepright;" | psql -U postgres
	sh import.keepright.sh
	echo 'done updating keepright'

update-osmi:
	echo 'updating osmi'
	echo "DROP DATABASE osmi;" | psql -U postgres
	sh import.osmi.sh
	echo 'done updating osmi'

keepright-zip:
	FILE="keepright-$(date +%s).zip"
	zip -r $FILE keepright-tasks/
	cp $FILE keepright-latest.zip
	s3cmd put --acl-public $FILE s3://to-fix/$FILE
	s3cmd put --acl-public keepright-latest.zip s3://to-fix/keepright-latest.zip
	echo "keepright dump: s3://to-fix/$FILE"

osmi-zip:
	FILE="osmi-$(date +%s).zip"
	zip -r $FILE osmi-tasks/
	cp $FILE osmi-latest.zip
	s3cmd put --acl-public $FILE s3://to-fix/$FILE
	s3cmd put --acl-public osmi-latest.zip s3://to-fix/osmi-latest.zip
	echo "osmi dump: s3://to-fix/$FILE"

keepright-tasks:
	rm -rf keepright-tasks
	sh tasks.keepright.sh

osmi-tasks:
	rm -rf osmi-tasks
	sh tasks.osmi.sh

server:
	sudo ./node_modules/forever/bin/forever start index.js
