#!/bin/sh

docker-compose exec node sh -c "sh bin/gulp.sh $1"
