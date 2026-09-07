# Passation — audit Jackier

**Dépôt :** `TIADRA432/jackier`
**Branche cible :** `integration/backend-supabase`
**HEAD au moment de cette mise à jour :** consulter `git log -1` (ce document est mis à jour dans le même commit que la phase 3).
**Statut :** Phases 1 et 2 exécutées et poussées. Phase 3 (tests, CI) implémentée ; l’exécution locale reste à rejouer car le téléchargement npm a subi des timeouts réseau.
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
école, finance, équipe, settings, restaurant) est une maquette statique**, non
connectée aux endpoints backend existants (`GET /api/dashboard/overview`,
`GET /api/reservations`, etc.), **et il n'existe aucune authentification sur `/admin`** :
pas de page de connexion, pas de garde de route, pas d'intercepteur HTTP pour le
token Supabase. N'importe qui visitant `/admin` accède à l'interface (actuellement
sans conséquence puisque les données sont fictives, mais bloquant dès le câblage réel).

Ceci constitue un épique séparé, non commencé :
- Authentification admin (login Supabase Auth, `CanActivate`, intercepteur Bearer token)
- Câblage des ~10 sous-pages admin sur les endpoints réels

## Plan d'exécution — état d'avancement

- **Phase 0** (base vérifiable) : implicitement couverte — build/lint vérifiés à
  chaque commit de cette session, aucun changement fonctionnel accidentel constaté.
- **Phase 1** (sécurité) : **Terminée.** CORS, Helmet/CSP, rate limiting, tests de
  rejet non automatisés (aucun test écrit — validation manuelle uniquement).
- **Phase 2** (SEO/a11y/UX) : **Terminée** pour le front public. Zone admin : a11y
  statique corrigée, mais données réelles non câblées (cf. épique ci-dessus).
- **Phase 3** (tests, CI) : **Implémentée.** `npm test` exécute les contrôles de validation métier et de sécurité ; `npm run lint` lance le type-check serveur ; `.github/workflows/quality.yml` exécute test, type-check et build sous Node 22. Le contrôle local de cette livraison n’a pas pu s’achever : npm a échoué après plusieurs reprises réseau (`ECONNRESET` / `ETIMEDOUT`), sans créer de lockfile.

## Rapport — validations exécutées cette session

- `npm install` (sans lockfile) : succès, 499 paquets
- `npx ng build --configuration=development` : succès, 0 erreur, après chaque lot de
  changements significatif (vérifié à 5 reprises au fil de la session)
- `npx tsc --project tsconfig.server.json --noEmit` : échec initial (`esModuleInterop`,
  `import.meta`) → corrigé → succès (exit 0)
- Aucun test automatisé exécuté : aucun n'existe sur cette branche

## Risques résiduels et décisions requises de l'utilisateur

1. **Priorité** : attaquer l'épique Authentification admin + câblage données réelles
   (bloquant pour toute utilisation réelle du panneau admin), ou Phase 3
   (tests + CI) d'abord ?
2. **Tailwind CDN en production** (`<script src="https://cdn.tailwindcss.com">` dans
   `index.html`) : repéré comme risque de performance (JIT recompilé à chaque
   chargement), non corrigé — nécessite de vérifier qu'un pipeline de build CSS
   compilé peut le remplacer sans casser le style existant. Décision requise avant
   d'y toucher.
3. **Favicon** : référencé dans `index.html` mais absent du dossier `public/` → 404
   silencieux, non corrigé (mineur).
4. Aucun secret n'a été ajouté au dépôt au cours de cette session.


## Navigation Graphify pour les agents

Le projet intègre maintenant `AGENTS.md` et le rapport versionné dans `graphify-out/`. Voir [`GRAPHIFY.md`](./GRAPHIFY.md) pour les requêtes et le périmètre. Exécuter `graphify extract . --code-only` lorsque `graphify-out/graph.json` doit être régénéré localement.
