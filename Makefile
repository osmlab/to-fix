install:
	sh install.sh
	sh import.keepright.sh
	sh import.osmi.sh

reimport:
	make dropdbs
	sh import.keepright.sh
	sh.import.osmi.sh

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

keepright-tasks:
	rm -rf keepright-tasks
	sh tasks.keepright.sh

osmi-tasks:
	rm -rf osmi-tasks
	sh tasks.osmi.sh

server:
	sudo ./node_modules/forever/bin/forever start index.js
