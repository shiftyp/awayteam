#!/bin/bash
# Docker entrypoint script.

# Create, migrate, and seed database if it doesn't exist.
if [[ -z `psql -Atq --command="\\list $PGDATABASE" postgres://postgres:postgres@postgres:5432` ]]; then
  echo "Database $PGDATABASE does not exist. Creating..."
  mix ecto.create
  mix run priv/repo/seeds.exs
  echo "Database $PGDATABASE created."
fi

exec mix phx.server