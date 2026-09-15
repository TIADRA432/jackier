# Graph Report - jackier-deploy  (2026-09-10)

## Corpus Check
- 102 files · ~116,371 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 802 nodes · 1426 edges · 43 communities (31 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0dc59da9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes/index.ts
- development
- admin-data.service.ts
- menu.controller.ts
- AdminDataService
- RestaurantService
- restaurant.service.ts
- pages/traiteur/traiteur.component.ts
- app.routes.ts
- app.component.ts
- dependencies
- compilerOptions
- 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE
- Découverte majeure non traitée — nouvel épique requis
- StockComponent
- reservation.controller.ts
- reservations.component.ts
- security.middleware.ts
- AdminEquipeComponent
- AdminWinesComponent
- Médiathèque et identité visuelle
- devDependencies
- Identité visuelle — Le Jacquier
- site-settings.service.ts
- AdminAuthService
- AdminCategoriesComponent
- Architecture UML - Web App Restaurant Le Jacquier
- media-library.test.ts
- CMSComponent
- AdminFinanceComponent
- AnalyticsComponent
- DashboardComponent
- AdminSettingsComponent
- AdminSchoolComponent
- gallery.component.ts
- menu.component.ts
- Run and deploy your AI Studio app
- SiteSettingsService
- admin-access.test.ts
- AGENTS.md
- environment.development.ts
- environment.prod.ts

## God Nodes (most connected - your core abstractions)
1. `AdminDataService` - 52 edges
2. `RestaurantService` - 36 edges
3. `catalogError()` - 31 edges
4. `CatalogValidationError` - 30 edges
5. `express` - 24 edges
6. `validateUuid()` - 22 edges
7. `optionalText()` - 21 edges
8. `requireKnownFields()` - 20 edges
9. `AdminSettingsComponent` - 17 edges
10. `SiteSettingsService` - 16 edges

## Surprising Connections (you probably didn't know these)
- `getCategories()` --calls--> `getCollection()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `createCategory()` --calls--> `addDoc()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `updateCategory()` --calls--> `updateDoc()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `deleteCategory()` --calls--> `deleteDoc()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `getWines()` --calls--> `getCollection()`  [EXTRACTED]
  src/controllers/wine.controller.ts → src/services/db.service.ts

## Import Cycles
- None detected.

## Communities (43 total, 11 thin omitted)

### Community 0 - "routes/index.ts"
Cohesion: 0.05
Nodes (104): express, supabase, catalogError(), CatalogValidationError, isRecord(), optionalImageUrl(), optionalOrder(), optionalPrice() (+96 more)

### Community 1 - "development"
Cohesion: 0.06
Nodes (37): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+29 more)

### Community 2 - "admin-data.service.ts"
Cohesion: 0.24
Nodes (7): DashboardOverview, FinanceExpense, FinanceReport, GalleryMedia, SchoolProgram, EMPTY_OVERVIEW, EMPTY_OVERVIEW

### Community 3 - "menu.controller.ts"
Cohesion: 0.13
Nodes (35): createMenuItem(), deleteMenuItem(), getMenuItems(), getParam(), getPublicMenuItems(), isRecord(), MENU_FIELDS, MenuPayload (+27 more)

### Community 4 - "AdminDataService"
Cohesion: 0.05
Nodes (5): AdminDataService, MenuItem, Injectable, AdminRestaurantComponent, Component

### Community 6 - "restaurant.service.ts"
Cohesion: 0.16
Nodes (15): CateringService, Dish, GalleryImage, Review, SchoolProgram, TeamMember, Wine, AboutComponent (+7 more)

### Community 7 - "pages/traiteur/traiteur.component.ts"
Cohesion: 0.08
Nodes (16): TraiteurComponent, Component, CateringCtaComponent, Component, CateringFormComponent, Component, CateringGalleryComponent, Component (+8 more)

### Community 8 - "app.routes.ts"
Cohesion: 0.27
Nodes (5): routes, adminAuthGuard(), authInterceptor(), NotFoundComponent, Component

### Community 9 - "app.component.ts"
Cohesion: 0.16
Nodes (7): HostListener, AppComponent, Component, FooterComponent, Component, HeaderComponent, Component

### Community 10 - "dependencies"
Cohesion: 0.06
Nodes (35): @angular/build, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms, @angular/platform-browser, @angular/router (+27 more)

### Community 11 - "compilerOptions"
Cohesion: 0.09
Nodes (22): DOM, DOM.Iterable, ES2022, ./index.tsx, angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs (+14 more)

### Community 12 - "2️⃣ STRUCTURE MODULAIRE OPTIMISÉE"
Cohesion: 0.12
Nodes (16): 1. Menu & Plats, 1️⃣ NOUVELLE ARCHITECTURE FONCTIONNELLE (4 COUCHES), 2. Réservations (Workflow PRO), 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE, 3. Traiteur, 3️⃣ UX/UI PREMIUM & PERFORMANCE, 4️⃣ SÉCURITÉ RENFORCÉE, 5️⃣ INTELLIGENCE BUSINESS (BI) (+8 more)

### Community 13 - "Découverte majeure non traitée — nouvel épique requis"
Cohesion: 0.08
Nodes (23): Artefacts versionnés, Intégrité de la version initiale, Mise à jour automatique GitHub Actions, Naviguer le projet avec Graphify, Pour les agents, Contrat Analytics — indicateurs opérationnels (2026-09-08), Contrat Catalogue — catégories et vins (2026-09-08), Contrat CMS — galerie des médias (2026-09-08) (+15 more)

### Community 14 - "StockComponent"
Cohesion: 0.20
Nodes (5): InventoryItem, emptyDraft(), InventoryDraft, StockComponent, Component

### Community 15 - "reservation.controller.ts"
Cohesion: 0.14
Nodes (23): ALLOWED_STATUSES, createCateringEvent(), deleteCateringEvent(), format(), getCateringEvents(), getParam(), updateCateringEvent(), validateCateringPayload() (+15 more)

### Community 16 - "reservations.component.ts"
Cohesion: 0.13
Nodes (11): AdminReservation, CateringEvent, ReservationStatus, ReservationsComponent, STATUS_CLASSES, STATUS_LABELS, Component, AdminTraiteurComponent (+3 more)

### Community 17 - "security.middleware.ts"
Cohesion: 0.06
Nodes (32): cors, multer, server.ts, ./tsconfig.json, app, __dirname, distPath, __filename (+24 more)

### Community 18 - "AdminEquipeComponent"
Cohesion: 0.19
Nodes (5): AdminTeamMember, AdminEquipeComponent, emptyDraft(), TeamDraft, Component

### Community 19 - "AdminWinesComponent"
Cohesion: 0.21
Nodes (4): WineItem, AdminWinesComponent, Component, WineDraft

### Community 20 - "Médiathèque et identité visuelle"
Cohesion: 0.29
Nodes (6): Identité de référence dans Git, Mise en production, Médiathèque et identité visuelle, Rôle de chaque emplacement, Sécurité et règles importantes, Utilisation par l’administration

### Community 21 - "devDependencies"
Cohesion: 0.06
Nodes (34): @cloudflare/workers-types, concurrently, devDependencies, @cloudflare/workers-types, concurrently, tsx, @types/cors, @types/express (+26 more)

### Community 22 - "Identité visuelle — Le Jacquier"
Cohesion: 0.50
Nodes (3): Fichiers, Identité visuelle — Le Jacquier, Palette existante

### Community 23 - "site-settings.service.ts"
Cohesion: 0.21
Nodes (7): Reservation, ReservationService, Injectable, FALLBACK_LOGO, ReservationComponent, Component, environment

### Community 24 - "AdminAuthService"
Cohesion: 0.15
Nodes (7): AdminAuthService, Injectable, AdminComponent, Component, AdminLoginComponent, Component, supabaseClient

### Community 25 - "AdminCategoriesComponent"
Cohesion: 0.22
Nodes (4): MenuCategory, AdminCategoriesComponent, CategoryDraft, Component

### Community 26 - "Architecture UML - Web App Restaurant Le Jacquier"
Cohesion: 0.20
Nodes (9): 1. Diagramme de Cas d'Utilisation (Use Case), 2. Diagramme de Classes (Domain Model), 3. Diagramme de Composants (Architecture Angular), 4. Diagramme de Séquence (Demande de Devis Traiteur), 5. Diagramme d'Activité (Processus Traiteur), 6. Diagramme de Déploiement, 7. Diagramme d'États (Réservation), Architecture UML - Web App Restaurant Le Jacquier (+1 more)

### Community 31 - "CMSComponent"
Cohesion: 0.17
Nodes (5): MediaAsset, MediaCategory, CATEGORIES, CMSComponent, Component

### Community 37 - "AdminSettingsComponent"
Cohesion: 0.14
Nodes (8): BrandSettings, MediaReference, PublicSettings, SiteMediaSlot, AdminSettingsComponent, EMPTY_SETTINGS, SITE_MEDIA_SLOTS, Component

### Community 40 - "gallery.component.ts"
Cohesion: 0.33
Nodes (3): GalleryComponent, LAYOUT_PATTERN, Component

### Community 41 - "menu.component.ts"
Cohesion: 0.29
Nodes (4): MenuComponent, Component, DishCardComponent, Component

### Community 46 - "SiteSettingsService"
Cohesion: 0.15
Nodes (8): SiteSettingsService, Injectable, CateringComponent, Component, ContactComponent, Component, SchoolComponent, Component

## Knowledge Gaps
- **205 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `root` (+200 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminDataService` connect `AdminDataService` to `admin-data.service.ts`, `AdminSettingsComponent`, `StockComponent`, `reservations.component.ts`, `AdminEquipeComponent`, `AdminWinesComponent`, `AdminCategoriesComponent`, `CMSComponent`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `RestaurantService` connect `RestaurantService` to `restaurant.service.ts`, `pages/traiteur/traiteur.component.ts`, `gallery.component.ts`, `menu.component.ts`, `app.component.ts`, `SiteSettingsService`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `express` connect `routes/index.ts` to `security.middleware.ts`, `menu.controller.ts`, `reservation.controller.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _205 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05495867768595041 - nodes in this community are weakly interconnected._
- **Should `development` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._
- **Should `menu.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12944523470839261 - nodes in this community are weakly interconnected._