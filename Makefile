install:
	sh install.sh
	sh import.keepright.sh
	sh import.osmi.sh

reimport:
	make clean
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

clean:
	echo 'dropping databases'
	echo "DROP DATABASE osmi;" | pgsql -U postgres
	echo "DROP DATABASE keepright;" | pgsql -U postgres

tasks:
	sh tasks.keepright.sh
	sh tasks.osmi.sh
	# need to figure out hashing
