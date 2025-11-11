# 🚀 Démarrage Rapide - U Casale

Guide rapide pour déployer U Casale sur votre VPS en 5 minutes.

## ⚡ Configuration Rapide

### 1. Prérequis VPS

```bash
# Se connecter au VPS
ssh root@168.231.84.168

# Installer Docker (si pas déjà fait)
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Vérifier
docker --version
docker compose version
```

### 2. Cloner et Configurer

```bash
# Aller dans le répertoire
cd /opt

# Cloner le projet
git clone https://github.com/wilf974/U-Casale.git u-casale
cd u-casale

# Copier et éditer les variables d'environnement
cp .env.production.example .env
nano .env
```

**Variables minimales à configurer :**

```bash
# Mot de passe sécurisé pour PostgreSQL
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!

# Générer avec : openssl rand -base64 32
NEXTAUTH_SECRET=votre-secret-genere-ici

# Email pour SSL (important!)
SSL_EMAIL=votre-email@example.com
```

### 3. Ouvrir les Ports

```bash
# Ouvrir les ports nécessaires
ufw allow 4080/tcp    # HTTP
ufw allow 4443/tcp    # HTTPS
```

### 4. Déployer

```bash
# Initialiser SSL (PREMIÈRE FOIS SEULEMENT)
./init-letsencrypt.sh

# Démarrer l'application
./deploy.sh start

# OU avec Make
make start
```

### 5. Vérifier

```bash
# Voir le statut
./deploy.sh status

# Voir les logs
./deploy.sh logs
```

### 6. Accéder au Site

Ouvrez votre navigateur : **https://ucasale.woutils.com**

---

## 📝 Commandes Essentielles

```bash
./deploy.sh start       # Démarrer
./deploy.sh stop        # Arrêter
./deploy.sh restart     # Redémarrer
./deploy.sh logs        # Voir les logs
./deploy.sh backup      # Sauvegarder la DB
./deploy.sh update      # Mettre à jour
```

---

## 🆘 Problèmes Courants

### DNS ne résout pas
```bash
# Vérifier la propagation DNS
dig ucasale.woutils.com +short

# Attendre la propagation (peut prendre quelques heures)
```

### Certificat SSL échoue
```bash
# Vérifier que le DNS pointe bien vers votre VPS
# Vérifier que les ports 80 et 443 sont accessibles (temporairement)

# Réessayer
rm -rf certbot/conf/*
./init-letsencrypt.sh
```

### Conteneur ne démarre pas
```bash
# Voir les logs
docker compose logs

# Reconstruire
docker compose build --no-cache
docker compose up -d
```

---

## 📖 Documentation Complète

Pour plus de détails : **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

**Support** : Vérifiez les logs avec `./deploy.sh logs`
