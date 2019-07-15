#!/bin/sh

docker-compose exec node sh -c "sh bin/yarn.sh $1"
