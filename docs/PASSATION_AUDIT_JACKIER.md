# Passation — audit Jackier

**Dépôt :** `TIADRA432/jackier`
**Branche cible :** `integration/backend-supabase`
**HEAD au moment de cette mise à jour :** consulter `git log -1` (ce document est
mis à jour dans le même commit que l'authentification admin).
**Statut :** Phases 1, 2 et 3 exécutées et poussées. Le contrôle GitHub Actions de
l'authentification admin est passé (tests, lint et build).
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
retirant plutôt qu'en le régénérant à la main.

## Tableau constat confirmé / infirmé / corrigé

| Domaine | Constat initial | Statut réel |
| --- | --- | --- |
| Sécurité des templates | aucun `innerHTML`/`bypassSecurityTrust` | **Confirmé**, toujours vrai |
| Images publiques | `NgOptimizedImage` largement employé | **Confirmé** ; 4 images admin sans `alt` → **Corrigé** (equipe, school, cms, analytics) |
| Validation API | `/reservations`, `/catering` valident formats/longueurs/statuts/UUID | **Confirmé**, déjà robuste avant cette session |
| Uploads | Multer 5 Mo, JPEG/PNG/WebP | **Confirmé** |
| CORS | `cors()` sans liste blanche | **Corrigé** — whitelist via `CORS_ORIGINS` (var d'env, `security.middleware.ts`) |
| Protection HTTP | pas de Helmet/CSP | **Corrigé** — `helmet@^8.3.0` avec CSP, appliqué dans `worker.ts`/`server.ts` |
| Anti-abus | pas de rate limit | **Corrigé** — `express-rate-limit@^8.7.0`, 5 req/15 min sur `/reservations` et `/catering` |
| SEO | hash routing, pas de robots/sitemap/canonical/OG | **Corrigé** — `withHashLocation()` retiré, `public/robots.txt`, `public/sitemap.xml`, OG/Twitter/canonical dans `index.html` |
| Accessibilité | alt/aria-label manquants | **Corrigé** en zone admin + header mobile (bouton fermeture, `aria-expanded`) |
| UX — chargement | pas de chargement visible | **Corrigé** — signaux `loading`/`error` centralisés dans `RestaurantService`, appliqués à Menu, Galerie, École, Accueil |
| Qualité | pas de specs ni CI | **Corrigé** — tests ciblés Node/TS pour validations publiques et middleware sécurité ; workflow GitHub Actions test + type-check + build |
| Accès admin | route `/admin` publique, aucun jeton envoyé | **Corrigé** — connexion Supabase, vérification `profiles.role === 'ADMIN'` via RLS, garde Angular, intercepteur Bearer et déconnexion |
| tsconfig serveur | non audité initialement | **Corrigé** — `esModuleInterop` manquant + `module` incompatible avec `import.meta`, causait des erreurs `tsc --noEmit` |

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

## Découverte majeure non traitée — nouvel épique requis

**Le panneau admin entier (dashboard, réservations, stock, cms, analytics, traiteur,
école, finance, équipe, settings, restaurant) reste majoritairement une maquette
statique**, non connectée aux endpoints backend existants (`GET /api/dashboard/overview`,
`GET /api/reservations`, etc.). L'authentification est désormais en place :
`/admin/login` passe par Supabase Auth, le garde Angular appelle `auth.getUser()` puis
lit uniquement le profil courant grâce à RLS, et le rôle doit être exactement `ADMIN`.
Les appels `/api/*` reçoivent le Bearer token ; les routes Express conservent leur propre
vérification du token et du rôle. Le garde échoue fermé : erreur Auth, RLS ou profil
absent redirige vers la connexion.

Le premier câblage métier est terminé pour **Réservations** :
`admin-data.service.ts` lit `GET /api/reservations` et envoie les changements de
statut vers `PUT /api/reservations/:id/status`. L'écran affiche des états de
chargement/erreur, les notes client et ne modifie la liste locale qu'après réponse
API. La CI a validé ce flux avec le commit `bc6b7dc`.

Épique restant : câblage progressif des autres sous-pages admin sur les endpoints réels
(commencer par dashboard, puis traiteur/école/restaurant).

### Contrat Menu — disponibilité formalisée (2026-09-08)

La disponibilité est désormais le booléen `menu_items.active`, et non un champ
`isAvailable` parallèle. La migration `20260908030000_formalize_menu_active_status.sql`
backfill les anciens plats à `true`, puis rend la colonne obligatoire avec défaut `true`.
`GET /api/menu` est strictement public et écarte uniquement `active = false` ;
`GET /api/admin/menu` est réservé à `ADMIN` et conserve les plats indisponibles pour
l’administration. `PUT /api/menu/:id` reste protégé et valide/whitelist les champs avant
toute écriture. Le tableau Restaurant admin utilise ce contrat pour basculer l’état sans
mise à jour optimiste. La migration a été appliquée au projet Supabase actif le 8 septembre
2026 et l'historique distant confirme sa version `20260908095906`. Vérifier que les
politiques RLS du projet autorisent le rôle de service backend, sans exposer de clé de
service dans le front.

### Contrat Catalogue — catégories et vins (2026-09-08)

Les écritures `POST`/`PUT`/`DELETE` de catégories et de vins sont protégées par le
RBAC `ADMIN` et utilisent désormais la validation commune `catalog.validation.ts` :
whitelist stricte des champs, bornes de longueur/prix/ordre, URL d’image HTTP(S) et UUID
des ressources. Les erreurs de contrat répondent en `400`; les erreurs de persistance
restent en `500`. Les écrans protégés `/admin/categories` et `/admin/vins` sont
connectés : liste, création, modification et suppression confirmée, avec états de
chargement/erreur. Ils utilisent exclusivement `AdminDataService` — aucun catalogue
fictif ne doit y être réintroduit.

### Contrat Finance — dépenses et clôtures (2026-09-08)

Les routes Finance sont strictement réservées à `ADMIN`. `POST /api/finance/expenses`
accepte uniquement `label`, `category` (facultatif) et `amount` : les champs inconnus,
les libellés invalides et les montants nuls, négatifs ou hors borne sont rejetés en
`400`. `POST /api/finance/close` n'accepte que `manualRevenue`, contrôlé comme un
montant fini et borné. L'écran `/admin/finance` utilise exclusivement les listes
protégées des dépenses et des rapports : les indicateurs mensuels sont calculés à partir
des clôtures enregistrées. Il permet aussi l'ajout d'une dépense et une clôture explicite
du jour, sans données financières fictives ni mise à jour optimiste.

### Contrat Paramètres — données publiques (2026-09-08)

`GET /api/settings` n'expose que les informations publiques de l'établissement.
`PUT /api/settings` reste réservé au rôle `ADMIN` et accepte désormais une whitelist
stricte : identité, coordonnées, horaires, devise et liens sociaux. Les champs inconnus,
les valeurs textuelles invalides et l'adresse e-mail incorrecte sont rejetés en `400`;
la mise à jour fusionne les seules valeurs contrôlées avec l'enregistrement existant.
L'écran `/admin/settings` charge et sauvegarde ces données réelles avec des états de
chargement, succès et erreur. Les paramètres sans modèle API (sécurité, facturation,
intégrations et commandes destructrices) ne sont plus présentés comme fonctionnels.

### Contrat CMS — galerie des médias (2026-09-08)

L'écran `/admin/cms` est désormais une gestion de la galerie réellement persistée, et
non une maquette d'articles ou de promotions. Il liste les médias, ajoute une image via
une URL HTTP(S) validée et impose une confirmation avant suppression. Côté API, les
écritures de galerie restent réservées à `ADMIN`; le payload est limité à `imageUrl`,
`title` et `category`, avec bornes de longueur, et la suppression exige un UUID valide.
Les erreurs de contrat répondent en `400`; les erreurs de stockage ou de base restent
en `500`. L'upload de fichier JPEG/PNG/WebP existant conserve son contrôle de signature
MIME avant stockage Supabase.

### Contrat Analytics — indicateurs opérationnels (2026-09-08)

L'écran `/admin/analytics` réutilise `GET /api/dashboard/overview`, réservé à `ADMIN`.
Il affiche uniquement le CA issu des clôtures, les réservations, les événements traiteur,
la courbe des rapports disponibles et le journal d'activité. Les prévisions, la
performance nominative du personnel et l'export PDF ont été retirés : le backend ne
produit pas encore ces données ni ce document. Aucun chiffre décoratif ne doit être
réintroduit tant qu'un contrat API et ses contrôles ne sont pas définis.

## Plan d'exécution — état d'avancement

- **Phase 0** (base vérifiable) : implicitement couverte — build/lint vérifiés à
  chaque commit de cette session, aucun changement fonctionnel accidentel constaté.
- **Phase 1** (sécurité) : **Terminée.** CORS, Helmet/CSP, rate limiting et tests
  ciblés du middleware de sécurité.
- **Phase 2** (SEO/a11y/UX) : **Terminée** pour le front public. Zone admin : a11y
  statique corrigée, mais données réelles non câblées (cf. épique ci-dessus).
- **Phase 3** (tests, CI) : **Terminée.** `npm test` exécute les contrôles de
  validation métier et de sécurité ; `npm run lint` lance le type-check serveur ;
  `.github/workflows/quality.yml` exécute test, type-check et build sous Node 22.
  La CI GitHub Actions est la preuve exécutable : elle a passé `npm test`, `npm run
  lint` et `npm run build` sur le commit d'authentification admin.

## Navigation Graphify pour les agents

Le projet intègre maintenant `AGENTS.md` et le graphe versionné dans `graphify-out/`.
Voir [`GRAPHIFY.md`](./GRAPHIFY.md) pour les requêtes, le périmètre et le diagnostic
d'intégrité. Le graphe est mis à jour par `graphify update .` après chaque changement
de code ; les sources Markdown/images ne sont pas indexées sémantiquement dans le
mode sans fournisseur LLM.

## Rapport — validations exécutées cette session

- `npm install` (sans lockfile) : succès, 499 paquets
- `npx ng build --configuration=development` : succès, 0 erreur, après chaque lot de
  changements significatif (vérifié à 5 reprises au fil de la session)
- `npx tsc --project tsconfig.server.json --noEmit` : échec initial (`esModuleInterop`,
  `import.meta`) → corrigé → succès (exit 0)
- GitHub Actions, commit `5e768fa` : `npm test`, `npm run lint` et `npm run build` →
  succès. Contrôle : https://github.com/TIADRA432/jackier/actions/runs/34174654605

## Risques résiduels et décisions requises de l'utilisateur

1. **Priorité** : câbler progressivement les données réelles de l'admin (commencer par
   dashboard). L'accès est protégé et Réservations est connecté, mais les autres écrans
   restent majoritairement factices.
2. **Tailwind CDN en production** (`<script src="https://cdn.tailwindcss.com">` dans
   `index.html`) : repéré comme risque de performance (JIT recompilé à chaque
   chargement), non corrigé — nécessite de vérifier qu'un pipeline de build CSS
   compilé peut le remplacer sans casser le style existant. Décision requise avant
   d'y toucher.
3. **Favicon** : référencé dans `index.html` mais absent du dossier `public/` → 404
   silencieux, non corrigé (mineur).
4. Aucun secret n'a été ajouté au dépôt au cours de cette session.
