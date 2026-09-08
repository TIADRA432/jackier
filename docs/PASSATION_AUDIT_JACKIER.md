# Passation — audit Jackier

**Dépôt :** `TIADRA432/jackier`
**Branche cible :** `integration/backend-supabase`
**HEAD au moment de cette mise à jour :** `5df32d9` (commit "test: add quality checks and Graphify handoff")
**Statut :** Phases 1, 2 et 3 de l'audit terminées et validées. Sprint 2 (méthode Scrum,
épique Authentification admin) planifié et en cours de démarrage.
Ce document reflète l'état réel vérifié à cette date — les sections précédentes marquées
« à revalider » ont été confirmées, corrigées, ou requalifiées ci-dessous.

## Pré-vol : dépôt et lockfile — CONFIRMÉ

Aucun lockfile suivi sur la branche distante :

    curl -sI https://raw.githubusercontent.com/TIADRA432/jackier/integration/backend-supabase/package-lock.json
    curl -sI https://raw.githubusercontent.com/TIADRA432/jackier/integration/backend-supabase/yarn.lock
    curl -sI https://raw.githubusercontent.com/TIADRA432/jackier/integration/backend-supabase/pnpm-lock.yaml
    → HTTP 404 sur les trois

npm régénère le lockfile à chaque build Cloudflare (`npm install` sans `--ci`). C'est
intentionnel : un lockfile désynchronisé avait précédemment bloqué un déploiement
(conflit `typescript@~5.8.2` vs `@angular/build` exigeant `>=5.9`), résolu en le
retirant plutôt qu'en le régénérant à la main. `.github/workflows/quality.yml` utilise
`npm install --no-package-lock` en conséquence — ne pas remplacer par `npm ci`.

## Tableau constat confirmé / infirmé / corrigé

| Domaine | Constat initial | Statut réel |
| --- | --- | --- |
| Sécurité des templates | aucun `innerHTML`/`bypassSecurityTrust` | **Confirmé**, toujours vrai |
| Images publiques | `NgOptimizedImage` largement employé | **Confirmé** ; images admin/dashboard sans `alt` → **Corrigé** |
| Validation API | `/reservations`, `/catering` valident formats/longueurs/statuts/UUID | **Confirmé**, couvert par `tests/public-api-validation.test.ts` |
| Uploads | Multer 5 Mo, JPEG/PNG/WebP | **Confirmé** |
| CORS | `cors()` sans liste blanche | **Corrigé** — whitelist via `CORS_ORIGINS` (var d'env, `security.middleware.ts`), couvert par `tests/security.middleware.test.ts` |
| Protection HTTP | pas de Helmet/CSP | **Corrigé** — `helmet@^8.3.0` avec CSP, appliqué dans `worker.ts`/`server.ts` |
| Anti-abus | pas de rate limit | **Corrigé** — `express-rate-limit@^8.7.0`, 5 req/15 min sur `/reservations` et `/catering`, testé |
| SEO | hash routing, pas de robots/sitemap/canonical/OG | **Corrigé** — `withHashLocation()` retiré, `public/robots.txt`, `public/sitemap.xml`, OG/Twitter/canonical + `public/og-image.png` dans `index.html` |
| Accessibilité | alt/aria-label manquants | **Corrigé** en zone admin (equipe, school, cms, analytics, dashboard, reservations) + header mobile |
| UX — chargement | pas de chargement visible | **Corrigé** — signaux `loading`/`error` centralisés dans `RestaurantService`, appliqués à Menu, Galerie, École, Accueil |
| Qualité | pas de specs ni CI | **Corrigé et validé** — voir Phase 3 ci-dessous |
| tsconfig serveur | non audité initialement | **Corrigé** — `esModuleInterop` manquant + `module` incompatible avec `import.meta` |

## Découvertes hors périmètre initial de l'audit — bugs métier critiques

L'exécution de la Phase 2 (UX) a révélé des régressions plus graves que de simples
états de chargement manquants, corrigées immédiatement car elles causaient une perte
réelle de données client :

1. **Formulaire de devis traiteur 100 % factice** (`catering-form.component.ts`) :
   utilisait `setTimeout(1500)` sans jamais appeler `POST /api/catering`. Toute demande
   de devis soumise par un client réel était perdue, avec un faux message de succès.
   → Corrigé : appel réel à `RestaurantService.submitCateringRequest()`.
2. **Réservation : faux succès sur échec serveur** (`reservation.component.ts`) :
   la valeur de retour (`boolean`) de `makeReservation()` n'était jamais vérifiée ;
   « Réservation Confirmée ! » s'affichait même si le backend rejetait la requête
   (créneau invalide, erreur réseau). → Corrigé : branchement conditionnel + message
   d'erreur explicite. Bonus : le champ heure libre (`<input type="time">`) permettait
   de choisir des créneaux hors de la liste acceptée côté serveur ; remplacé par un
   `<select>` aligné sur `ALLOWED_TIMES` du contrôleur.
3. **Page Galerie 100 % statique** : jamais connectée à `GET /api/gallery` malgré le
   service déjà prêt. → Corrigé.
4. **Crash de la section « Plat du Jour »** (`home.component.ts`) : `dailyDish` était
   un `signal()` figé à la construction du composant (donc `undefined`, le menu
   n'étant pas encore chargé), passé à un `input.required<Dish>()` dont le template
   appelle `dish().name` sans garde. → Corrigé : passage en `computed()` réactif +
   garde `@if` côté template.

## Plan d'exécution — état d'avancement

- **Phase 0** (base vérifiable) : couverte — build/lint/tests vérifiés à chaque
  commit significatif.
- **Phase 1** (sécurité) : **Terminée et testée.** CORS, Helmet/CSP, rate limiting,
  couverts par `tests/security.middleware.test.ts` (6 tests, tous verts).
- **Phase 2** (SEO/a11y/UX) : **Terminée** pour le front public et la zone admin
  (a11y statique). Données réelles admin non câblées : voir épique Sprint 2 ci-dessous.
- **Phase 3** (tests, CI) : **Terminée et validée localement dans cette session.**
  `npm test` (`tsx --test tests/*.test.ts`) : **6/6 tests passent**
  (validation réservation/catering, CORS, rate limiting, headers de sécurité).
  `npm run lint` (`tsc --project tsconfig.server.json --noEmit`) : **0 erreur.**
  `npx ng build --configuration=development` : **0 erreur.**
  `.github/workflows/quality.yml` : exécute test + lint + build sur push/PR, Node 22,
  installation sans lockfile (`npm install --no-package-lock`, volontairement pas
  `npm ci`). Le doute réseau signalé dans une version précédente de ce document est
  levé : les trois commandes ont été rejouées avec succès dans cette session.

## Sprint 2 (méthode Scrum) — Authentification admin + données réelles

**Décision actée par l'utilisateur : Option A**, priorisée avant tout travail
supplémentaire de tests/CI (Phase 3 étant déjà achevée entre-temps par ailleurs).

**Sprint Goal :** *Un administrateur peut se connecter avec ses identifiants
Supabase, et voit les vraies données du restaurant (réservations, aperçu du
dashboard) au lieu de données fictives. Personne ne peut accéder à `/admin` sans
être connecté.*

**Definition of Done du sprint :** code poussé sur `integration/backend-supabase`,
build local vérifié (`ng build` sans erreur), pas de régression sur les
fonctionnalités existantes, déployé et vérifié visuellement avant clôture.

**Sprint Backlog :**

| # | Story | Statut |
| --- | --- | --- |
| 2.1 | Page de connexion admin (email/mdp via Supabase Auth) | À faire |
| 2.2 | Garde de route (`CanActivate`) sur `/admin/**` | À faire |
| 2.3 | Intercepteur HTTP (token Bearer sur les appels `/api/*` admin) | À faire |
| 2.4 | Bouton déconnexion + gestion session expirée | À faire |
| 2.5 | Câblage Dashboard admin sur `GET /api/dashboard/overview` | À faire |
| 2.6 | Câblage Réservations admin sur `GET/PUT/DELETE /api/reservations` | À faire |

Contexte technique confirmé pour ce sprint : le middleware backend `verifyToken` /
`requireRole(['ADMIN'])` existe déjà (`src/middleware/auth.middleware.ts`), tout
comme le client Supabase Auth côté frontend (`src/config/supabase.client.ts`,
`environment.supabase`). Il ne manque que la couche Angular (login, garde, intercepteur)
et le câblage des pages admin elles-mêmes.

## Risques résiduels et décisions requises de l'utilisateur

1. ~~Priorité Sprint 2~~ — **Tranché : Option A (authentification admin).**
2. **Tailwind CDN en production** (`<script src="https://cdn.tailwindcss.com">` dans
   `index.html`) : toujours en place, risque de performance (JIT recompilé à chaque
   chargement) non traité — nécessite de vérifier qu'un pipeline de build CSS
   compilé peut le remplacer sans casser le style existant. Décision requise avant
   d'y toucher.
3. **Favicon** : référencé dans `index.html`, présence dans `public/` à reconfirmer
   après les derniers ajouts (`og-image.png` y a été ajouté entre-temps).
4. Aucun secret n'a été ajouté au dépôt au cours des sessions successives.

## Navigation Graphify pour les agents

Le projet intègre `AGENTS.md` et le rapport versionné dans `graphify-out/`. Voir
[`GRAPHIFY.md`](./GRAPHIFY.md) pour les requêtes et le périmètre. Exécuter
`graphify extract . --code-only` lorsque `graphify-out/graph.json` doit être
régénéré localement.
