# Rapport Graphify — Jackier

_Généré le 7 septembre 2026 en mode code-only._

## Résumé

- 486 nœuds, 798 relations et 39 communautés.
- Le périmètre couvre 70 fichiers de code, notamment Angular, Express, le Worker
  Cloudflare, les contrôleurs Supabase et les tests.
- Le diagnostic ne trouve aucune extrémité manquante, arête orpheline, boucle ni
  fusion d’arêtes dans le graphe non orienté.

## Hubs architecturaux

1. `RestaurantService` : point de jonction des pages publiques et des données.
2. `express` / `apiHandler` : frontière entre le Worker Cloudflare et l’API.
3. `createReservation()` : écriture publique validée, limitée et envoyée vers Supabase.
4. `publicWriteRateLimiter` et `configureSecurity()` : protections transverses de
   l’API.
5. `routes` et `HeaderComponent` : navigation Angular et accès aux pages publiques.

## Frontières utiles à explorer

- Réservation publique : page Angular → `RestaurantService` → `POST /api/reservations`
  → rate limiter → `createReservation()` → Supabase.
- Traiteur public : formulaire → `POST /api/catering` → validation récursive →
  Supabase.
- Front statique : `worker.ts` sert les assets Cloudflare et leur applique les
  headers de sécurité équivalents à ceux d’Express.
- Administration : le graphe confirme que ses pages sont séparées des contrôleurs ;
  l’authentification et le câblage aux données restent l’épique à traiter.

## Recréer et interroger le graphe

```bash
graphify extract . --code-only
graphify query "Comment une réservation publique atteint-elle Supabase ?"
graphify path "apiHandler" "createReservation()"
graphify explain "RestaurantService"
```

Voir [`docs/GRAPHIFY.md`](../docs/GRAPHIFY.md) pour les consignes destinées aux agents.
