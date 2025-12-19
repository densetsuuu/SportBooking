# Sport Booking

Application de réservation d'équipements sportifs permettant de rechercher, réserver et gérer des installations
sportives en France.

## Métriques

![Checks](https://github.com/densetsuuu/SportBooking/actions/workflows/checks.yml/badge.svg)

### Code coverage

| Statements                                                                        | Branches                                                                          | Functions                                                                       | Lines                                                                   |
|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| ![Statements](https://img.shields.io/badge/statements-46.8%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-88.88%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-5.81%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-46.8%25-red.svg?style=flat) |

## Sommaire

- [Architecture](#architecture)
- [Stack Technique](#stack-technique)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Infrastructure](#infrastructure)
- [Prérequis](#prérequis)
- [Installation et Démarrage](#installation-et-démarrage)
- [Structure du Projet](#structure-du-projet)
- [Scripts Disponibles](#scripts-disponibles)
- [Fonctionnalités Principales](#fonctionnalités-principales)
- [Base de Données](#base-de-données)
- [Outils de Développement](#outils-de-développement)
- [Variables d'Environnement](#variables-denvironnement)
- [Développement](#développement)
- [Contribution](#contribution)
- [CI/CD](#cicd)

## Architecture

Ce projet utilise une architecture **monorepo** avec pnpm workspace :

```
sport-booking/
├── apps/
│   ├── backend/          # API AdonisJS
│   └── frontend/         # Client Tanstack Router + React
├── docker-compose.yaml
├── turbo.json
└── pnpm-workspace.yaml
```

**Orchestration** : Turbo pour optimiser les builds et la gestion des dépendances dans le monorepo.

## Stack Technique

### Backend

- **Framework** : AdonisJS 6 (Node.js/TypeScript)
- **Base de données** : PostgreSQL avec Lucid ORM
- **Authentification** : Session-based + Google OAuth (via @adonisjs/ally)
- **Autorisation** : Bouncer pour la gestion des permissions
- **Stockage** : AWS S3 / MinIO (pour le développement local)
- **Validation** : VineJS pour la validation des données backend, Zod pour les formulaires frontend
- **Tests** : Japa (test runner)
- **API externe** : API gouvernementale des équipements sportifs français

### Frontend

- **Framework** : React 19 + TypeScript
- **Build** : Vite 7
- **Routing** : TanStack Router (file-based routing)
- **State Management** : TanStack Query
- **API Client** : Tuyau (type-safe API client avec génération automatique)
- **UI** : Tailwind CSS 4 + Radix UI + shadcn/ui
- **Cartes** : Leaflet / React Leaflet pour la visualisation géographique
- **Formulaires** : React Hook Form + Zod
- **Notifications** : Sonner
- **Tests** : Vitest + Testing Library

### Infrastructure

- **Containerisation** : Docker Compose
- **Services** :
    - PostgreSQL (avec extension pgvector)
    - MinIO (stockage S3-compatible)
    - Redis (cache et sessions)
- **Monorepo** : pnpm + Turbo

## Prérequis

- **Node.js** : 24+
- **pnpm** : 10+
- **Docker** et **Docker Compose**

## Installation et Démarrage

### Installation des dépendances

```bash
pnpm install
```

### Démarrage de l'environnement complet

```bash
# Démarrer Docker + Frontend + Backend
pnpm dev
```

Cette commande lance tous les services Docker (PgVector, MinIO, Redis), crée le bucket MinIO et lance le backend
AdonisJS et le frontend React.

### Setup backend (initialisation de la base de données)

Créer puis remplir le fichier .env a partir du fichier .env.example dans `apps/backend/` puis exécuter les commandes
suivantes :

```bash
cd apps/backend
node ace migration:fresh --seed
node ace generate:key # Génère la clé APP_KEY pour l'encryption
```

### URLs de l'application

- **Backend (API)** : http://localhost:3333
- **Frontend** : http://localhost:3000
- **MinIO Console** : http://localhost:9001

> **Note** : Le bucket MinIO configuré dans `S3_BUCKET` sera créé automatiquement au démarrage du backend s'il n'existe
> pas déjà. Aucune configuration manuelle n'est nécessaire.

## Structure du Projet

```
sport-booking/
├── apps/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── reservation/      # Gestion des réservations
│   │   │   ├── sport_equipments/ # Équipements sportifs
│   │   │   ├── core/             # Services et utilitaires communs
│   │   │   └── common/           # Types et helpers partagés
│   │   ├── database/
│   │   │   └── migrations/       # Migrations de base de données
│   │   ├── start/                # Configuration et routes
│   │   └── tests/                # Tests backend
│   │
│   └── frontend/
│       ├── src/
│       │   ├── routes/           # Routes (file-based)
│       │   ├── components/       # Composants UI
│       │   │   └── ui/           # Composants shadcn/ui
│       │   └── lib/              # Utilitaires et helpers
│       └── tests/                # Tests frontend
│
├── docker-compose.yaml           # Configuration Docker
├── turbo.json                    # Configuration Turbo
└── pnpm-workspace.yaml          # Configuration du workspace
```

## Scripts Disponibles

### Scripts globaux (à la racine)

```bash
pnpm dev        # Démarre tout (Docker + Frontend + Backend)
pnpm build      # Build tous les packages
pnpm lint       # Lint tous les packages
pnpm format     # Formate le code avec Prettier
pnpm test       # Lance les tests
pnpm typecheck  # Vérification des types TypeScript
```

### Scripts backend

```bash
cd apps/backend
node ace # list of available ace commands
```

### Scripts frontend

```bash
cd apps/frontend
pnpm dev       # Serveur de développement (port 3000)
pnpm build     # Build production
pnpm test      # Lance les tests
```

## Fonctionnalités Principales

- 🏟️ **Recherche d'équipements sportifs** : Intégration avec l'API gouvernementale française des équipements sportifs
- 📅 **Système de réservation** : Création et gestion de réservations avec gestion des créneaux horaires
- 👥 **Invitations partagées** : Invitation d'autres utilisateurs à rejoindre des réservations
- 🔐 **Authentification complète** : Email/password + Google OAuth
- 📄 **Revendication de propriété** : Les propriétaires peuvent revendiquer leurs équipements avec justificatifs
- 🗺️ **Carte interactive** : Visualisation géographique des équipements sportifs
- ✅ **Gestion des statuts** : Workflow de validation pour les réservations et les revendications

## Base de Données

### Modèles principaux

- **users** : Comptes utilisateurs avec avatars et authentification
- **reservations** : Réservations d'équipements avec statuts (waiting, confirmed, cancelled)
- **invitations** : Invitations à des réservations partagées
- **owner_sport_equipment** : Revendication de propriété d'équipements
- **social_accounts** : Comptes de connexion OAuth

### Migrations

Les migrations sont gérées avec Lucid ORM et utilisent un système de versioning avec tri naturel.

## Outils de Développement

### Qualité de Code

- **ESLint** : Linting avec configurations pour TypeScript et React
- **Prettier** : Formatage automatique du code
- **Husky** : Git hooks pour les vérifications pre-commit
- **lint-staged** : Exécution des linters uniquement sur les fichiers modifiés

### Tests

- **Backend** : Japa avec support pour tests unitaires et fonctionnels
- **Frontend** : Vitest + React Testing Library + jsdom

### Type Safety

- **TypeScript strict** sur l'ensemble du projet
- **Tuyau** : Génération automatique de types pour l'API client/serveur
- **Lucid ORM** : Type-safety complète pour les requêtes de base de données

## Variables d'Environnement

### Backend

Créer un fichier `.env` dans `apps/backend/` :

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=sport_booking

# S3 / MinIO
DRIVE_DISK=s3
S3_BUCKET=sport-booking
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# Session
APP_KEY=<générer avec 'node ace generate:key'>

# Google OAuth
GOOGLE_CLIENT_ID=<votre_client_id>
GOOGLE_CLIENT_SECRET=<votre_client_secret>
```

### Frontend

Créer un fichier `.env` dans `apps/frontend/` :

```env
VITE_API_URL=http://localhost:3333
```

## Développement

### Workflow recommandé

1. Lancer l'environnement complet : `pnpm dev`
2. Le backend sera accessible sur http://localhost:3333
3. Le frontend sera accessible sur http://localhost:3000
4. Les modifications déclencheront le hot-reload automatique

### Conventions de code

- Utiliser TypeScript strict
- Suivre les règles ESLint configurées
- Formater le code avec Prettier avant commit
- Écrire des tests pour les nouvelles fonctionnalités

## Contribution

1. Créer une branche depuis `main`
2. Faire vos modifications
3. Vérifier que les tests passent : `pnpm test`
4. Vérifier le linting : `pnpm lint`
5. Créer une pull request

## CI/CD

Le projet utilise **GitHub Actions** pour l'intégration et le déploiement continus.

### Workflows Automatisés

#### Workflow de Vérification (Pull Requests)

Déclenché automatiquement sur chaque Pull Request (`.github/workflows/checks.yml`) :

1. **Linting** (`pnpm lint`)
    - Vérifie la qualité du code avec ESLint
    - Garantit le respect des conventions de code

2. **Type Checking** (`pnpm typecheck`)
    - Validation TypeScript stricte
    - Détection des erreurs de types

3. **Tests Automatisés** (`pnpm test`)
    - Tests unitaires et fonctionnels
    - Environnement de test avec PostgreSQL et Redis
    - Coverage des tests backend (Japa) et frontend (Vitest)

4. **Sécurité** (Trivy Scanner)
    - Scan automatique des vulnérabilités
    - Analyse du système de fichiers et des dépendances
    - Intégration avec GitHub Security

### Configuration des Services CI

Les tests s'exécutent dans un environnement GitHub Actions avec :

- **PostgreSQL** : pgvector/pgvector:0.8.0-pg17
- **Redis** : redis:latest
- **Node.js** : 20.14.0+
- **pnpm** : Version latest via corepack

### Badges de Statut

Vous pouvez ajouter ces badges à votre README pour afficher le statut des workflows :

```markdown
![Checks](https://github.com/VOTRE-USERNAME/sport-booking/actions/workflows/checks.yml/badge.svg)
```

### Déploiement (À venir)

Le workflow `on-push-to-main.yml` contient une configuration pour :

- **Build Docker** : Construction d'image Docker pour le backend
- **GitHub Container Registry** : Publication automatique des images
- **Dokploy** : Déploiement automatique sur la plateforme

Pour activer le déploiement automatique :

1. Décommenter les jobs dans `.github/workflows/on-push-to-main.yml`
2. Configurer les secrets GitHub :
    - `DOKPLOY_URL` : URL de votre instance Dokploy
    - `DOKPLOY_AUTH_TOKEN` : Token d'authentification
    - `DOKPLOY_APPLICATION_ID` : ID de l'application

