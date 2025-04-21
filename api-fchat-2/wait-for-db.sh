#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
  echo "Loading of .env.dev"
  set -a
  source .env.dev
  set +a
else
  echo "Loading of .env"
  set -a
  source .env.prod
  set +a
fi

db_ready=false
while [ "$db_ready" != true ]; do
  echo nc -z db "$DB_DOCKER_PORT"
  if nc -z db "$DB_DOCKER_PORT" >/dev/null 2>&1; then
    db_ready=true
  else
    echo "Waiting for PostgresSQL to be ready..."
    sleep 1
  fi
done

echo "PostgresSQL is ready"
npm run start:$NODE_ENV
