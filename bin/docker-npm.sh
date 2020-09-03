#!/bin/sh

docker-compose exec node sh -c "sh bin/npm.sh $1 $2"
