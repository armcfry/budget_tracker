# budget_tracker
Web application to replace google sheets as a budget tracking solution

## Running the App
Ensure that docker is running and then run the following:
1. `make up` (spins up the docker containers for the db, frontend, backend)

## Creating Backups
Run the following commands to get the latest backup of the database. Process would ideally be automated in the future.
`docker exec <container_id> pg_dump -U postgres -d budget-tracker -f /tmp/backup-dump-<date>.sql`
`docker cp <container_id>:/tmp/backup-dump-09-03.sql .`