# Audit et améliorations de la carte

Audit du 16 septembre 2026, branche `fix/cloudflare-production-deploy`, base `9c8992e`.

## Architecture constatée

- Angular 21 (et non Angular 19), composants standalone, Signals, OnPush, routes chargées à la demande. L'organisation `pages/`, `core/`, `shared/` est conservée.
- Aucun accès Firestore ni dépendance Firebase dans le code applicatif inspecté. Les pages publiques utilisent `RestaurantService` et l'API Express `/api`. `db.service.ts` traduit les noms camelCase vers les tables Supabase, dont `menu_items` et `menu_categories`.
- Le catalogue public exclut `active === false`, conserve les anciens plats sans ce champ et trie par `displayOrder`. Le catalogue admin inclut les plats masqués. Cette politique est conservée.
- L'admin dispose de pages restaurant, catégories, vins et médiathèque. Les écritures sont protégées côté API par validation du token Supabase puis rôle ADMIN issu du profil. Les guards Angular protègent aussi la navigation.
- L'admin restaurant gérait la disponibilité seulement. `isFeatured` était déjà accepté par l'API et mappé vers `is_featured`, mais ignoré par la page publique.
- Design existant : Tailwind chargé depuis son CDN dans `index.html`, palette Jacquier vert/crème/or/bordeaux, Playfair Display et Inter. Les mêmes styles sont réutilisés. Le jeton `jacquier-text`, déjà utilisé, n'est pas défini dans la configuration actuelle : dette existante à harmoniser globalement.
- Cloudflare sert les assets Angular depuis `dist`, avec repli SPA, et délègue les API à `httpServerHandler(...).fetch(...)`. La correction du commit `74bee11` est préservée. Les en-têtes de sécurité et le routage serveur restent inchangés.
- Le workflow de déploiement automatique cible `integration/backend-supabase`, pas la branche auditée ; un lancement manuel existe. Cette politique n'a pas été modifiée.

## Comparaison avec la proposition Menu / Carte

| Élément | Avant | Maintenant |
| --- | --- | --- |
| Hero compact et réservation | Hero 50vh sans CTA | Hero réduit, lien vers la réservation existante |
| Catégories persistantes | Liste fixe, sans lien avec l'admin | Navigation sticky et défilante, noms/ordre des catégories API, repli pour les anciennes catégories |
| Recherche et filtres | Recherche sensible aux accents, filtres végétarien/épicé/local, budget fixe | Recherche normalisée, mêmes filtres conservés, filtre suggestions, budget repliable calculé sur les prix réels, bornes ordonnées |
| Suggestions de la Cheffe | Champ API non affiché | Badge, sélection de trois suggestions correspondant aux filtres, filtre pour toutes les suggestions, commande admin |
| Carte du plat | Photo, description, prix et bouton Ajouter inactif | Bouton Voir le plat fonctionnel, badge épicé, repli sans photo, prix GNF, mise en page moins serrée |
| Fiche détaillée | Absente | Dialogue natif avec description complète disponible, prix, badges et réservation ; panneau en bas sur mobile |
| États de la page | Chargement, erreur et aucun résultat | États conservés, distinction carte vide/recherche vide, compteur de résultats et remise à zéro |
| Routing | `/menu` | Route conservée ; `/carte` redirige vers `/menu` |
| CTA final | Absent | Réservation |

Le dialogue natif fournit la modalité, la navigation clavier contenue, Échap et le retour du focus au déclencheur. Un bouton Fermer est présent. La vérification visuelle et clavier dans un navigateur reste à effectuer.

## Fichiers applicatifs modifiés ou ajoutés

| Fichier | Changement |
| --- | --- |
| `src/app/core/models/index.ts` | Catégorie extensible, `categoryId`, `isFeatured` |
| `src/app/core/models/menu-catalog.ts` (nouveau) | Résolution des catégories, recherche et filtrage purs, testables sans Angular |
| `src/app/core/services/restaurant.service.ts` | Lecture des catégories, conservation de `categoryId` et `isFeatured`, repli si les catégories échouent |
| `src/app/core/services/admin-data.service.ts` | Typage et mise à jour de `isFeatured` via l'endpoint existant |
| `src/app/pages/menu/menu.component.ts` | Hero, catégories sticky, recherche, budget, suggestions, états et réservation |
| `src/app/shared/components/dish-card/dish-card.component.ts` | Ouverture du détail, badges, photo optionnelle, prix et disposition |
| `src/app/shared/components/dish-card/dish-detail.component.ts` (nouveau) | Dialogue accessible et panneau mobile |
| `src/app/pages/admin/restaurant/restaurant.component.ts` | Gestion des suggestions, verrouillage des commandes pendant une sauvegarde, message de disponibilité corrigé |
| `src/app/app.routes.ts` | Alias `/carte` |
| `tests/menu-catalog.test.ts` (nouveau) | Quatre tests de comportement : catégories administrées/anciennes, recherche et filtres combinés, prix limites, catalogue/suggestions vides |

Les sorties et caches `graphify-out/` ont également été régénérés conformément à `AGENTS.md` (826 nœuds, 1474 relations). L'extraction SQL n'est pas disponible dans l'installation Graphify ; les migrations ont été lues directement.

## Vérifications

- `npm test` : 32 tests réussis, zéro échec, dont quatre nouveaux tests du catalogue et le test de non-régression du handler Cloudflare.
- `npm run lint` : vérification TypeScript serveur réussie. Ce script n'est pas un lint stylistique.
- `npm run build` : compilation Angular de production réussie ; page menu toujours chargée à la demande.
- `npx wrangler deploy --dry-run --keep-vars` : réussi avec Wrangler 4.132.0 ; 44 assets, paquet Worker 2454,75 Kio (532,84 Kio gzip), aucune publication. Ce contrôle ne vérifie pas les secrets ni le fonctionnement en production.
- `git diff --check -- src tests` : aucun défaut d'espacement.
- Aucun changement de `worker.ts`, `wrangler.jsonc`, `angular.json`, du workflow de déploiement, des routes API ou des migrations.
- Installation conforme au workflow existant : `npm install --no-package-lock`. Aucun changement des versions déclarées. L'absence de lockfile demeure une limite de reproductibilité préexistante.

## Limites et suites métier

- Ni nouveautés, ni ingrédients, ni allergènes structurés, ni accompagnements ne sont définis par le contrat actuel du menu. La fiche affiche la description réellement disponible et invite à consulter l'équipe. Ajouter ces données proprement exige un contrat validé, des champs admin, une validation API et une migration ; aucun contenu n'a été inventé.
- Les catégories Grillades/Accompagnements apparaissent si elles existent dans les données ; aucune catégorie vide n'est créée artificiellement.
- Pas de parcours de commande/panier existant identifié : aucun faux bouton Commander ajouté.
- Les vins sont gérés séparément via `/wines` et la page admin dédiée. Leur fusion dans la carte des plats nécessite de traiter séparément les prix verre/bouteille.
- Le CRUD complet des plats n'est pas ajouté à l'admin restaurant ; cette évolution conserve la disponibilité existante et ajoute la sélection éditoriale.
- Le catalogue n'est pas en temps réel : les changements admin sont visibles au prochain chargement des données publiques.
- Aucun test connecté de sauvegarde Supabase, aucune migration appliquée, aucun déploiement, aucun push GitHub. Les changements sont dans le clone local `jackier/`.
