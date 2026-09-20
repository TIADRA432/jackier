# Graph Report - jackier-harmonisation  (2026-09-20)

## Corpus Check
- 109 files · ~122,009 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .xml 1)

## Summary
- 893 nodes · 1716 edges · 58 communities (33 shown, 25 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8a113342`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AdminDataService
- admin-data.service.ts
- CMSComponent
- development
- reservation.controller.ts
- menu.controller.ts
- pages/traiteur/traiteur.component.ts
- routes/index.ts
- RestaurantService
- Découverte majeure non traitée — nouvel épique requis
- dependencies
- catering.controller.ts
- package.json
- settings.component.ts
- Passation — audit Jackier
- @angular/common
- @angular/core
- site-settings.service.ts
- Réservations — erreur 500 Cloudflare du 15 septembre 2026
- Audit et améliorations de la carte
- compilerOptions
- 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE
- ReservationsComponent
- Naviguer le projet avec Graphify
- AdminEquipeComponent
- StockComponent
- Branches de référence — Le Jacquier
- AdminRestaurantComponent
- AdminWinesComponent
- SchoolComponent
- security.middleware.ts
- AdminAuthService
- Architecture UML - Web App Restaurant Le Jacquier
- compilerOptions
- AdminCategoriesComponent
- AdminFinanceComponent
- Médiathèque et identité visuelle
- AnalyticsComponent
- HeaderComponent
- DashboardComponent
- AdminLoginComponent
- MenuComponent
- DishDetailComponent
- Identité visuelle — Le Jacquier
- AdminSchoolComponent
- GalleryComponent
- ReservationComponent
- Run and deploy your AI Studio app
- AGENTS.md
- environment.development.ts
- environment.prod.ts
- ref_angular_common_http
- ref_node_assert_strict
- ref_node_fs_promises
- ref_rxjs_operators
- ref_uppy_core_css_style_min_css
- ref_uppy_dashboard_css_style_min_css
- ref_uppy_locales_lib_fr_fr

## God Nodes (most connected - your core abstractions)
1. `AdminDataService` - 58 edges
2. `@angular/core` - 48 edges
3. `RestaurantService` - 39 edges
4. `@angular/common` - 35 edges
5. `CatalogValidationError` - 33 edges
6. `catalogError()` - 33 edges
7. `express` - 24 edges
8. `validateUuid()` - 23 edges
9. `optionalText()` - 22 edges
10. `requireKnownFields()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Contrat Catalogue — catégories et vins (2026-09-08)` --references--> `AdminDataService`  [INFERRED]
  docs/PASSATION_AUDIT_JACKIER.md → src/app/core/services/admin-data.service.ts
- `Architecture constatée` --references--> `RestaurantService`  [INFERRED]
  docs/AUDIT-CARTE.md → src/app/core/services/restaurant.service.ts
- `Tableau constat confirmé / infirmé / corrigé` --references--> `RestaurantService`  [INFERRED]
  docs/PASSATION_AUDIT_JACKIER.md → src/app/core/services/restaurant.service.ts
- `AdminSettingsComponent` --references--> `PublicSettings`  [EXTRACTED]
  src/app/pages/admin/settings/settings.component.ts → src/app/core/services/admin-data.service.ts
- `createCategory()` --calls--> `addDoc()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts

## Import Cycles
- None detected.

## Communities (58 total, 25 thin omitted)

### Community 1 - "admin-data.service.ts"
Cohesion: 0.08
Nodes (23): @angular/forms, AdminReservation, CateringEvent, DashboardOverview, FinanceExpense, FinanceReport, GalleryMedia, MENU_ITEM_CATEGORIES (+15 more)

### Community 2 - "CMSComponent"
Cohesion: 0.09
Nodes (6): MediaAsset, MediaCategory, CMSComponent, Component, AdminSettingsComponent, Component

### Community 3 - "development"
Cohesion: 0.06
Nodes (37): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+29 more)

### Community 4 - "reservation.controller.ts"
Cohesion: 0.09
Nodes (29): ref_node_assert, ref_node_fs, ref_node_path, ref_node_test, CategoryFilter, categoryFilters(), categoryKey(), filterDishes() (+21 more)

### Community 5 - "menu.controller.ts"
Cohesion: 0.12
Nodes (38): getCategories(), createMenuItem(), deleteMenuItem(), getMenuItems(), getParam(), getPublicMenuItems(), isRecord(), MENU_FIELDS (+30 more)

### Community 6 - "pages/traiteur/traiteur.component.ts"
Cohesion: 0.08
Nodes (17): @angular/platform-browser, TraiteurComponent, Component, CateringCtaComponent, Component, CateringFormComponent, Component, CateringGalleryComponent (+9 more)

### Community 7 - "routes/index.ts"
Cohesion: 0.05
Nodes (110): express, supabase, catalogError(), CatalogValidationError, isRecord(), optionalImageUrl(), optionalOrder(), optionalPrice() (+102 more)

### Community 9 - "Découverte majeure non traitée — nouvel épique requis"
Cohesion: 0.22
Nodes (9): Contrat Analytics — indicateurs opérationnels (2026-09-08), Contrat Catalogue — catégories et vins (2026-09-08), Contrat CMS — galerie des médias (2026-09-08), Contrat Menu — disponibilité formalisée (2026-09-08), Contrat Paramètres — données publiques (2026-09-08), Contrat Stock — inventaire réel (2026-09-08), Contrat Équipe — annuaire interne minimal (2026-09-08), Découverte majeure non traitée — nouvel épique requis (+1 more)

### Community 10 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 11 - "catering.controller.ts"
Cohesion: 0.35
Nodes (11): ALLOWED_STATUSES, createCateringEvent(), deleteCateringEvent(), format(), getCateringEvents(), getParam(), updateCateringEvent(), validateCateringPayload() (+3 more)

### Community 12 - "package.json"
Cohesion: 0.04
Nodes (47): devDependencies, @cloudflare/workers-types, concurrently, tsx, @types/cors, @types/express, @types/multer, @types/node (+39 more)

### Community 13 - "settings.component.ts"
Cohesion: 0.20
Nodes (6): BrandSettings, MediaReference, PublicSettings, SiteMediaSlot, EMPTY_SETTINGS, SITE_MEDIA_SLOTS

### Community 14 - "Passation — audit Jackier"
Cohesion: 0.22
Nodes (8): Découvertes hors périmètre initial de l'audit — bugs métier critiques, Navigation Graphify pour les agents, Passation — audit Jackier, Plan d'exécution — état d'avancement, Pré-vol : dépôt et lockfile — CONFIRMÉ, Rapport — validations exécutées cette session, Risques résiduels et décisions requises de l'utilisateur, Tableau constat confirmé / infirmé / corrigé

### Community 15 - "@angular/common"
Cohesion: 0.14
Nodes (18): @angular/common, CateringService, Dish, GalleryImage, Review, SchoolProgram, TeamMember, Wine (+10 more)

### Community 16 - "@angular/core"
Cohesion: 0.17
Nodes (12): @angular/core, @angular/router, rxjs, routes, AppComponent, Component, adminAuthGuard(), authInterceptor() (+4 more)

### Community 17 - "site-settings.service.ts"
Cohesion: 0.11
Nodes (15): @supabase/supabase-js, Reservation, ReservationResult, ReservationService, Injectable, FALLBACK_LOGO, SiteSettingsService, Injectable (+7 more)

### Community 18 - "Réservations — erreur 500 Cloudflare du 15 septembre 2026"
Cohesion: 0.25
Nodes (7): Cause et correction, Déploiement et retour arrière, Fichiers, Graphify, Réservations — erreur 500 Cloudflare du 15 septembre 2026, Résultat confirmé en production, Vérification

### Community 19 - "Audit et améliorations de la carte"
Cohesion: 0.29
Nodes (6): Architecture constatée, Audit et améliorations de la carte, Comparaison avec la proposition Menu / Carte, Fichiers applicatifs modifiés ou ajoutés, Limites et suites métier, Vérifications

### Community 20 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 21 - "2️⃣ STRUCTURE MODULAIRE OPTIMISÉE"
Cohesion: 0.12
Nodes (16): 1. Menu & Plats, 1️⃣ NOUVELLE ARCHITECTURE FONCTIONNELLE (4 COUCHES), 2. Réservations (Workflow PRO), 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE, 3. Traiteur, 3️⃣ UX/UI PREMIUM & PERFORMANCE, 4️⃣ SÉCURITÉ RENFORCÉE, 5️⃣ INTELLIGENCE BUSINESS (BI) (+8 more)

### Community 22 - "ReservationsComponent"
Cohesion: 0.17
Nodes (6): Contrat Finance — dépenses et clôtures (2026-09-08), ReservationStatus, ReservationsComponent, Component, AdminTraiteurComponent, Component

### Community 23 - "Naviguer le projet avec Graphify"
Cohesion: 0.29
Nodes (5): Artefacts versionnés, Intégrité de la version initiale, Mise à jour automatique GitHub Actions, Naviguer le projet avec Graphify, Pour les agents

### Community 24 - "AdminEquipeComponent"
Cohesion: 0.21
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 25 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

### Community 26 - "Branches de référence — Le Jacquier"
Cohesion: 0.50
Nodes (3): Branches de référence — Le Jacquier, Présentation puis production, Résolution des divergences

### Community 27 - "AdminRestaurantComponent"
Cohesion: 0.30
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 30 - "security.middleware.ts"
Cohesion: 0.07
Nodes (28): ref_cloudflare_node, @cloudflare/workers-types, cors, express-rate-limit, helmet, ref_node_events, ref_node_net, ref_path (+20 more)

### Community 31 - "AdminAuthService"
Cohesion: 0.24
Nodes (4): AdminAuthService, Injectable, AdminComponent, Component

### Community 32 - "Architecture UML - Web App Restaurant Le Jacquier"
Cohesion: 0.20
Nodes (9): 1. Diagramme de Cas d'Utilisation (Use Case), 2. Diagramme de Classes (Domain Model), 3. Diagramme de Composants (Architecture Angular), 4. Diagramme de Séquence (Demande de Devis Traiteur), 5. Diagramme d'Activité (Processus Traiteur), 6. Diagramme de Déploiement, 7. Diagramme d'États (Réservation), Architecture UML - Web App Restaurant Le Jacquier (+1 more)

### Community 34 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 41 - "Médiathèque et identité visuelle"
Cohesion: 0.29
Nodes (6): Identité de référence dans Git, Mise en production, Médiathèque et identité visuelle, Rôle de chaque emplacement, Sécurité et règles importantes, Utilisation par l’administration

### Community 43 - "HeaderComponent"
Cohesion: 0.33
Nodes (3): HostListener, HeaderComponent, Component

### Community 49 - "Identité visuelle — Le Jacquier"
Cohesion: 0.50
Nodes (3): Fichiers, Identité visuelle — Le Jacquier, Palette existante

## Knowledge Gaps
- **243 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `root` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 418 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `menu.controller.ts`, `catering.controller.ts`, `package.json`, `security.middleware.ts`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `admin-data.service.ts`, `pages/traiteur/traiteur.component.ts`, `package.json`, `settings.component.ts`, `@angular/common`, `site-settings.service.ts`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `admin-data.service.ts`, `package.json`, `settings.component.ts`, `@angular/core`, `site-settings.service.ts`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `RestaurantService` (e.g. with `Architecture constatée` and `Tableau constat confirmé / infirmé / corrigé`) actually correct?**
  _`RestaurantService` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `admin-data.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._