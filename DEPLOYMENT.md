# 🚀 Guide de Déploiement U Casale

Guide complet pour déployer U Casale sur votre VPS avec Docker et HTTPS.

## 📋 Prérequis

### Sur votre VPS (168.231.84.168)

```bash
# Se connecter au VPS
ssh root@168.231.84.168

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
apt-get update
apt-get install -y docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version
```

### Configuration DNS

Assurez-vous que votre DNS est bien configuré :

```
A    ucasale.woutils.com    168.231.84.168    300
A    www.ucasale.woutils.com    168.231.84.168    300
```

**Important** : Attendez la propagation DNS (peut prendre jusqu'à 24h, généralement quelques minutes)

```bash
# Vérifier la propagation DNS
dig ucasale.woutils.com +short
# Devrait retourner : 168.231.84.168
```

### Ports

Le serveur utilise les ports suivants :
- **4080** : HTTP (redirige vers HTTPS)
- **4443** : HTTPS

Assurez-vous que ces ports sont ouverts dans votre firewall :

```bash
# UFW (Ubuntu/Debian)
ufw allow 4080/tcp
ufw allow 4443/tcp

# iptables
iptables -A INPUT -p tcp --dport 4080 -j ACCEPT
iptables -A INPUT -p tcp --dport 4443 -j ACCEPT
```

## 📦 Installation

### 1. Cloner le Repository

```bash
# Se placer dans le répertoire de votre choix
cd /opt

# Cloner le projet
git clone [URL_DU_REPO] u-casale
cd u-casale
```

### 2. Configuration des Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.production.example .env

# Éditer les variables d'environnement
nano .env
```

**Variables à configurer obligatoirement** :

```bash
# Base de données
POSTGRES_PASSWORD=VOTRE_MOT_DE_PASSE_SECURISE

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Email pour SSL
SSL_EMAIL=votre-email@example.com

# Email SMTP (optionnel pour l'instant)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_USER=noreply@ucasale.woutils.com
EMAIL_SERVER_PASSWORD=votre-mot-de-passe

# Stripe (laisser vide pour l'instant ou utiliser les clés de test)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Générer un NEXTAUTH_SECRET sécurisé** :

```bash
openssl rand -base64 32
```

### 3. Initialiser les Certificats SSL (Let's Encrypt)

**IMPORTANT** : Cette étape ne doit être faite qu'une seule fois au premier déploiement.

```bash
# Rendre le script exécutable (si pas déjà fait)
chmod +x init-letsencrypt.sh

# Lancer l'initialisation SSL
./init-letsencrypt.sh
```

Ce script va :
1. Créer un certificat temporaire
2. Démarrer Nginx
3. Obtenir un vrai certificat Let's Encrypt
4. Recharger Nginx avec le vrai certificat

**Si vous testez** : Modifiez `staging=0` en `staging=1` dans `init-letsencrypt.sh` pour éviter les limites de rate limit.

### 4. Démarrer l'Application

```bash
# Méthode 1 : Avec le script de déploiement
./deploy.sh start

# Méthode 2 : Avec Make
make start

# Méthode 3 : Avec Docker Compose directement
docker compose up -d
```

### 5. Vérifier le Déploiement

```bash
# Voir le statut des conteneurs
./deploy.sh status
# ou
make status
# ou
docker compose ps

# Voir les logs
./deploy.sh logs
# ou
make logs
```

### 6. Accéder au Site

Ouvrez votre navigateur et allez à :

- **Production** : https://ucasale.woutils.com
- Le HTTP (port 4080) redirige automatiquement vers HTTPS (port 4443)

## 🔧 Commandes Utiles

### Via le script deploy.sh

```bash
./deploy.sh start       # Démarrer les conteneurs
./deploy.sh stop        # Arrêter les conteneurs
./deploy.sh restart     # Redémarrer les conteneurs
./deploy.sh logs        # Voir les logs
./deploy.sh status      # Statut des conteneurs
./deploy.sh update      # Mettre à jour (git pull + rebuild)
./deploy.sh backup      # Sauvegarder la base de données
./deploy.sh ssl-renew   # Renouveler le certificat SSL manuellement
```

### Via Makefile (plus rapide)

```bash
make start          # Démarrer
make stop           # Arrêter
make restart        # Redémarrer
make logs           # Logs
make status         # Statut
make update         # Mettre à jour
make backup         # Backup
make ssl-renew      # Renouveler SSL
make shell-app      # Ouvrir un shell dans le conteneur app
make shell-db       # Ouvrir psql dans la base de données
```

### Docker Compose Direct

```bash
docker compose up -d                    # Démarrer
docker compose down                     # Arrêter
docker compose restart                  # Redémarrer
docker compose logs -f                  # Logs en temps réel
docker compose ps                       # Statut
docker compose build --no-cache         # Rebuild sans cache
docker compose exec app sh              # Shell dans app
docker compose exec postgres psql -U ucasale ucasale_db  # PostgreSQL CLI
```

## 🔄 Mise à Jour de l'Application

Quand vous poussez de nouveaux changements sur Git :

```bash
# Sur le VPS
cd /opt/u-casale

# Méthode automatique (recommandée)
./deploy.sh update

# Ou manuellement
git pull
docker compose build --no-cache
docker compose up -d
```

## 💾 Sauvegardes

### Sauvegarde Automatique

```bash
# Créer une sauvegarde de la base de données
./deploy.sh backup
```

Les sauvegardes sont stockées dans `./backups/` et compressées en `.gz`.
Seules les 7 dernières sauvegardes sont conservées.

### Sauvegarde Manuelle

```bash
# Sauvegarder la base de données
docker compose exec -T postgres pg_dump -U ucasale ucasale_db > backup.sql

# Compresser
gzip backup.sql
```

### Restaurer une Sauvegarde

```bash
# Décompresser
gunzip backup.sql.gz

# Restaurer
docker compose exec -T postgres psql -U ucasale ucasale_db < backup.sql
```

### Script Cron pour Sauvegardes Automatiques

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour une sauvegarde quotidienne à 2h du matin
0 2 * * * cd /opt/u-casale && ./deploy.sh backup >> /var/log/ucasale-backup.log 2>&1
```

## 🔐 SSL / HTTPS

### Renouvellement Automatique

Les certificats SSL Let's Encrypt sont valides 90 jours. Le conteneur `certbot` les renouvelle automatiquement tous les 12h.

### Renouvellement Manuel

Si vous voulez renouveler manuellement :

```bash
./deploy.sh ssl-renew
```

### Vérifier l'Expiration

```bash
echo | openssl s_client -servername ucasale.woutils.com -connect ucasale.woutils.com:4443 2>/dev/null | openssl x509 -noout -dates
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker compose logs

# Vérifier le fichier .env
cat .env

# Recréer les conteneurs
docker compose down
docker compose up -d
```

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est bien démarré
docker compose ps postgres

# Voir les logs PostgreSQL
docker compose logs postgres

# Tester la connexion
docker compose exec postgres psql -U ucasale -d ucasale_db -c "SELECT 1;"
```

### Problème SSL / Certificat

```bash
# Vérifier les logs certbot
docker compose logs certbot

# Supprimer les certificats et recommencer
rm -rf ./certbot/conf/live
rm -rf ./certbot/conf/archive
rm -rf ./certbot/conf/renewal
./init-letsencrypt.sh
```

### L'application ne répond pas

```bash
# Vérifier que l'app est bien démarrée
docker compose ps app

# Voir les logs de l'app
docker compose logs app

# Redémarrer l'app
docker compose restart app
```

### Nginx ne démarre pas

```bash
# Tester la configuration Nginx
docker compose exec nginx nginx -t

# Voir les logs Nginx
docker compose logs nginx

# Recharger Nginx
docker compose exec nginx nginx -s reload
```

### Port déjà utilisé

```bash
# Vérifier quel processus utilise le port 4080
lsof -i :4080

# Ou avec netstat
netstat -tulpn | grep 4080

# Arrêter le processus si nécessaire
kill -9 [PID]
```

## 📊 Monitoring

### Voir l'utilisation des ressources

```bash
# Stats en temps réel
docker stats

# Espace disque utilisé
docker system df

# Nettoyer les images inutilisées
docker system prune -a
```

### Logs

```bash
# Logs de tous les conteneurs
docker compose logs -f

# Logs d'un conteneur spécifique
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f postgres

# Dernières 100 lignes
docker compose logs --tail=100 app
```

## 🔒 Sécurité

### Mise à jour du système

```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# Redémarrer si nécessaire
reboot
```

### Firewall

```bash
# Installer UFW si pas déjà fait
apt install ufw

# Configurer le firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 4080/tcp
ufw allow 4443/tcp
ufw enable
```

### Changement des Mots de Passe

Après le premier déploiement, changez les mots de passe par défaut dans `.env` :

```bash
nano .env

# Changez :
# - POSTGRES_PASSWORD
# - NEXTAUTH_SECRET
# Puis redémarrez :
docker compose down
docker compose up -d
```

## 📈 Optimisation

### Activer le cache Nginx

Le cache est déjà configuré dans `nginx/conf.d/ucasale.conf` pour :
- Fichiers statiques Next.js : 60 minutes
- Images : 30 jours
- Fonts : 1 an

### Optimisation PostgreSQL

Pour un VPS avec peu de RAM, vous pouvez limiter PostgreSQL :

```yaml
# Dans docker-compose.yml, ajouter sous postgres:
command: postgres -c shared_buffers=256MB -c max_connections=100
```

## 🎯 Checklist Post-Déploiement

- [ ] DNS configuré et propagé
- [ ] Ports 4080 et 4443 ouverts
- [ ] Fichier .env configuré avec des secrets sécurisés
- [ ] SSL initialisé avec Let's Encrypt
- [ ] Site accessible en HTTPS
- [ ] Redirection HTTP → HTTPS fonctionne
- [ ] Base de données PostgreSQL opérationnelle
- [ ] Logs accessibles et sans erreur
- [ ] Sauvegarde automatique configurée (cron)
- [ ] Mots de passe par défaut changés
- [ ] Firewall configuré

## 📞 Support

Pour toute question ou problème :

1. Vérifier les logs : `./deploy.sh logs`
2. Consulter cette documentation
3. Vérifier les issues GitHub
4. Contacter l'équipe de développement

---

**Fait avec ❤️ pour U Casale - Seni Production**
