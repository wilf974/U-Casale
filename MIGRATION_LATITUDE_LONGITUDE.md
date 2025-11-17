# Migration : Latitude et Longitude

## Changements

Ajout des champs `latitude` et `longitude` dans les paramètres du site pour permettre l'affichage d'une carte.

## Déploiement sur le VPS

### Option 1 : Migration Prisma (recommandé)

```bash
# Pull les changements
git pull origin claude/fix-gites-image-upload-01FQWnH37hMKrPikZNmsJKYP

# Générer et appliquer la migration Prisma
docker-compose exec app npx prisma migrate dev --name add_latitude_longitude_to_site_settings

# Rebuild et redémarrer
docker-compose build --no-cache app
docker-compose up -d
```

### Option 2 : Migration SQL manuelle

Si Prisma migrate ne fonctionne pas, exécutez le SQL manuellement :

```bash
# Pull les changements
git pull origin claude/fix-gites-image-upload-01FQWnH37hMKrPikZNmsJKYP

# Appliquer le script SQL
docker-compose exec postgres psql -U ucasale -d ucasale_db -f /path/to/add_latitude_longitude_to_site_settings.sql

# Ou directement :
docker-compose exec postgres psql -U ucasale -d ucasale_db -c "ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION, ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;"

# Rebuild et redémarrer
docker-compose build --no-cache app
docker-compose up -d
```

## Utilisation

1. Allez sur **Dashboard > Paramètres**
2. Remplissez les champs **Latitude** et **Longitude**
3. Exemple pour la Corse :
   - Latitude : `41.6167`
   - Longitude : `8.7372`

## Trouver les coordonnées GPS

### Méthode Google Maps

1. Allez sur [Google Maps](https://maps.google.com)
2. Cherchez votre adresse
3. Faites un clic droit sur le point
4. Cliquez sur les coordonnées pour les copier
5. Format : `latitude, longitude` (ex: `41.6167, 8.7372`)

### Méthode GPS Coordinates

1. Allez sur [GPS Coordinates](https://www.gps-coordinates.net/)
2. Entrez votre adresse
3. Copiez la latitude et la longitude

## Affichage de la carte

Les coordonnées peuvent être utilisées pour afficher une carte sur :
- La page Contact
- Le footer du site
- Les pages des gîtes

Exemple d'intégration (à développer) :
```html
<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=LONGITUDE,LATITUDE,LONGITUDE,LATITUDE&marker=LATITUDE,LONGITUDE"
  width="100%"
  height="400"
></iframe>
```
