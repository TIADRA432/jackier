# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1259 nodes · 2660 edges · 81 communities (49 shown, 32 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `557b94a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- reservation.controller.ts
- AdminDataService
- AdminSettingsComponent
- AdminSchoolComponent
- options
- CMSComponent
- RestaurantService
- site-settings.service.ts
- CatalogValidationError
- admin-data.service.ts
- team.controller.ts
- AdminComponent
- settings.controller.ts
- @angular/common
- AdminGalleryComponent
- package.json
- gallery.controller.ts
- dependencies
- catalogError
- @angular/core
- routes/index.ts
- media.controller.ts
- menu.controller.ts
- restaurant.service.ts
- AdminEquipeComponent
- app.routes.ts
- reservation.service.ts
- AdminRestaurantComponent
- compilerOptions
- GalleryComponent
- AdminTraiteurComponent
- category.controller.ts
- ReservationsComponent
- devDependencies
- menu-catalog.ts
- StockComponent
- SchoolComponent
- AdminWinesComponent
- worker.ts
- security.middleware.ts
- cms.component.ts
- SeoService
- AdminCategoriesComponent
- HeaderComponent
- compilerOptions
- DashboardComponent
- scripts
- ref_node_path
- ref_node_test
- server.ts
- ref_node_fs
- AdminFinanceComponent
- ReservationComponent
- ref_node_assert
- AnalyticsComponent
- MenuComponent
- ParallaxDirective
- HomeComponent
- CateringFormComponent
- security.middleware.test.ts
- prepare-preview.mjs
- DishDetailComponent
- production-shell.test.ts
- smoke-production.sh
- TraiteurComponent
- reservations.component.ts
- accessibility-shell.test.ts
- admin-access.test.ts
- content-authenticity.test.ts
- dashboard-readiness.test.ts
- database-security.test.ts
- media-library.test.ts
- school-management.test.ts
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
5. `RestaurantService` - 45 edges
6. `catalogError()` - 45 edges
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

## Communities (81 total, 32 thin omitted)

### Community 0 - "reservation.controller.ts"
Cohesion: 0.07
Nodes (57): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, CateringValidationError, CateringWorkflowStatus, cleanString(), conakryDateString(), createCateringEvent() (+49 more)

### Community 2 - "AdminSettingsComponent"
Cohesion: 0.08
Nodes (5): MediaReference, SiteMediaSlot, WeeklyHours, AdminSettingsComponent, Component

### Community 3 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (11): SchoolLevel, SchoolProgram, SchoolProgramStatus, SchoolRegistration, SchoolRegistrationStatus, SchoolSession, SchoolSessionStatus, AdminSchoolComponent (+3 more)

### Community 4 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 5 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 7 - "site-settings.service.ts"
Cohesion: 0.09
Nodes (17): @angular/platform-browser, rxjs, routes, AppComponent, Component, authInterceptor(), SeoConfig, DEFAULT_SETTINGS (+9 more)

### Community 8 - "CatalogValidationError"
Cohesion: 0.14
Nodes (34): CatalogValidationError, getCategories(), cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolProgram(), createSchoolRegistration() (+26 more)

### Community 9 - "admin-data.service.ts"
Cohesion: 0.09
Nodes (24): @angular/forms, BrandSettings, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuCategory, MenuItemCategory (+16 more)

### Community 10 - "team.controller.ts"
Cohesion: 0.13
Nodes (29): optionalImageUrl(), optionalOrder(), optionalText(), requiredText(), createTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio() (+21 more)

### Community 11 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 12 - "settings.controller.ts"
Cohesion: 0.14
Nodes (25): isRecord(), requireKnownFields(), BRAND_FIELDS, getLogs(), getSettings(), MEDIA_REFERENCE_FIELDS, MediaReference, OPENING_DAY_FIELDS (+17 more)

### Community 13 - "@angular/common"
Cohesion: 0.14
Nodes (13): @angular/common, @angular/router, Dish, DEPARTMENTS, TeamDraft, DailySpecialComponent, Component, DishCardComponent (+5 more)

### Community 14 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 15 - "package.json"
Cohesion: 0.08
Nodes (23): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+15 more)

### Community 16 - "gallery.controller.ts"
Cohesion: 0.15
Nodes (19): express, supabase, createGalleryImage(), GALLERY_CATEGORIES, GALLERY_FIELDS, GalleryCategory, GalleryRow, getGalleryImages() (+11 more)

### Community 17 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 18 - "catalogError"
Cohesion: 0.18
Nodes (22): catalogError(), validateUuid(), deleteCategory(), deleteGalleryImage(), createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS (+14 more)

### Community 19 - "@angular/core"
Cohesion: 0.14
Nodes (11): @angular/core, CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent, Component, CateringProcessComponent (+3 more)

### Community 20 - "routes/index.ts"
Cohesion: 0.14
Nodes (19): optionalPrice(), addExpense(), DAILY_CLOSE_FIELDS, dailyClose(), EXPENSE_FIELDS, getExpenses(), getReports(), validateDailyClosePayload() (+11 more)

### Community 21 - "media.controller.ts"
Cohesion: 0.14
Nodes (21): createMediaAsset(), createMediaTag(), downloadMediaAsset(), EXTENSIONS, getMediaAssets(), getMediaTags(), MEDIA_CATEGORIES, MEDIA_FIELDS (+13 more)

### Community 22 - "menu.controller.ts"
Cohesion: 0.24
Nodes (21): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getParam(), isRecord(), MENU_FIELDS, MenuPayload, optionalBoolean() (+13 more)

### Community 23 - "restaurant.service.ts"
Cohesion: 0.15
Nodes (12): GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine, AboutComponent, Component (+4 more)

### Community 24 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 25 - "app.routes.ts"
Cohesion: 0.12
Nodes (13): adminAuthGuard(), DashboardOverview, ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem, AdminSearchItem, EMPTY_OVERVIEW, EMPTY_OVERVIEW (+5 more)

### Community 26 - "reservation.service.ts"
Cohesion: 0.15
Nodes (9): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable, AdminLoginComponent, Component, supabaseClient (+1 more)

### Community 27 - "AdminRestaurantComponent"
Cohesion: 0.24
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 28 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 29 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 30 - "AdminTraiteurComponent"
Cohesion: 0.26
Nodes (4): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, Component

### Community 31 - "category.controller.ts"
Cohesion: 0.24
Nodes (14): CATEGORY_FIELDS, CategoryPayload, createCategory(), updateCategory(), validateCategoryPayload(), addDoc(), FIELD_MAP, flattenJsonTable() (+6 more)

### Community 32 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 33 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 34 - "menu-catalog.ts"
Cohesion: 0.24
Nodes (11): CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters, normalizeSearch() (+3 more)

### Community 35 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

### Community 36 - "SchoolComponent"
Cohesion: 0.21
Nodes (3): SchoolSession, SchoolComponent, Component

### Community 38 - "worker.ts"
Cohesion: 0.22
Nodes (10): ref_cloudflare_node, @cloudflare/workers-types, staticAssetSecurityHeaders, router, apiHandler, app, Env, fetch() (+2 more)

### Community 39 - "security.middleware.ts"
Cohesion: 0.18
Nodes (8): cors, express-rate-limit, helmet, allowedOrigins, configuredOrigins, contentSecurityPolicy, corsOptions, publicWriteRateLimiter

### Community 40 - "cms.component.ts"
Cohesion: 0.18
Nodes (10): @uppy/angular, @uppy/core, @uppy/dashboard, @uppy/locales, MediaTag, CATEGORIES, EditDraft, GALLERY_CATEGORIES (+2 more)

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
Nodes (4): ref_node_test, root, valid, root

### Community 49 - "server.ts"
Cohesion: 0.22
Nodes (8): ref_path, ref_url, app, __dirname, distPath, __filename, PORT, configureSecurity()

### Community 50 - "ref_node_fs"
Cohesion: 0.25
Nodes (3): ref_node_fs, root, root

### Community 53 - "ref_node_assert"
Cohesion: 0.29
Nodes (3): ref_node_assert, root, root

### Community 56 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 60 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 63 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **263 isolated node(s):** `CateringWorkflowStatus`, `ReservationWorkflowStatus`, `ServerLogLevel`, `TeamDepartment`, `TeamPayload` (+258 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 525 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `gallery.controller.ts` to `reservation.controller.ts`, `worker.ts`, `security.middleware.ts`, `CatalogValidationError`, `team.controller.ts`, `settings.controller.ts`, `package.json`, `server.ts`, `catalogError`, `routes/index.ts`, `media.controller.ts`, `menu.controller.ts`, `security.middleware.test.ts`, `category.controller.ts`?**
  _High betweenness centrality (0.317) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `reservations.component.ts`, `AdminSchoolComponent`, `site-settings.service.ts`, `cms.component.ts`, `admin-data.service.ts`, `@angular/common`, `package.json`, `restaurant.service.ts`, `app.routes.ts`, `reservation.service.ts`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `reservations.component.ts`, `AdminSchoolComponent`, `site-settings.service.ts`, `cms.component.ts`, `admin-data.service.ts`, `package.json`, `@angular/core`, `restaurant.service.ts`, `app.routes.ts`, `reservation.service.ts`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `CateringWorkflowStatus`, `ReservationWorkflowStatus`, `ServerLogLevel` to the rest of the system?**
  _263 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06663141195134849 - nodes in this community are weakly interconnected._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.07890070921985816 - nodes in this community are weakly interconnected._