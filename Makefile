# U Casale - Makefile for quick commands

.PHONY: help start stop restart logs status update backup ssl-init ssl-renew build clean

help: ## Show this help message
	@echo "U Casale - Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

start: ## Start all containers
	@./deploy.sh start

stop: ## Stop all containers
	@./deploy.sh stop

restart: ## Restart all containers
	@./deploy.sh restart

logs: ## Show container logs
	@./deploy.sh logs

status: ## Show container status
	@./deploy.sh status

update: ## Update and rebuild
	@./deploy.sh update

backup: ## Backup database
	@./deploy.sh backup

ssl-init: ## Initialize SSL certificates (first time)
	@./deploy.sh ssl-init

ssl-renew: ## Renew SSL certificates
	@./deploy.sh ssl-renew

build: ## Build containers without starting
	@docker compose build

clean: ## Remove all containers and volumes (DANGEROUS!)
	@echo "This will remove all containers and volumes. Press Ctrl+C to cancel..."
	@sleep 5
	@docker compose down -v
	@echo "Cleaned successfully"

shell-app: ## Open shell in app container
	@docker compose exec app sh

shell-db: ## Open psql in database container
	@docker compose exec postgres psql -U ucasale ucasale_db

dev: ## Run in development mode
	@npm run dev
