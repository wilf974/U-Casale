#!/bin/bash

# Health Check Script for U Casale
# Checks if all services are running properly

set -e

echo "🏥 U Casale Health Check"
echo "========================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if containers are running
echo "📦 Container Status:"
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓${NC} Containers are running"
else
    echo -e "${RED}✗${NC} Some containers are not running"
    docker compose ps
    exit 1
fi
echo ""

# Check PostgreSQL
echo "🗄️  PostgreSQL:"
if docker compose exec -T postgres pg_isready -U ucasale > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} PostgreSQL is ready"
else
    echo -e "${RED}✗${NC} PostgreSQL is not ready"
    exit 1
fi
echo ""

# Check App (Next.js)
echo "🚀 Next.js App:"
if docker compose exec -T app wget -q -O /dev/null http://localhost:3000 2>/dev/null; then
    echo -e "${GREEN}✓${NC} App is responding"
else
    echo -e "${RED}✗${NC} App is not responding"
    exit 1
fi
echo ""

# Check Nginx
echo "🌐 Nginx:"
if docker compose exec -T nginx nginx -t > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Nginx configuration is valid"
else
    echo -e "${RED}✗${NC} Nginx configuration has errors"
    exit 1
fi
echo ""

# Check SSL Certificate
echo "🔒 SSL Certificate:"
if [ -f "./certbot/conf/live/ucasale.woutils.com/fullchain.pem" ]; then
    EXPIRY=$(docker compose exec -T nginx openssl x509 -noout -enddate -in /etc/letsencrypt/live/ucasale.woutils.com/fullchain.pem 2>/dev/null | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

    if [ $DAYS_LEFT -gt 30 ]; then
        echo -e "${GREEN}✓${NC} SSL certificate valid (expires in $DAYS_LEFT days)"
    elif [ $DAYS_LEFT -gt 0 ]; then
        echo -e "${YELLOW}⚠${NC} SSL certificate expires soon ($DAYS_LEFT days left)"
    else
        echo -e "${RED}✗${NC} SSL certificate has expired!"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠${NC} SSL certificate not found (using self-signed?)"
fi
echo ""

# Check Disk Space
echo "💾 Disk Space:"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "${GREEN}✓${NC} Disk usage: ${DISK_USAGE}%"
elif [ $DISK_USAGE -lt 90 ]; then
    echo -e "${YELLOW}⚠${NC} Disk usage: ${DISK_USAGE}% (consider cleanup)"
else
    echo -e "${RED}✗${NC} Disk usage: ${DISK_USAGE}% (critically high!)"
fi
echo ""

# Check Memory
echo "🧠 Memory Usage:"
MEMORY_USAGE=$(docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}" | grep ucasale)
echo "$MEMORY_USAGE"
echo ""

# Summary
echo "========================"
echo -e "${GREEN}✓ All health checks passed!${NC}"
echo ""
echo "Access your site at: https://ucasale.woutils.com"
