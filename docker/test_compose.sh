#!/bin/bash

# Start the containers
docker-compose up -d

# Give the containers some time to start and run
sleep_time_seconds=60
sleep $sleep_time_seconds

# Check if any containers have exited
exited_containers=$(docker-compose ps -q | xargs docker inspect -f '{{.Name}} {{.State.Status}}' | grep -v "running")

# If there are any exited containers, print an error message, stop and remove containers, and exit with failure status
if [ ! -z "$exited_containers" ]; then
  echo "Error: The following containers have exited during the test:"
  echo "$exited_containers"
  docker-compose down
  exit 1
fi

# If all containers are still running, print a success message, stop and remove containers, and exit with success status
echo "Success: All containers are still running after $sleep_time_seconds seconds."
docker-compose down
exit 0
