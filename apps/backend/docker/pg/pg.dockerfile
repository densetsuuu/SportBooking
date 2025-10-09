FROM postgres:17-alpine
COPY ./docker/pg/scripts/create_multiple_db.sh /docker-entrypoint-initdb.d/
