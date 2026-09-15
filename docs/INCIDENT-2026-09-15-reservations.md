# Réservations — erreur 500 Cloudflare du 15 septembre 2026

## Cause et correction
Les logs montrent une adresse IP absente dans le limiteur puis une erreur Hash.update lors du calcul draft-8. Le contrôleur de réservation n'est pas atteint.

Le Worker active explicitement la confiance dans CF-Connecting-IP, fourni par Cloudflare. Le serveur Node classique ne fait pas confiance à cet en-tête. Les IP sont validées et les IPv6 regroupées par /56 via ipKeyGenerator. Une IP absente utilise un quota partagé conservateur. Les en-têtes passent à draft-7. La limite reste de cinq envois par quinze minutes, avec HTTP 429 au dépassement. Le stockage reste en mémoire par instance, comme auparavant : ce n'est pas un quota global distribué.

## Fichiers
- src/middlewares/security.middleware.ts
- worker.ts
- tests/security.middleware.test.ts

## Vérification
29 tests réussis localement avec node --import tsx --test tests/*.test.ts, y compris absence d'IP socket, quotas IPv4 distincts, regroupement IPv6 et rotation X-Forwarded-For. Vérifier aussi lint/build dans GitHub Actions puis une réservation réelle de diagnostic à supprimer immédiatement.

## Déploiement et retour arrière
Le workflow actuel publie les pushes vers integration/backend-supabase. Fusionner la correction testée vers cette branche, attendre Deploy Cloudflare Worker, puis reporter la correction vers main. Aucun changement de schéma ou de données requis.
En cas de régression, restaurer la version Cloudflare précédant ce déploiement ou annuler la fusion par un revert. Attention : cette ancienne version présente l'erreur 500 connue.
Référence main avant intervention : c1f79dd65f77d7503e9b6d26e325ea1a35b055b0. Référence intégration : 90d277e443ab0e1905bb39afc903ded060000511.

## Graphify
La commande graphify update . a été tentée localement mais le binaire est absent. Le workflow Graphify du dépôt doit actualiser le graphe après fusion.
