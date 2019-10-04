#!/bin/bash

if [ -z "$1" ]; then
  command="all"
else
  command=$1
fi

ENVIRONMENTS="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if ! type "docker-compose" > /dev/null; then
  1>&2 echo "Please install docker-compose to use this script"
  exit 1
fi

case $command in
  all|app)
    pushd $ENVIRONMENTS/app
      docker-compose -f docker-compose.yaml -f docker-compose.build.yaml build --parallel && \
        docker-compose -f docker-compose.yaml -f docker-compose.build.yaml push
    popd
    ;;
esac