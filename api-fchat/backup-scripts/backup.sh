#!/bin/sh

BACKUP_PATH='/backups'
DATE=$(date +%F_%T)
BACKUP_FILE="fchat_db.sql"

echo "⏳ Creating dump..."
echo "📦 Dumping PostgreSQL database from $DB_HOST:$DB_CONTAINER_PORT..."
pg_dump -h $DB_HOST -p $DB_CONTAINER_PORT -U $DB_USERNAME -d $DB_NAME -F c -f $BACKUP_FILE

echo "☁️ Uploading to DigitalOcean Space..."

# Télécharger le fichier vers DigitalOcean Space
s3cmd put $BACKUP_FILE s3://$SPACE_NAME/$BACKUP_FILE

# Nettoyer les anciens fichiers de sauvegarde
find $BACKUP_PATH -type f -mtime +7 -exec rm {} \;