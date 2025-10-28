# API de Réservation

## Fonctionnalités implémentées

### 1. **Créer une réservation** (Authentification requise)

- **Route** : `POST /reservations`
- **Middleware** : `auth`
- **Description** : Permet à un utilisateur authentifié de réserver un terrain sportif et d'inviter d'autres utilisateurs
- **Validation** :
  - La date de fin doit être après la date de début
  - Vérification des créneaux disponibles (pas de chevauchement avec d'autres réservations)
- **Body** :
  ```json
  {
    "startDate": "2025-10-28T10:00:00.000Z",
    "endDate": "2025-10-28T12:00:00.000Z",
    "sportEquipmentId": "E001I010430006",
    "invitedUsers": ["uuid-user-1", "uuid-user-2"] // Optionnel
  }
  ```
- **Réponse** : Réservation créée avec le statut `waiting` par défaut. Tous les utilisateurs invités ont automatiquement le statut d'invitation `waiting`
  ```json
  {
    "id": "uuid",
    "userId": "uuid-createur",
    "status": "waiting",
    "invitedUsers": [
      { "userId": "uuid-user-1", "status": "waiting" },
      { "userId": "uuid-user-2", "status": "waiting" }
    ]
  }
  ```

### 2. **Consulter les réservations**

- **Route** : `GET /reservations`
- **Description** : Récupère toutes les réservations avec filtres optionnels
- **Query Params** :
  - `sportEquipmentId` (optionnel) : Filtrer par équipement sportif
  - `status` (optionnel) : Filtrer par statut (`waiting`, `confirmed`, `cancelled`)
- **Exemple** :
  ```
  GET /reservations?sportEquipmentId=E001I010430006&status=confirmed
  ```
- **Réponse** : Liste des réservations triées par date de début avec les utilisateurs invités et leurs statuts

### 3. **Consulter les réservations d'un équipement spécifique**

- **Route** : `GET /sport-equipments/:equip_numero/reservations`
- **Description** : Récupère toutes les réservations pour un équipement sportif donné
- **Exemple** :
  ```
  GET /sport-equipments/E001I010430006/reservations
  ```
- **Réponse** : Liste des réservations pour cet équipement

### 4. **Consulter une réservation spécifique**

- **Route** : `GET /reservations/:id`
- **Description** : Récupère les détails d'une réservation par son ID
- **Réponse** : Détails complets de la réservation avec les informations de l'utilisateur créateur et des invités

### 5. **Annuler une réservation** (Authentification requise)

- **Route** : `DELETE /reservations/:id`
- **Middleware** : `auth`
- **Description** : Permet à un utilisateur d'annuler sa propre réservation
- **Validations** :
  - L'utilisateur doit être le propriétaire de la réservation
  - La réservation ne doit pas déjà être annulée
- **Réponse** : Réservation avec le statut `cancelled`

### 6. **Mettre à jour le statut d'une réservation** (Admin/Owner)

- **Route** : `PATCH /reservations/:id/status`
- **Description** : Permet de changer le statut d'une réservation (pour admin/propriétaire)
- **Body** :
  ```json
  {
    "status": "confirmed"
  }
  ```
- **Statuts possibles** : `waiting`, `confirmed`, `cancelled`

### 7. **Accepter/Refuser une invitation** (Authentification requise) 🆕

- **Route** : `PATCH /reservations/:id/invitation`
- **Middleware** : `auth`
- **Description** : Permet à un utilisateur invité d'accepter ou de refuser une invitation à une réservation
- **Validation** :
  - L'utilisateur doit être dans la liste des invités
  - Seuls les invités peuvent modifier leur propre statut d'invitation
- **Body** :
  ```json
  {
    "status": "confirmed" // ou "refused"
  }
  ```
- **Statuts d'invitation possibles** : `waiting`, `confirmed`, `refused`
- **Réponse** : Réservation mise à jour avec le nouveau statut d'invitation

### 8. **Endpoint de test** (Sans authentification)

- **Route** : `POST /reservationsTest`
- **Description** : Endpoint de test pour créer une réservation sans authentification (utilise un userId en dur)
- **Body** : Identique à la création normale de réservation

## Structure des fichiers

```
app/reservation/
├── controllers/
│   └── reservations_controller.ts    # Gestion des requêtes HTTP
├── services/
│   └── reservation_service.ts        # Logique métier
└── validators/
    └── reservation.ts                 # Validation des données
```

## Modèle de données

### Reservation

```typescript
{
  id: uuid,
  startDate: DateTime,
  endDate: DateTime,
  status: 'waiting' | 'confirmed' | 'cancelled',
  sportEquipmentId: string,
  userId: uuid,  // Créateur de la réservation
  invitedUsers: InvitedUser[],  // Utilisateurs invités avec leurs statuts
  createdAt: DateTime,
  // Relations
  user: User
}
```

### InvitedUser

```typescript
{
  userId: string,  // UUID de l'utilisateur invité
  status: 'waiting' | 'confirmed' | 'refused'  // Statut de l'invitation
}
```

## Statuts

### Statut de réservation

- `waiting` : En attente de confirmation
- `confirmed` : Réservation confirmée
- `cancelled` : Réservation annulée

### Statut d'invitation

- `waiting` : Invitation en attente (défaut à la création)
- `confirmed` : Invitation acceptée par l'invité
- `refused` : Invitation refusée par l'invité

## Logique de validation

### Création de réservation

1. Vérification que `endDate > startDate`
2. Vérification qu'il n'y a pas de chevauchement avec d'autres réservations actives (non annulées)
3. Les réservations annulées ne bloquent pas les créneaux
4. Les utilisateurs invités (optionnels) sont automatiquement ajoutés avec le statut `waiting`

### Annulation de réservation

1. Vérification que la réservation existe
2. Vérification que l'utilisateur est le propriétaire (créateur)
3. Vérification que la réservation n'est pas déjà annulée

### Mise à jour du statut d'invitation

1. Vérification que la réservation existe
2. Vérification que l'utilisateur connecté est dans la liste des invités
3. Mise à jour uniquement du statut de l'utilisateur connecté
4. Seuls les statuts `waiting`, `confirmed` et `refused` sont acceptés

## Gestion des erreurs

- `400` : Validation échouée ou requête invalide
- `403` : Accès non autorisé (tentative d'annuler la réservation d'un autre utilisateur)
- `404` : Réservation non trouvée
- `409` : Conflit (créneau déjà réservé)
- `500` : Erreur serveur

## Routes configurées

```typescript
// Routes avec authentification
POST   /reservations                    # Créer une réservation (avec invités optionnels)
DELETE /reservations/:id                # Annuler sa réservation
PATCH  /reservations/:id/invitation     # Accepter/Refuser une invitation

// Routes publiques
GET    /reservations                           # Lister toutes les réservations (avec filtres)
GET    /reservations/:id                       # Voir une réservation spécifique
GET    /sport-equipments/:equip_numero/reservations  # Réservations d'un équipement
PATCH  /reservations/:id/status                # Mettre à jour le statut (admin)

// Route de test
POST   /reservationsTest                # Créer une réservation sans auth (dev)
```

## Exemples d'utilisation

### Créer une réservation avec invités

```bash
POST /reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "2025-10-29T14:00:00.000Z",
  "endDate": "2025-10-29T16:00:00.000Z",
  "sportEquipmentId": "E001I010430006",
  "invitedUsers": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "f1e2d3c4-b5a6-9870-dcba-fe0987654321"
  ]
}
```

### Un invité accepte l'invitation

```bash
PATCH /reservations/reservation-uuid/invitation
Authorization: Bearer <token-invited-user>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Consulter les réservations d'un terrain

```bash
GET /sport-equipments/E001I010430006/reservations
```

**Réponse** :

```json
[
  {
    "id": "uuid",
    "startDate": "2025-10-29T14:00:00.000Z",
    "endDate": "2025-10-29T16:00:00.000Z",
    "status": "waiting",
    "sportEquipmentId": "E001I010430006",
    "userId": "creator-uuid",
    "invitedUsers": [
      { "userId": "user-1-uuid", "status": "confirmed" },
      { "userId": "user-2-uuid", "status": "waiting" }
    ],
    "createdAt": "2025-10-28T10:00:00.000Z",
    "user": {
      "id": "creator-uuid",
      "email": "creator@example.com"
    }
  }
]
```
