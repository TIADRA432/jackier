# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1249 nodes · 2629 edges · 81 communities (50 shown, 31 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9fba160c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- reservation.controller.ts
- AdminDataService
- AdminSettingsComponent
- AdminSchoolComponent
- options
- CMSComponent
- routes/index.ts
- RestaurantService
- wine.controller.ts
- CatalogValidationError
- @angular/common
- admin-data.service.ts
- AdminComponent
- settings.controller.ts
- app.routes.ts
- AdminGalleryComponent
- package.json
- restaurant.service.ts
- dependencies
- @angular/core
- catalogError
- media.controller.ts
- menu.controller.ts
- AdminEquipeComponent
- AdminRestaurantComponent
- compilerOptions
- GalleryComponent
- AdminTraiteurComponent
- team.controller.ts
- ReservationsComponent
- reservation.service.ts
- devDependencies
- menu-catalog.ts
- StockComponent
- SchoolComponent
- AdminWinesComponent
- menu.component.ts
- worker.ts
- security.middleware.ts
- cms.component.ts
- SeoService
- SiteSettingsService
- AdminCategoriesComponent
- HeaderComponent
- compilerOptions
- DashboardComponent
- scripts
- ref_node_path
- ref_node_test
- server.ts
- admin.component.ts
- ref_node_fs
- AdminFinanceComponent
- ReservationComponent
- AnalyticsComponent
- MenuComponent
- ParallaxDirective
- ref_node_assert
- HomeComponent
- CateringFormComponent
- prepare-preview.mjs
- DishDetailComponent
- production-shell.test.ts
- security.middleware.test.ts
- smoke-production.sh
- TraiteurComponent
- catering-flow.test.ts
- dashboard-readiness.test.ts
- database-security.test.ts
- gallery-experience.test.ts
- live-visitor-experience.test.ts
- reservation-flow.test.ts
- school-catalog.test.ts
- security-logging.test.ts
- seo.test.ts
- settings-control-center.test.ts
- staging-environment.test.ts
- team-management.test.ts
- wine-catalog.test.ts
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
- `AdminSettingsComponent` --references--> `PublicSettings`  [EXTRACTED]
  src/app/pages/admin/settings/settings.component.ts → src/app/core/services/admin-data.service.ts
- `SessionDraft` --references--> `SchoolSessionStatus`  [EXTRACTED]
  src/app/pages/admin/school/school.component.ts → src/app/core/services/admin-data.service.ts
- `deleteCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/category.controller.ts → src/controllers/catalog.validation.ts
- `validateDailyClosePayload()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/finance.controller.ts → src/controllers/catalog.validation.ts
- `validateExpensePayload()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/finance.controller.ts → src/controllers/catalog.validation.ts

## Import Cycles
- None detected.

## Communities (81 total, 31 thin omitted)

### Community 0 - "reservation.controller.ts"
Cohesion: 0.06
Nodes (53): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+45 more)

### Community 2 - "AdminSettingsComponent"
Cohesion: 0.08
Nodes (7): MediaReference, OpeningDay, SiteMediaSlot, WeekdayKey, WeeklyHours, AdminSettingsComponent, Component

### Community 3 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (11): SchoolLevel, SchoolProgram, SchoolProgramStatus, SchoolRegistration, SchoolRegistrationStatus, SchoolSession, SchoolSessionStatus, AdminSchoolComponent (+3 more)

### Community 4 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 5 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 6 - "routes/index.ts"
Cohesion: 0.10
Nodes (31): express, supabase, addExpense(), DAILY_CLOSE_FIELDS, dailyClose(), EXPENSE_FIELDS, getExpenses(), getReports() (+23 more)

### Community 8 - "wine.controller.ts"
Cohesion: 0.13
Nodes (32): optionalImageUrl(), optionalOrder(), optionalPrice(), optionalText(), requiredText(), CATEGORY_FIELDS, CategoryPayload, createCategory() (+24 more)

### Community 9 - "CatalogValidationError"
Cohesion: 0.13
Nodes (35): CatalogValidationError, getCategories(), cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolProgram(), createSchoolRegistration() (+27 more)

### Community 10 - "@angular/common"
Cohesion: 0.11
Nodes (15): @angular/common, @angular/platform-browser, rxjs, AppComponent, Component, authInterceptor(), SeoConfig, DEFAULT_SETTINGS (+7 more)

### Community 11 - "admin-data.service.ts"
Cohesion: 0.11
Nodes (20): @angular/forms, BrandSettings, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuCategory, MenuItemCategory (+12 more)

### Community 12 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 13 - "settings.controller.ts"
Cohesion: 0.14
Nodes (25): isRecord(), requireKnownFields(), BRAND_FIELDS, getLogs(), getSettings(), MEDIA_REFERENCE_FIELDS, MediaReference, OPENING_DAY_FIELDS (+17 more)

### Community 14 - "app.routes.ts"
Cohesion: 0.11
Nodes (14): @angular/router, routes, adminAuthGuard(), EMPTY_OVERVIEW, DEPARTMENTS, TeamDraft, GALLERY_CATEGORIES, GalleryDraft (+6 more)

### Community 15 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 16 - "package.json"
Cohesion: 0.08
Nodes (23): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+15 more)

### Community 17 - "restaurant.service.ts"
Cohesion: 0.14
Nodes (13): Dish, GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine, AboutComponent (+5 more)

### Community 18 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 19 - "@angular/core"
Cohesion: 0.14
Nodes (11): @angular/core, CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent, Component, CateringProcessComponent (+3 more)

### Community 20 - "catalogError"
Cohesion: 0.19
Nodes (21): catalogError(), validateUuid(), deleteCategory(), createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload (+13 more)

### Community 21 - "media.controller.ts"
Cohesion: 0.14
Nodes (21): createMediaAsset(), createMediaTag(), downloadMediaAsset(), EXTENSIONS, getMediaAssets(), getMediaTags(), MEDIA_CATEGORIES, MEDIA_FIELDS (+13 more)

### Community 22 - "menu.controller.ts"
Cohesion: 0.24
Nodes (21): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getParam(), isRecord(), MENU_FIELDS, MenuPayload, optionalBoolean() (+13 more)

### Community 23 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 24 - "AdminRestaurantComponent"
Cohesion: 0.20
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 26 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 27 - "AdminTraiteurComponent"
Cohesion: 0.26
Nodes (4): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, Component

### Community 28 - "team.controller.ts"
Cohesion: 0.21
Nodes (15): createTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment(), TEAM_DEPARTMENTS, TEAM_FIELDS (+7 more)

### Community 29 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 30 - "reservation.service.ts"
Cohesion: 0.22
Nodes (7): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable, supabaseClient, environment

### Community 31 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 32 - "menu-catalog.ts"
Cohesion: 0.24
Nodes (11): CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters, normalizeSearch() (+3 more)

### Community 33 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

### Community 34 - "SchoolComponent"
Cohesion: 0.21
Nodes (3): SchoolSession, SchoolComponent, Component

### Community 36 - "menu.component.ts"
Cohesion: 0.20
Nodes (6): DishCardComponent, Component, RevealOnScrollDirective, RevealVariant, Directive, Input

### Community 37 - "worker.ts"
Cohesion: 0.22
Nodes (10): ref_cloudflare_node, @cloudflare/workers-types, staticAssetSecurityHeaders, router, apiHandler, app, Env, fetch() (+2 more)

### Community 38 - "security.middleware.ts"
Cohesion: 0.18
Nodes (8): cors, express-rate-limit, helmet, allowedOrigins, configuredOrigins, contentSecurityPolicy, corsOptions, publicWriteRateLimiter

### Community 39 - "cms.component.ts"
Cohesion: 0.18
Nodes (10): @uppy/angular, @uppy/core, @uppy/dashboard, @uppy/locales, MediaTag, CATEGORIES, EditDraft, GALLERY_CATEGORIES (+2 more)

### Community 41 - "SiteSettingsService"
Cohesion: 0.20
Nodes (6): SiteSettingsService, Injectable, STATUS_CLASSES, STATUS_LABELS, LABELS, STATUSES

### Community 43 - "HeaderComponent"
Cohesion: 0.27
Nodes (3): HeaderComponent, Component, HostListener

### Community 44 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 46 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 47 - "ref_node_path"
Cohesion: 0.22
Nodes (4): ref_node_path, root, root, root

### Community 48 - "ref_node_test"
Cohesion: 0.22
Nodes (4): ref_node_test, root, root, valid

### Community 49 - "server.ts"
Cohesion: 0.22
Nodes (8): ref_path, ref_url, app, __dirname, distPath, __filename, PORT, configureSecurity()

### Community 50 - "admin.component.ts"
Cohesion: 0.22
Nodes (7): DashboardOverview, ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem, AdminSearchItem, EMPTY_OVERVIEW, EMPTY_OVERVIEW

### Community 51 - "ref_node_fs"
Cohesion: 0.25
Nodes (3): ref_node_fs, root, root

### Community 56 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 57 - "ref_node_assert"
Cohesion: 0.33
Nodes (3): ref_node_assert, root, root

### Community 60 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 64 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **262 isolated node(s):** `ReservationWorkflowStatus`, `ServerLogLevel`, `DashboardReadinessCheck`, `MenuItemCategory`, `CategoryDraft` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 524 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `worker.ts`, `security.middleware.ts`, `wine.controller.ts`, `CatalogValidationError`, `settings.controller.ts`, `package.json`, `server.ts`, `catalogError`, `media.controller.ts`, `menu.controller.ts`, `team.controller.ts`, `security.middleware.test.ts`?**
  _High betweenness centrality (0.283) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `AdminSchoolComponent`, `menu.component.ts`, `cms.component.ts`, `SiteSettingsService`, `@angular/common`, `admin-data.service.ts`, `app.routes.ts`, `package.json`, `restaurant.service.ts`, `admin.component.ts`, `reservation.service.ts`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `AdminSchoolComponent`, `menu.component.ts`, `cms.component.ts`, `SiteSettingsService`, `admin-data.service.ts`, `app.routes.ts`, `package.json`, `restaurant.service.ts`, `admin.component.ts`, `@angular/core`, `reservation.service.ts`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **What connects `ReservationWorkflowStatus`, `ServerLogLevel`, `DashboardReadinessCheck` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06384180790960452 - nodes in this community are weakly interconnected._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.07908163265306123 - nodes in this community are weakly interconnected._