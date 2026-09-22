# Branches de référence — Le Jacquier

Depuis le 22 septembre 2026, le dépôt suit un modèle volontairement simple à deux branches permanentes.

- `main` : version stable, validée et déployable en production. Tout push sur `main` déclenche les contrôles puis le déploiement Cloudflare.
- `develop` : branche de travail unique pour les corrections, améliorations et nouvelles fonctionnalités.

## Flux de travail

1. Faire les modifications sur `develop`.
2. Laisser GitHub Actions exécuter les tests, le type-check et le build.
3. Vérifier fonctionnellement la version candidate.
4. Ouvrir une pull request `develop -> main`.
5. Fusionner uniquement quand la version est prête à devenir la nouvelle production.
6. Le push résultant sur `main` déclenche automatiquement le déploiement Cloudflare.

## Règles

- Ne pas développer directement sur `main`, sauf correction d'urgence explicitement assumée.
- Ne pas créer de branches `feat/*`, `fix/*` ou `harmonisation/*` permanentes pour ce projet simple.
- Les anciennes branches historiques sont considérées comme obsolètes dès lors que leur contenu est déjà intégré à `main`.
- Les previews Cloudflare versionnées de la production restent désactivées ; les tests de changement se font depuis `develop` et les contrôles CI.
- `main` reste la branche par défaut et la seule source autorisée pour la production.

## Objectif

Avoir un historique lisible : `develop` contient la prochaine version, `main` contient la version livrable actuellement en production.
