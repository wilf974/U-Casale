#!/bin/bash

# U Casale Deployment Script
# Usage: ./deploy.sh [start|stop|restart|logs|update]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please copy .env.production.example to .env and configure it"
    exit 1
fi

# Function to display usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Start all containers"
    echo "  stop        - Stop all containers"
    echo "  restart     - Restart all containers"
    echo "  logs        - Show logs (follow)"
    echo "  status      - Show container status"
    echo "  update      - Pull latest changes and rebuild"
    echo "  backup      - Backup database"
    echo "  ssl-init    - Initialize SSL certificates (first time only)"
    echo "  ssl-renew   - Renew SSL certificates manually"
    echo ""
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running!${NC}"
        exit 1
    fi
}

# Function to start containers
start() {
    echo -e "${GREEN}Starting U Casale containers...${NC}"
    docker compose up -d
    echo -e "${GREEN}Containers started successfully!${NC}"
    echo ""
    echo "Access your site at: https://ucasale.woutils.com"
    echo "Ports:"
    echo "  - HTTP:  4080"
    echo "  - HTTPS: 4443"
}

# Function to stop containers
stop() {
    echo -e "${YELLOW}Stopping U Casale containers...${NC}"
    docker compose down
    echo -e "${GREEN}Containers stopped successfully!${NC}"
}

# Function to restart containers
restart() {
    echo -e "${YELLOW}Restarting U Casale containers...${NC}"
    docker compose restart
    echo -e "${GREEN}Containers restarted successfully!${NC}"
}

# Function to show logs
logs() {
    echo -e "${GREEN}Showing logs (Ctrl+C to exit)...${NC}"
    docker compose logs -f --tail=100
}

# Function to show status
status() {
    echo -e "${GREEN}Container Status:${NC}"
    docker compose ps
}

# Function to update and rebuild
update() {
    echo -e "${GREEN}Updating U Casale...${NC}"

    # Pull latest changes
    echo "Pulling latest changes from git..."
    git pull

    # Rebuild containers
    echo "Rebuilding containers..."
    docker compose build --no-cache

    # Restart containers
    echo "Restarting containers..."
    docker compose up -d

    echo -e "${GREEN}Update completed successfully!${NC}"
}

# Function to backup database
backup() {
    echo -e "${GREEN}Backing up database...${NC}"

    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR

    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/ucasale_backup_$TIMESTAMP.sql"

    docker compose exec -T postgres pg_dump -U ucasale ucasale_db > $BACKUP_FILE

    # Compress backup
    gzip $BACKUP_FILE

    echo -e "${GREEN}Backup created: $BACKUP_FILE.gz${NC}"

    # Keep only last 7 backups
    ls -t $BACKUP_DIR/*.gz | tail -n +8 | xargs -r rm
}

# Function to initialize SSL
ssl_init() {
    echo -e "${GREEN}Initializing SSL certificates...${NC}"
    ./init-letsencrypt.sh
}

# Function to renew SSL
ssl_renew() {
    echo -e "${GREEN}Renewing SSL certificates...${NC}"
    docker compose run --rm certbot renew
    docker compose exec nginx nginx -s reload
    echo -e "${GREEN}SSL certificates renewed successfully!${NC}"
}

# Main script logic
check_docker

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    update)
        update
        ;;
    backup)
        backup
        ;;
    ssl-init)
        ssl_init
        ;;
    ssl-renew)
        ssl_renew
        ;;
    *)
        usage
        exit 1
        ;;
esac
