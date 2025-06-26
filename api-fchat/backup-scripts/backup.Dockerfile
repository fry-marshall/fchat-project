FROM alpine:latest

# Installer MySQL client, busybox-cron et s3cmd
RUN apk update && \
    apk add --no-cache \
        postgresql-client \
        curl \
        busybox-suid \
        python3 \
        py3-pip \
        groff \
        less \
        bash \
        s3cmd

# Créer un répertoire pour les sauvegardes
RUN mkdir -p /backups

COPY .s3cfg /root/.s3cfg

# Copier les scripts de sauvegarde et crontab
COPY backup-scripts/backup.sh /usr/local/bin/backup.sh
COPY backup-scripts/crontab /etc/crontabs/root

RUN chmod +x /usr/local/bin/backup.sh

# Configurer le démarrage de cron
CMD ["crond", "-f"]