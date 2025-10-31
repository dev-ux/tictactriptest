# API de Justification de Texte

Une API REST qui justifie du texte (aligne les mots à gauche et à droite) avec authentification et limitation de débit.

## Fonctionnalités

- Authentification par token JWT
- Limite de 80 000 mots par jour par utilisateur
- Justification de texte avec une largeur de ligne paramétrable
- Déploiement facile sur Vercel

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)
- Compte Vercel (pour le déploiement)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/text-justify-api.git
   cd text-justify-api
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   ```bash
   cp .env.example .env
   ```
   Puis éditez le fichier `.env` pour définir votre clé secrète JWT.

## Démarrage en mode développement

```bash
npm run dev
```

L'API sera disponible à l'adresse : `http://localhost:3000`

## Construction pour la production

```bash
npm run build
```

## Démarrage en production

```bash
npm start
```

## Déploiement sur Vercel

1. Installez l'interface en ligne de commande de Vercel :
   ```bash
   npm install -g vercel
   ```

2. Connectez-vous à votre compte Vercel :
   ```bash
   vercel login
   ```

3. Déployez l'application :
   ```bash
   vercel
   ```

## Utilisation de l'API

### 1. Obtenir un token

```http
POST /api/token
Content-Type: application/json

{
  "email": "votre@email.com"
}
```

**Réponse réussie (200 OK) :**
```json
{
  "token": "votre.jwt.token.ici"
}
```

### 2. Justifier du texte

```http
POST /api/justify
Content-Type: text/plain
Authorization: Bearer votre.jwt.token.ici

Votre texte à justifier ici qui sera aligné à gauche et à droite.
```

**Réponse réussie (200 OK) :**
```
Votre  texte  à  justifier  ici  qui  sera  aligné  à  gauche  et  à  droite.
```

**Erreurs possibles :**
- `401 Unauthorized` : Token manquant ou invalide
- `402 Payment Required` : Limite de mots quotidienne atteinte (80 000 mots)
- `429 Too Many Requests` : Trop de requêtes en peu de temps

## Tests

Pour exécuter les tests (à implémenter) :

```bash
npm test
```

## Licence

MIT
