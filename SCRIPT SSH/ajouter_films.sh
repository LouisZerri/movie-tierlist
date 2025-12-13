#!/bin/bash

# === 🎯 CONFIG SSH / MYSQL ===
SSH_USER="louis"
SSH_HOST="lzerri-vmdevserver.fr"
MYSQL_USER="root"
MYSQL_PASS="Jeux-video9"
MYSQL_DB="movies_api"

# === 🎬 FORMULAIRE ===
echo "🎥 Ajouter un nouveau film dans la base de données :"

read -p "📌 Titre du film : " TITLE
read -p "📅 Année de sortie : " YEAR
read -p "🎬 Réalisateur : " DIRECTOR
read -p "🌐 Lien IMDB : " IMDB
read -p "🖼️  URL de l'affiche : " POSTER

# Vérification rapide
if [[ -z "$TITLE" || -z "$YEAR" || -z "$DIRECTOR" || -z "$IMDB" || -z "$POSTER" ]]; then
  echo "❌ Tous les champs sont obligatoires"
  exit 1
fi

# === 🛠️ COMMANDE SQL ===
SQL_INSERT_MOVIE="INSERT INTO movie (title, year, director, imdb_url, poster) VALUES ('$TITLE', '$YEAR', '$DIRECTOR', '$IMDB', '$POSTER');"

# === 🚀 ENVOI VIA SSH ===
echo "📡 Connexion à la base de données..."
ssh $SSH_USER@$SSH_HOST "mysql -u$MYSQL_USER -p$MYSQL_PASS -D $MYSQL_DB -e \"$SQL_INSERT_MOVIE\""

# === ✅ RÉSULTAT ===
if [ $? -eq 0 ]; then
    echo "✅ Film ajouté avec succès dans la base ! 🎉"
else
    echo "❌ Une erreur est survenue lors de l'ajout. 🛑"
fi
