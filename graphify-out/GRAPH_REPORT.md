# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1252 nodes · 2640 edges · 80 communities (49 shown, 31 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4d16dee`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AdminDataService
- reservation.controller.ts
- AdminSchoolComponent
- CatalogValidationError
- options
- CMSComponent
- AdminSettingsComponent
- admin-data.service.ts
- routes/index.ts
- RestaurantService
- validateUuid
- site-settings.service.ts
- school.controller.ts
- AdminComponent
- @angular/core
- AdminGalleryComponent
- media.controller.ts
- package.json
- dependencies
- @angular/common
- menu.controller.ts
- restaurant.service.ts
- AdminEquipeComponent
- AdminRestaurantComponent
- AdminTraiteurComponent
- compilerOptions
- GalleryComponent
- team.controller.ts
- admin.component.ts
- ReservationsComponent
- SiteSettingsService
- devDependencies
- menu-catalog.ts
- StockComponent
- catalogError
- SchoolComponent
- AdminWinesComponent
- worker.ts
- security.middleware.ts
- cms.component.ts
- SeoService
- AdminCategoriesComponent
- HeaderComponent
- compilerOptions
- reservation.service.ts
- DashboardComponent
- scripts
- ref_node_path
- ref_node_test
- server.ts
- ref_node_assert
- AdminFinanceComponent
- ReservationComponent
- AnalyticsComponent
- MenuComponent
- ParallaxDirective
- ref_node_fs
- HomeComponent
- CateringFormComponent
- security.middleware.test.ts
- prepare-preview.mjs
- DishDetailComponent
- production-shell.test.ts
- smoke-production.sh
- TraiteurComponent
- admin-gallery.test.ts
- catering-flow.test.ts
- database-security.test.ts
- gallery-experience.test.ts
- media-library.test.ts
- reservation-flow.test.ts
- school-catalog.test.ts
- school-management.test.ts
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
- `SessionDraft` --references--> `SchoolSessionStatus`  [EXTRACTED]
  src/app/pages/admin/school/school.component.ts → src/app/core/services/admin-data.service.ts
- `deleteCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/category.controller.ts → src/controllers/catalog.validation.ts
- `createGalleryImage()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts
- `optionalBoolean()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/inventory.controller.ts → src/controllers/catalog.validation.ts
- `optionalQuantity()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/inventory.controller.ts → src/controllers/catalog.validation.ts

## Import Cycles
- None detected.

## Communities (80 total, 31 thin omitted)

### Community 1 - "reservation.controller.ts"
Cohesion: 0.08
Nodes (48): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+40 more)

### Community 2 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (11): SchoolLevel, SchoolProgram, SchoolProgramStatus, SchoolRegistration, SchoolRegistrationStatus, SchoolSession, SchoolSessionStatus, AdminSchoolComponent (+3 more)

### Community 3 - "CatalogValidationError"
Cohesion: 0.11
Nodes (41): CatalogValidationError, isRecord(), optionalImageUrl(), optionalPrice(), optionalText(), requiredText(), requireKnownFields(), addExpense() (+33 more)

### Community 4 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 5 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 6 - "AdminSettingsComponent"
Cohesion: 0.09
Nodes (5): OpeningDay, WeekdayKey, WeeklyHours, AdminSettingsComponent, Component

### Community 7 - "admin-data.service.ts"
Cohesion: 0.08
Nodes (28): @angular/forms, adminAuthGuard(), BrandSettings, DashboardOverview, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES (+20 more)

### Community 8 - "routes/index.ts"
Cohesion: 0.10
Nodes (31): express, @supabase/supabase-js, supabase, CATERING_STATUS_LABELS, compactActivities(), CORE_SETTINGS_FIELDS, formatActivity(), getDashboardOverview() (+23 more)

### Community 10 - "validateUuid"
Cohesion: 0.13
Nodes (34): optionalOrder(), validateUuid(), CATEGORY_FIELDS, CategoryPayload, createCategory(), deleteCategory(), getCategories(), updateCategory() (+26 more)

### Community 11 - "site-settings.service.ts"
Cohesion: 0.10
Nodes (15): @angular/platform-browser, rxjs, routes, AppComponent, Component, authInterceptor(), SeoConfig, DEFAULT_SETTINGS (+7 more)

### Community 12 - "school.controller.ts"
Cohesion: 0.13
Nodes (29): cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolRegistration(), createSchoolSession(), deleteSchoolSession(), getAdminSchoolSessions() (+21 more)

### Community 13 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 14 - "@angular/core"
Cohesion: 0.12
Nodes (13): @angular/core, NotFoundComponent, Component, CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent (+5 more)

### Community 15 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 16 - "media.controller.ts"
Cohesion: 0.13
Nodes (24): collectMediaUsage(), createMediaAsset(), createMediaTag(), deleteMediaAsset(), downloadMediaAsset(), EXTENSIONS, getMediaAssets(), getMediaAssetUsage() (+16 more)

### Community 17 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+14 more)

### Community 18 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 19 - "@angular/common"
Cohesion: 0.16
Nodes (11): @angular/common, @angular/router, Dish, DailySpecialComponent, Component, DishCardComponent, Component, RevealOnScrollDirective (+3 more)

### Community 20 - "menu.controller.ts"
Cohesion: 0.24
Nodes (21): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getParam(), isRecord(), MENU_FIELDS, MenuPayload, optionalBoolean() (+13 more)

### Community 21 - "restaurant.service.ts"
Cohesion: 0.15
Nodes (12): GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine, AboutComponent, Component (+4 more)

### Community 22 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 23 - "AdminRestaurantComponent"
Cohesion: 0.20
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 24 - "AdminTraiteurComponent"
Cohesion: 0.21
Nodes (6): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, LABELS, STATUSES, Component

### Community 25 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 26 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 27 - "team.controller.ts"
Cohesion: 0.19
Nodes (16): createTeamMember(), deleteTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment(), TEAM_DEPARTMENTS (+8 more)

### Community 28 - "admin.component.ts"
Cohesion: 0.15
Nodes (9): ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem, AdminSearchItem, EMPTY_OVERVIEW, AdminLoginComponent, Component, supabaseClient (+1 more)

### Community 29 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 30 - "SiteSettingsService"
Cohesion: 0.18
Nodes (6): MediaReference, SiteMediaSlot, SiteSettingsService, Injectable, STATUS_CLASSES, STATUS_LABELS

### Community 31 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 32 - "menu-catalog.ts"
Cohesion: 0.24
Nodes (11): CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters, normalizeSearch() (+3 more)

### Community 33 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

### Community 34 - "catalogError"
Cohesion: 0.31
Nodes (12): catalogError(), createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload, optionalBoolean(), optionalQuantity() (+4 more)

### Community 35 - "SchoolComponent"
Cohesion: 0.21
Nodes (3): SchoolSession, SchoolComponent, Component

### Community 37 - "worker.ts"
Cohesion: 0.22
Nodes (10): ref_cloudflare_node, @cloudflare/workers-types, staticAssetSecurityHeaders, router, apiHandler, app, Env, fetch() (+2 more)

### Community 38 - "security.middleware.ts"
Cohesion: 0.18
Nodes (8): cors, express-rate-limit, helmet, allowedOrigins, configuredOrigins, contentSecurityPolicy, corsOptions, publicWriteRateLimiter

### Community 39 - "cms.component.ts"
Cohesion: 0.18
Nodes (10): @uppy/angular, @uppy/core, @uppy/dashboard, @uppy/locales, MediaTag, CATEGORIES, EditDraft, GALLERY_CATEGORIES (+2 more)

### Community 42 - "HeaderComponent"
Cohesion: 0.27
Nodes (3): HeaderComponent, Component, HostListener

### Community 43 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 44 - "reservation.service.ts"
Cohesion: 0.31
Nodes (5): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable

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

### Community 50 - "ref_node_assert"
Cohesion: 0.25
Nodes (3): ref_node_assert, root, root

### Community 55 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 56 - "ref_node_fs"
Cohesion: 0.33
Nodes (3): ref_node_fs, root, root

### Community 60 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 63 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **262 isolated node(s):** `ReservationWorkflowStatus`, `ServerLogLevel`, `CategoryPayload`, `WinePayload`, `SchoolPayload` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 525 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `catalogError`, `CatalogValidationError`, `worker.ts`, `security.middleware.ts`, `security.middleware.test.ts`, `validateUuid`, `school.controller.ts`, `media.controller.ts`, `package.json`, `server.ts`, `menu.controller.ts`, `team.controller.ts`?**
  _High betweenness centrality (0.321) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `AdminSchoolComponent`, `admin-data.service.ts`, `cms.component.ts`, `site-settings.service.ts`, `reservation.service.ts`, `package.json`, `@angular/common`, `restaurant.service.ts`, `AdminTraiteurComponent`, `admin.component.ts`, `SiteSettingsService`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `AdminSchoolComponent`, `admin-data.service.ts`, `cms.component.ts`, `site-settings.service.ts`, `reservation.service.ts`, `@angular/core`, `package.json`, `restaurant.service.ts`, `AdminTraiteurComponent`, `SiteSettingsService`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **What connects `ReservationWorkflowStatus`, `ServerLogLevel`, `CategoryPayload` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07686932215234102 - nodes in this community are weakly interconnected._
- **Should `AdminSchoolComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.07676767676767676 - nodes in this community are weakly interconnected._