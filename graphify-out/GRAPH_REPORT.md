# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1243 nodes · 2618 edges · 60 communities (44 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a88071ae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_node_assert
- AdminDataService
- reservation.controller.ts
- AdminSettingsComponent
- AdminSchoolComponent
- options
- CMSComponent
- routes/index.ts
- RestaurantService
- wine.controller.ts
- CatalogValidationError
- admin-data.service.ts
- @angular/common
- app.routes.ts
- AdminComponent
- settings.controller.ts
- AdminGalleryComponent
- package.json
- restaurant.service.ts
- menu.controller.ts
- dependencies
- @angular/core
- worker.ts
- catalogError
- media.controller.ts
- AdminEquipeComponent
- AdminRestaurantComponent
- compilerOptions
- GalleryComponent
- AdminTraiteurComponent
- team.controller.ts
- security.middleware.ts
- ReservationsComponent
- reservation.service.ts
- devDependencies
- menu-catalog.ts
- StockComponent
- SchoolComponent
- AdminWinesComponent
- menu.component.ts
- cms.component.ts
- SeoService
- SiteSettingsService
- AdminCategoriesComponent
- HeaderComponent
- compilerOptions
- DashboardComponent
- scripts
- AdminFinanceComponent
- AnalyticsComponent
- MenuComponent
- ReservationComponent
- ParallaxDirective
- HomeComponent
- CateringFormComponent
- DishDetailComponent
- smoke-production.sh
- TraiteurComponent
- environment.development.ts
- environment.prod.ts

## God Nodes (most connected - your core abstractions)
1. `AdminDataService` - 70 edges
2. `CatalogValidationError` - 54 edges
3. `@angular/core` - 51 edges
4. `AdminSettingsComponent` - 47 edges
5. `catalogError()` - 45 edges
6. `RestaurantService` - 44 edges
7. `CMSComponent` - 40 edges
8. `@angular/common` - 37 edges
9. `AdminSchoolComponent` - 36 edges
10. `validateUuid()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `deleteCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/category.controller.ts → src/controllers/catalog.validation.ts
- `validateDailyClosePayload()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/finance.controller.ts → src/controllers/catalog.validation.ts
- `validateExpensePayload()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/finance.controller.ts → src/controllers/catalog.validation.ts
- `createGalleryImage()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts
- `validateCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts

## Import Cycles
- None detected.

## Communities (60 total, 16 thin omitted)

### Community 0 - "ref_node_assert"
Cohesion: 0.05
Nodes (30): ref_node_assert, ref_node_child_process, ref_node_fs, ref_node_path, ref_node_test, ref_node_url, previewConfiguration(), root (+22 more)

### Community 2 - "reservation.controller.ts"
Cohesion: 0.07
Nodes (48): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+40 more)

### Community 3 - "AdminSettingsComponent"
Cohesion: 0.08
Nodes (8): MediaReference, OpeningDay, PublicSettings, SiteMediaSlot, WeekdayKey, WeeklyHours, AdminSettingsComponent, Component

### Community 4 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (11): SchoolLevel, SchoolProgram, SchoolProgramStatus, SchoolRegistration, SchoolRegistrationStatus, SchoolSession, SchoolSessionStatus, AdminSchoolComponent (+3 more)

### Community 5 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 6 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 7 - "routes/index.ts"
Cohesion: 0.10
Nodes (31): express, supabase, addExpense(), DAILY_CLOSE_FIELDS, dailyClose(), EXPENSE_FIELDS, getExpenses(), getReports() (+23 more)

### Community 9 - "wine.controller.ts"
Cohesion: 0.13
Nodes (32): optionalImageUrl(), optionalOrder(), optionalPrice(), optionalText(), requiredText(), CATEGORY_FIELDS, CategoryPayload, createCategory() (+24 more)

### Community 10 - "CatalogValidationError"
Cohesion: 0.13
Nodes (35): CatalogValidationError, getCategories(), cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolProgram(), createSchoolRegistration() (+27 more)

### Community 11 - "admin-data.service.ts"
Cohesion: 0.09
Nodes (24): @angular/forms, BrandSettings, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuCategory, MenuItemCategory (+16 more)

### Community 12 - "@angular/common"
Cohesion: 0.11
Nodes (15): @angular/common, @angular/platform-browser, rxjs, AppComponent, Component, authInterceptor(), SeoConfig, DEFAULT_SETTINGS (+7 more)

### Community 13 - "app.routes.ts"
Cohesion: 0.10
Nodes (17): @angular/router, routes, adminAuthGuard(), DashboardOverview, ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem, AdminSearchItem (+9 more)

### Community 14 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 15 - "settings.controller.ts"
Cohesion: 0.14
Nodes (25): isRecord(), requireKnownFields(), BRAND_FIELDS, getLogs(), getSettings(), MEDIA_REFERENCE_FIELDS, MediaReference, OPENING_DAY_FIELDS (+17 more)

### Community 16 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 17 - "package.json"
Cohesion: 0.08
Nodes (23): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+15 more)

### Community 18 - "restaurant.service.ts"
Cohesion: 0.14
Nodes (13): Dish, GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine, AboutComponent (+5 more)

### Community 19 - "menu.controller.ts"
Cohesion: 0.21
Nodes (22): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getParam(), isRecord(), MENU_FIELDS, MenuPayload, optionalBoolean() (+14 more)

### Community 20 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 21 - "@angular/core"
Cohesion: 0.14
Nodes (11): @angular/core, CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent, Component, CateringProcessComponent (+3 more)

### Community 22 - "worker.ts"
Cohesion: 0.12
Nodes (19): ref_cloudflare_node, @cloudflare/workers-types, ref_path, ref_url, app, __dirname, distPath, __filename (+11 more)

### Community 23 - "catalogError"
Cohesion: 0.19
Nodes (21): catalogError(), validateUuid(), deleteCategory(), createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload (+13 more)

### Community 24 - "media.controller.ts"
Cohesion: 0.14
Nodes (21): createMediaAsset(), createMediaTag(), downloadMediaAsset(), EXTENSIONS, getMediaAssets(), getMediaTags(), MEDIA_CATEGORIES, MEDIA_FIELDS (+13 more)

### Community 25 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 26 - "AdminRestaurantComponent"
Cohesion: 0.20
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 27 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 28 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 29 - "AdminTraiteurComponent"
Cohesion: 0.26
Nodes (4): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, Component

### Community 30 - "team.controller.ts"
Cohesion: 0.21
Nodes (15): createTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment(), TEAM_DEPARTMENTS, TEAM_FIELDS (+7 more)

### Community 31 - "security.middleware.ts"
Cohesion: 0.14
Nodes (10): cors, express-rate-limit, helmet, ref_node_events, ref_node_net, allowedOrigins, configuredOrigins, contentSecurityPolicy (+2 more)

### Community 32 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 33 - "reservation.service.ts"
Cohesion: 0.22
Nodes (7): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable, supabaseClient, environment

### Community 34 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 35 - "menu-catalog.ts"
Cohesion: 0.24
Nodes (11): CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters, normalizeSearch() (+3 more)

### Community 36 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

### Community 37 - "SchoolComponent"
Cohesion: 0.21
Nodes (3): SchoolSession, SchoolComponent, Component

### Community 39 - "menu.component.ts"
Cohesion: 0.20
Nodes (6): DishCardComponent, Component, RevealOnScrollDirective, RevealVariant, Directive, Input

### Community 40 - "cms.component.ts"
Cohesion: 0.18
Nodes (10): @uppy/angular, @uppy/core, @uppy/dashboard, @uppy/locales, MediaTag, CATEGORIES, EditDraft, GALLERY_CATEGORIES (+2 more)

### Community 42 - "SiteSettingsService"
Cohesion: 0.20
Nodes (6): SiteSettingsService, Injectable, STATUS_CLASSES, STATUS_LABELS, LABELS, STATUSES

### Community 44 - "HeaderComponent"
Cohesion: 0.27
Nodes (3): HeaderComponent, Component, HostListener

### Community 45 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 47 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 52 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 56 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **261 isolated node(s):** `SchoolPayload`, `DashboardReadinessCheck`, `MenuItemCategory`, `ReservationStatus`, `CategoryDraft` (+256 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 522 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `wine.controller.ts`, `CatalogValidationError`, `settings.controller.ts`, `package.json`, `menu.controller.ts`, `worker.ts`, `catalogError`, `media.controller.ts`, `team.controller.ts`, `security.middleware.ts`?**
  _High betweenness centrality (0.260) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `reservation.service.ts`, `AdminSchoolComponent`, `menu.component.ts`, `cms.component.ts`, `SiteSettingsService`, `admin-data.service.ts`, `@angular/common`, `app.routes.ts`, `package.json`, `restaurant.service.ts`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `reservation.service.ts`, `AdminSchoolComponent`, `menu.component.ts`, `cms.component.ts`, `SiteSettingsService`, `admin-data.service.ts`, `app.routes.ts`, `package.json`, `restaurant.service.ts`, `@angular/core`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `SchoolPayload`, `DashboardReadinessCheck`, `MenuItemCategory` to the rest of the system?**
  _261 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_assert` be split into smaller, more focused modules?**
  _Cohesion score 0.05052631578947368 - nodes in this community are weakly interconnected._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07058001397624039 - nodes in this community are weakly interconnected._