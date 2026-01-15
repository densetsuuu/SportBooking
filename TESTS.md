# Tests SportBooking

Ce document explique comment lancer les tests du projet SportBooking.

## Prérequis

1. **Docker Desktop** doit être démarré
2. Les conteneurs doivent être lancés : `docker compose up -d` (depuis `apps/backend`)
3. Les migrations doivent être exécutées : `node ace migration:run`
4. Pour les tests E2E : installez les navigateurs Playwright : `npx playwright install chromium`

## Structure des Tests

### Backend (AdonisJS avec Japa)

```
apps/backend/tests/
├── bootstrap.ts              # Configuration des tests
├── unit/                     # Tests unitaires
│   └── fuzzy_search.spec.ts  # Tests de la logique de recherche floue
└── functional/               # Tests fonctionnels (API)
    ├── auth.spec.ts               # Tests d'authentification
    ├── reservations.spec.ts       # Tests des réservations
    ├── sport_equipments.spec.ts   # Tests des équipements sportifs
    └── users.spec.ts              # Tests des utilisateurs
```

### Frontend (Playwright)

```
apps/frontend/tests/
└── e2e/
    ├── auth.spec.ts              # Tests E2E authentification
    └── sport-equipments.spec.ts  # Tests E2E équipements sportifs
```

## Lancer les Tests

### Tests Backend

```bash
# Depuis apps/backend

# Lancer tous les tests
pnpm test

# Ou avec node ace
node ace test

# Lancer uniquement les tests unitaires
node ace test --files=tests/unit/fuzzy_search.spec.ts

# Lancer uniquement les tests fonctionnels d'authentification
node ace test --files=tests/functional/auth.spec.ts

# Lancer les tests avec couverture de code
npx c8 --include=app --reporter=text node ace test

# Lancer les tests avec rapport de couverture HTML
npx c8 --include=app --reporter=html node ace test
# Le rapport sera disponible dans coverage/
```

### Tests Frontend E2E

**Important** : Les tests E2E nécessitent que les serveurs backend et frontend soient démarrés au préalable.

```bash
# Terminal 1 : Démarrer le backend
cd apps/backend
pnpm dev

# Terminal 2 : Démarrer le frontend
cd apps/frontend
pnpm dev

# Terminal 3 : Lancer les tests E2E
cd apps/frontend
pnpm test:e2e

# Autres commandes utiles
pnpm test:e2e:ui       # Interface graphique interactive
pnpm test:e2e:headed   # Tests visibles dans le navigateur
pnpm test:e2e:report   # Voir le rapport HTML des tests
```

## Description des Tests

### Tests Unitaires (8 tests)

#### `fuzzy_search.spec.ts`
Tests de la fonction `similarity` utilisée pour la recherche floue avec PostgreSQL pg_trgm :
- Génération d'expression SQL pour une colonne
- Génération d'expression GREATEST pour plusieurs colonnes
- Sanitization des guillemets simples
- Gestion des colonnes multiples avec quotes
- Erreur si pas de colonnes
- Erreur si terme vide
- Gestion des caractères spéciaux
- Support de 3+ colonnes

### Tests Fonctionnels Backend (55 tests)

#### `auth.spec.ts` (11 tests)
- **Register** : création utilisateur, validation email, champs requis, email dupliqué
- **Login** : connexion valide, mauvais mot de passe, utilisateur inexistant
- **Me** : récupération utilisateur authentifié, accès refusé non authentifié
- **Logout** : déconnexion réussie, accès refusé non authentifié

#### `reservations.spec.ts` (18 tests)
- **Create** : création simple, avec invitations, validation dates, chevauchement, authentification
- **List** : liste complète, filtrage par équipement, filtrage par statut
- **Show** : affichage par ID, erreur 404
- **Cancel** : annulation par propriétaire, refus autre utilisateur, déjà annulée
- **Invitations** : confirmation, refus, auto-validation, utilisateur non invité
- **User Reservations** : réservations incluant invitations acceptées

#### `sport_equipments.spec.ts` (18 tests)
- **List** : liste, pagination, filtrage par sport/ville/nom/bounds
- **Show** : affichage par ID
- **Ownership** : assignation, authentification requise
- **Management** : approbation, refus, déjà approuvé, refus automatique autres demandes
- **Remove Owner** : suppression, vérification propriétaire, inexistant
- **Show Owner** : affichage propriétaire, 404 si inexistant

#### `users.spec.ts` (8 tests)
- **Show** : affichage utilisateur, 404 inexistant
- **Update** : mise à jour profil, refus autre utilisateur, authentification requise
- **Delete** : suppression compte, refus autre utilisateur, authentification requise

### Tests E2E Frontend (22 tests)

#### `auth.spec.ts` (12 tests)
- **Login Page** : affichage correct, validation formulaire vide, email invalide, navigation vers register, navigation vers home, bouton Google OAuth
- **Register Page** : affichage correct, validation formulaire vide, navigation vers login, highlights features
- **Home Page** : affichage, navigation

#### `sport-equipments.spec.ts` (10 tests)
- **Home Page** : affichage page recherche, cartes équipements, toggle liste/carte, pagination
- **Search & Filters** : filtrage par terme, ville, sport, combinaison
- **Map View** : affichage carte, markers équipements

## Couverture de Code

### Backend

La couverture actuelle du code backend est d'environ **76.76%** sur les statements.

Pour générer un rapport HTML de couverture :

```bash
cd apps/backend
npx c8 --include=app --reporter=html node ace test
# Ouvrir coverage/index.html dans un navigateur
```

## Résumé Total

| Type | Tests |
|------|-------|
| **Tests Unitaires** | 8 |
| **Tests Fonctionnels Backend** | 55 |
| **Tests E2E Frontend** | 22 |
| **Total** | **85** |

## Notes Importantes

- Les tests backend utilisent des transactions globales qui sont rollback après chaque test
- Les tests E2E nécessitent que les serveurs backend ET frontend soient démarrés manuellement
- La base de données de test `sport_booking_test` doit exister (créée automatiquement lors du premier lancement des tests)
- Certains tests des équipements sportifs dépendent d'une API gouvernementale externe et tolèrent des erreurs 500
