install:
	sh install.sh
	sh import.keepright.sh
	sh import.osmi.sh

reimport:
	make clean
	sh import.keepright.sh
	sh.import.osmi.sh

activity.sql:
	echo 'backing up activity database'
	sudo -u postgres pg_dump activity > "activity-$(date +%s).sql"

keepright.sql:
	sudo -u postgres pg_dump keepright > keepright-$(date +%s).sql

osmi.sql:
	sudo -u postgres pg_dump osmi > osmi-$(date +%s).sql

backup: activity.sql keepright.sql osmi.sql

clean:
	echo 'deleting error databases'
	echo "DROP DATABASE osmi;" | pgsql -U postgres
	echo "DROP DATABASE keepright;" | pgsql -U postgres
	make activity.sql
