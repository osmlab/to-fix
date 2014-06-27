install:
	sudo su
	sh install.sh
	sh import.keepright.sh
	sh import.osmi.sh

reimport:
	sudo su
	make clean
	sh import.keepright.sh
	sh.import.osmi.sh

keepright.sql:
	sudo su
	FILE="keepright-$(date +%s).sql"
	sudo -u postgres pg_dump keepright > $FILE
	echo "new backup: $FILE"

osmi.sql:
	sudo su
	FILE="osmi-$(date +%s).sql"
	sudo -u postgres pg_dump osmi > $FILE
	echo "new backup: $FILE"

backup:
	sudo su
	make keepright.sql
	make osmi.sql

clean:
	sudo su
	echo 'dropping databases'
	echo "DROP DATABASE osmi;" | pgsql -U postgres
	echo "DROP DATABASE keepright;" | pgsql -U postgres
