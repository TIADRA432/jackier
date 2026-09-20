# Branches de référence — Le Jacquier

Harmonisation du 20 septembre 2026 pour préparer une présentation au restaurant.

- `main` : base commune de développement et de préparation de la démonstration.
- `harmonisation/demo-base-2026-09-20` : intégration des historiques, soumise aux contrôles qualité avant fusion dans `main`.
- `integration/backend-supabase` : branche déclenchant le déploiement Cloudflare en production. Conservée sans modification pendant cette harmonisation.
- `fix/cloudflare-production-deploy` : fonctionnalités carte, création des plats et médiathèque intégrées à la base commune.
- `feat/media-library` et `fix/cloudflare-reservation-rate-limit` : historiques déjà intégrés à `main`, conservés pour traçabilité.

## Résolution des divergences

Conserver la carte à catégories dynamiques, la médiathèque Uppy et ses tags, les méthodes d'administration du menu et les origines de prévisualisation Cloudflare. Préserver les messages d'erreur de réservation et le limiteur Cloudflare corrigés sur `main`.

Les branches anciennes ne sont ni supprimées ni réécrites. Commencer les prochains travaux depuis `main`, dans une branche dédiée, puis ouvrir une pull request vers `main`.

## Présentation puis production

Cette harmonisation ne constitue pas une validation fonctionnelle de livraison. Préparer la démonstration en environnement de test, avec données fictives et notifications désactivées. La migration des tags médias est conservée dans le dépôt mais n'est pas exécutée sur la base de production.

Après acceptation du projet par le restaurant : planifier les corrections de production, la recette complète et les migrations. Toute intégration vers `integration/backend-supabase` déclenche un déploiement et doit faire partie de cette étape explicitement autorisée. Ne pas lancer manuellement le workflow de déploiement pendant la préparation.
