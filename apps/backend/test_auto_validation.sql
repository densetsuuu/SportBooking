-- Script de test pour la validation automatique des réservations
--
-- SCÉNARIO 1: Réservation SANS utilisateurs invités
-- Résultat attendu: Status = 'confirmed' dès la création
INSERT INTO
    reservations (
        id,
        user_id,
        sport_equipment_id,
        start_date,
        end_date,
        status,
        created_at
    )
VALUES (
        'a1111111-1111-1111-1111-111111111111',
        '5b4c20aa-080a-45bf-b806-88f7de743504', -- User existant
        1,
        '2025-02-15 10:00:00',
        '2025-02-15 12:00:00',
        'confirmed', -- Devrait être 'confirmed' car pas d'invités
        NOW()
    );

-- SCÉNARIO 2: Réservation AVEC utilisateurs invités (2 invités)
-- Résultat attendu: Status = 'waiting' jusqu'à ce que tous répondent
INSERT INTO
    reservations (
        id,
        user_id,
        sport_equipment_id,
        start_date,
        end_date,
        status,
        created_at
    )
VALUES (
        'b2222222-2222-2222-2222-222222222222',
        '5b4c20aa-080a-45bf-b806-88f7de743504',
        2,
        '2025-02-20 14:00:00',
        '2025-02-20 16:00:00',
        'waiting', -- Status initial 'waiting' car il y a des invités
        NOW()
    );

-- Créer 2 invitations pour la réservation b2222222...
-- Expiration: 1 heure avant le début (2025-02-20 13:00:00)
INSERT INTO
    invitations (
        id,
        user_id,
        reservation_id,
        status,
        expiration_date,
        created_at
    )
VALUES (
        'c3333333-3333-3333-3333-333333333333',
        '82cfc8f9-90ca-4e2d-abfd-eac72ce63e39', -- User 2
        'b2222222-2222-2222-2222-222222222222',
        'waiting',
        '2025-02-20 13:00:00', -- 1h avant le début
        NOW()
    );

INSERT INTO
    invitations (
        id,
        user_id,
        reservation_id,
        status,
        expiration_date,
        created_at
    )
VALUES (
        'd4444444-4444-4444-4444-444444444444',
        'f1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', -- User 3
        'b2222222-2222-2222-2222-222222222222',
        'waiting',
        '2025-02-20 13:00:00',
        NOW()
    );

-- TEST 1: Le premier invité accepte
-- Résultat attendu: La réservation reste en 'waiting' car il reste 1 personne qui n'a pas répondu
UPDATE invitations
SET
    status = 'confirmed'
WHERE
    id = 'c3333333-3333-3333-3333-333333333333';

-- Vérifier le status (devrait être toujours 'waiting')
SELECT
    r.id,
    r.status,
    COUNT(i.id) as total_invitations,
    SUM(
        CASE
            WHEN i.status = 'waiting' THEN 1
            ELSE 0
        END
    ) as pending_invitations
FROM reservations r
    LEFT JOIN invitations i ON r.id = i.reservation_id
WHERE
    r.id = 'b2222222-2222-2222-2222-222222222222'
GROUP BY
    r.id,
    r.status;

-- TEST 2: Le deuxième invité refuse
-- Résultat attendu: La réservation passe automatiquement en 'confirmed' car tous ont répondu
UPDATE invitations
SET
    status = 'refused'
WHERE
    id = 'd4444444-4444-4444-4444-444444444444';

-- Vérifier le status (devrait maintenant être 'confirmed')
SELECT
    r.id,
    r.status,
    COUNT(i.id) as total_invitations,
    SUM(
        CASE
            WHEN i.status = 'waiting' THEN 1
            ELSE 0
        END
    ) as pending_invitations,
    SUM(
        CASE
            WHEN i.status = 'confirmed' THEN 1
            ELSE 0
        END
    ) as confirmed_invitations,
    SUM(
        CASE
            WHEN i.status = 'refused' THEN 1
            ELSE 0
        END
    ) as refused_invitations
FROM reservations r
    LEFT JOIN invitations i ON r.id = i.reservation_id
WHERE
    r.id = 'b2222222-2222-2222-2222-222222222222'
GROUP BY
    r.id,
    r.status;

-- SCÉNARIO 3: Test de l'expiration automatique
-- Créer une réservation avec invitation qui expire dans le passé
INSERT INTO
    reservations (
        id,
        user_id,
        sport_equipment_id,
        start_date,
        end_date,
        status,
        created_at
    )
VALUES (
        'e5555555-5555-5555-5555-555555555555',
        '5b4c20aa-080a-45bf-b806-88f7de743504',
        3,
        '2025-02-01 10:00:00',
        '2025-02-01 12:00:00',
        'waiting',
        NOW()
    );

-- Invitation avec date d'expiration PASSÉE (devrait être annulée par le cleanup)
INSERT INTO
    invitations (
        id,
        user_id,
        reservation_id,
        status,
        expiration_date,
        created_at
    )
VALUES (
        'f6666666-6666-6666-6666-666666666666',
        '82cfc8f9-90ca-4e2d-abfd-eac72ce63e39',
        'e5555555-5555-5555-5555-555555555555',
        'waiting',
        '2025-01-31 09:00:00', -- Date passée !
        NOW()
    );

-- Pour tester le cleanup, appelez l'endpoint: POST /reservations/cleanup-expired
-- Ou exécutez cette requête SQL:
UPDATE invitations
SET
    status = 'refused'
WHERE
    status = 'waiting'
    AND expiration_date IS NOT NULL
    AND expiration_date <= NOW();

-- Vérifier les invitations expirées
SELECT i.*, r.start_date, r.status as reservation_status
FROM invitations i
    JOIN reservations r ON i.reservation_id = r.id
WHERE
    i.id = 'f6666666-6666-6666-6666-666666666666';

-- Nettoyage
-- DELETE FROM invitations WHERE reservation_id IN ('a1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'e5555555-5555-5555-5555-555555555555');
-- DELETE FROM reservations WHERE id IN ('a1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'e5555555-5555-5555-5555-555555555555');