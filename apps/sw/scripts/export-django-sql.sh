#!/bin/bash
# Export Django database to SQL dump
# Run this from pushsw directory

echo "Exporting Django PostgreSQL database..."

# Get database credentials from .env
DB_NAME=$(grep DATABASE_URL .env | cut -d'@' -f2 | cut -d'/' -f2 | cut -d':' -f1)
DB_USER=$(grep DATABASE_URL .env | cut -d':' -f2 | cut -d'/' -f3)
DB_HOST="localhost"
DB_PORT="5432"

echo "Database: $DB_NAME"
echo "User: $DB_USER"

# Export using pg_dump
docker compose exec -T postgres pg_dump -U $DB_USER $DB_NAME > exported_data.sql

echo "✓ SQL export complete: exported_data.sql"
echo "✓ Size: $(du -h exported_data.sql | cut -f1)"

