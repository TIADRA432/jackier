# Graph Report - jackier  (2026-09-16)

## Corpus Check
- 105 files · ~117,431 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 826 nodes · 1474 edges · 46 communities (30 shown, 15 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- AdminDataService
- development
- menu-catalog.ts
- AdminSettingsComponent
- pages/traiteur/traiteur.component.ts
- RestaurantService
- admin-data.service.ts
- Dish
- routes/index.ts
- SiteSettingsService
- admin/traiteur/traiteur.component.ts
- Médiathèque et identité visuelle
- dependencies
- restaurant.service.ts
- menu.controller.ts
- compilerOptions
- 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE
- home.component.ts
- app.routes.ts
- Identité visuelle — Le Jacquier
- Découverte majeure non traitée — nouvel épique requis
- reservations.component.ts
- reservation.controller.ts
- security.middleware.ts
- StockComponent
- catering.controller.ts
- devDependencies
- AdminCategoriesComponent
- AdminWinesComponent
- Architecture UML - Web App Restaurant Le Jacquier
- site-settings.service.ts
- AdminFinanceComponent
- AdminRestaurantComponent
- AnalyticsComponent
- DashboardComponent
- AdminSchoolComponent
- MenuComponent
- ReservationComponent
- Run and deploy your AI Studio app
- pages/school/school.component.ts
- admin-access.test.ts
- media-library.test.ts
- AGENTS.md
- environment.development.ts
- environment.prod.ts

## God Nodes (most connected - your core abstractions)
1. `AdminDataService` - 52 edges
2. `RestaurantService` - 37 edges
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

## Communities (46 total, 15 thin omitted)

### Community 1 - "development"
Cohesion: 0.06
Nodes (37): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+29 more)

### Community 2 - "menu-catalog.ts"
Cohesion: 0.24
Nodes (11): CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters, normalizeSearch() (+3 more)

### Community 3 - "AdminSettingsComponent"
Cohesion: 0.06
Nodes (18): AdminTeamMember, BrandSettings, MediaAsset, MediaCategory, MediaReference, PublicSettings, SiteMediaSlot, CATEGORIES (+10 more)

### Community 4 - "pages/traiteur/traiteur.component.ts"
Cohesion: 0.08
Nodes (16): TraiteurComponent, Component, CateringCtaComponent, Component, CateringFormComponent, Component, CateringGalleryComponent, Component (+8 more)

### Community 6 - "admin-data.service.ts"
Cohesion: 0.24
Nodes (7): DashboardOverview, FinanceExpense, FinanceReport, GalleryMedia, SchoolProgram, EMPTY_OVERVIEW, EMPTY_OVERVIEW

### Community 7 - "Dish"
Cohesion: 0.27
Nodes (5): Dish, DishCardComponent, Component, DishDetailComponent, Component

### Community 8 - "routes/index.ts"
Cohesion: 0.05
Nodes (104): express, supabase, catalogError(), CatalogValidationError, isRecord(), optionalImageUrl(), optionalOrder(), optionalPrice() (+96 more)

### Community 9 - "SiteSettingsService"
Cohesion: 0.13
Nodes (9): SiteSettingsService, Injectable, CateringComponent, Component, ContactComponent, Component, GalleryComponent, LAYOUT_PATTERN (+1 more)

### Community 10 - "admin/traiteur/traiteur.component.ts"
Cohesion: 0.28
Nodes (5): CateringEvent, AdminTraiteurComponent, LABELS, STATUSES, Component

### Community 11 - "Médiathèque et identité visuelle"
Cohesion: 0.29
Nodes (6): Identité de référence dans Git, Mise en production, Médiathèque et identité visuelle, Rôle de chaque emplacement, Sécurité et règles importantes, Utilisation par l’administration

### Community 12 - "dependencies"
Cohesion: 0.06
Nodes (35): @angular/build, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms, @angular/platform-browser, @angular/router (+27 more)

### Community 13 - "restaurant.service.ts"
Cohesion: 0.24
Nodes (10): CateringService, GalleryImage, Review, SchoolProgram, TeamMember, Wine, AboutComponent, Component (+2 more)

### Community 14 - "menu.controller.ts"
Cohesion: 0.13
Nodes (35): createMenuItem(), deleteMenuItem(), getMenuItems(), getParam(), getPublicMenuItems(), isRecord(), MENU_FIELDS, MenuPayload (+27 more)

### Community 15 - "compilerOptions"
Cohesion: 0.09
Nodes (22): DOM, DOM.Iterable, ES2022, ./index.tsx, angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs (+14 more)

### Community 16 - "2️⃣ STRUCTURE MODULAIRE OPTIMISÉE"
Cohesion: 0.12
Nodes (16): 1. Menu & Plats, 1️⃣ NOUVELLE ARCHITECTURE FONCTIONNELLE (4 COUCHES), 2. Réservations (Workflow PRO), 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE, 3. Traiteur, 3️⃣ UX/UI PREMIUM & PERFORMANCE, 4️⃣ SÉCURITÉ RENFORCÉE, 5️⃣ INTELLIGENCE BUSINESS (BI) (+8 more)

### Community 17 - "home.component.ts"
Cohesion: 0.40
Nodes (4): HomeComponent, Component, DailySpecialComponent, Component

### Community 18 - "app.routes.ts"
Cohesion: 0.07
Nodes (19): HostListener, routes, AppComponent, Component, adminAuthGuard(), authInterceptor(), AdminAuthService, Injectable (+11 more)

### Community 19 - "Identité visuelle — Le Jacquier"
Cohesion: 0.50
Nodes (3): Fichiers, Identité visuelle — Le Jacquier, Palette existante

### Community 21 - "Découverte majeure non traitée — nouvel épique requis"
Cohesion: 0.08
Nodes (23): Artefacts versionnés, Intégrité de la version initiale, Mise à jour automatique GitHub Actions, Naviguer le projet avec Graphify, Pour les agents, Contrat Analytics — indicateurs opérationnels (2026-09-08), Contrat Catalogue — catégories et vins (2026-09-08), Contrat CMS — galerie des médias (2026-09-08) (+15 more)

### Community 24 - "reservations.component.ts"
Cohesion: 0.22
Nodes (6): AdminReservation, ReservationStatus, ReservationsComponent, STATUS_CLASSES, STATUS_LABELS, Component

### Community 25 - "reservation.controller.ts"
Cohesion: 0.25
Nodes (12): ALLOWED_STATUSES, ALLOWED_TIMES, cleanString(), createReservation(), deleteReservation(), format(), getParam(), getReservations() (+4 more)

### Community 26 - "security.middleware.ts"
Cohesion: 0.06
Nodes (32): cors, multer, server.ts, ./tsconfig.json, app, __dirname, distPath, __filename (+24 more)

### Community 27 - "StockComponent"
Cohesion: 0.20
Nodes (5): InventoryItem, emptyDraft(), InventoryDraft, StockComponent, Component

### Community 29 - "catering.controller.ts"
Cohesion: 0.35
Nodes (11): ALLOWED_STATUSES, createCateringEvent(), deleteCateringEvent(), format(), getCateringEvents(), getParam(), updateCateringEvent(), validateCateringPayload() (+3 more)

### Community 30 - "devDependencies"
Cohesion: 0.06
Nodes (34): @cloudflare/workers-types, concurrently, devDependencies, @cloudflare/workers-types, concurrently, tsx, @types/cors, @types/express (+26 more)

### Community 32 - "AdminCategoriesComponent"
Cohesion: 0.22
Nodes (4): MenuCategory, AdminCategoriesComponent, CategoryDraft, Component

### Community 33 - "AdminWinesComponent"
Cohesion: 0.21
Nodes (4): WineItem, AdminWinesComponent, Component, WineDraft

### Community 34 - "Architecture UML - Web App Restaurant Le Jacquier"
Cohesion: 0.20
Nodes (9): 1. Diagramme de Cas d'Utilisation (Use Case), 2. Diagramme de Classes (Domain Model), 3. Diagramme de Composants (Architecture Angular), 4. Diagramme de Séquence (Demande de Devis Traiteur), 5. Diagramme d'Activité (Processus Traiteur), 6. Diagramme de Déploiement, 7. Diagramme d'États (Réservation), Architecture UML - Web App Restaurant Le Jacquier (+1 more)

### Community 35 - "site-settings.service.ts"
Cohesion: 0.33
Nodes (5): Reservation, ReservationService, Injectable, FALLBACK_LOGO, environment

### Community 40 - "AdminRestaurantComponent"
Cohesion: 0.38
Nodes (3): MenuItem, AdminRestaurantComponent, Component

## Knowledge Gaps
- **210 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `root` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 366 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AdminDataService` connect `AdminDataService` to `AdminCategoriesComponent`, `AdminWinesComponent`, `AdminSettingsComponent`, `admin-data.service.ts`, `AdminRestaurantComponent`, `admin/traiteur/traiteur.component.ts`, `reservations.component.ts`, `StockComponent`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `RestaurantService` connect `RestaurantService` to `menu-catalog.ts`, `pages/traiteur/traiteur.component.ts`, `SiteSettingsService`, `restaurant.service.ts`, `home.component.ts`, `pages/school/school.component.ts`, `app.routes.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `security.middleware.ts`, `catering.controller.ts`, `menu.controller.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `development` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.057329462989840346 - nodes in this community are weakly interconnected._