#!/bin/bash

echo "# yarn" "$1"

# store current working directory in variable
PWD_DIR=$(pwd -P)

# change into folder of current script and store dir name into variable CUR_DIR
CUR_DIR="$( cd "$(dirname "$0")" ; pwd -P )"

# cd into source folder
cd ${CUR_DIR}'/../src'

yarn "$1"

# go back to old working directory
cd ${PWD_DIR}

echo
