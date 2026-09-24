# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1239 nodes · 2602 edges · 61 communities (45 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29e5b09d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_node_assert
- menu.controller.ts
- AdminSettingsComponent
- AdminDataService
- CMSComponent
- AdminSchoolComponent
- options
- RestaurantService
- @angular/common
- wine.controller.ts
- admin-data.service.ts
- site-settings.service.ts
- CatalogValidationError
- AdminComponent
- settings.controller.ts
- routes/index.ts
- @angular/core
- AdminGalleryComponent
- package.json
- dependencies
- gallery.controller.ts
- catalogError
- media.controller.ts
- AdminEquipeComponent
- AdminRestaurantComponent
- reservation.service.ts
- compilerOptions
- GalleryComponent
- AdminTraiteurComponent
- team.controller.ts
- ReservationsComponent
- devDependencies
- menu-catalog.ts
- StockComponent
- SchoolComponent
- AdminWinesComponent
- security.middleware.ts
- SeoService
- SiteSettingsService
- AdminCategoriesComponent
- HeaderComponent
- worker.ts
- server.ts
- compilerOptions
- DashboardComponent
- scripts
- about.component.ts
- AdminFinanceComponent
- express
- AnalyticsComponent
- MenuComponent
- ReservationComponent
- ParallaxDirective
- admin.component.ts
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

## Communities (61 total, 16 thin omitted)

### Community 0 - "ref_node_assert"
Cohesion: 0.05
Nodes (30): ref_node_assert, ref_node_child_process, ref_node_fs, ref_node_path, ref_node_test, ref_node_url, previewConfiguration(), root (+22 more)

### Community 1 - "menu.controller.ts"
Cohesion: 0.06
Nodes (67): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+59 more)

### Community 2 - "AdminSettingsComponent"
Cohesion: 0.07
Nodes (15): BrandSettings, MediaReference, OpeningDay, PublicSettings, SiteMediaSlot, TodaySettings, WeekdayKey, WeeklyHours (+7 more)

### Community 4 - "CMSComponent"
Cohesion: 0.07
Nodes (15): @uppy/angular, @uppy/core, @uppy/dashboard, @uppy/locales, MediaAsset, MediaCategory, MediaTag, MediaUsage (+7 more)

### Community 5 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (11): SchoolLevel, SchoolProgram, SchoolProgramStatus, SchoolRegistration, SchoolRegistrationStatus, SchoolSession, SchoolSessionStatus, AdminSchoolComponent (+3 more)

### Community 6 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 8 - "@angular/common"
Cohesion: 0.12
Nodes (18): @angular/common, Dish, GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine (+10 more)

### Community 9 - "wine.controller.ts"
Cohesion: 0.15
Nodes (29): optionalImageUrl(), optionalOrder(), optionalPrice(), optionalText(), requiredText(), CATEGORY_FIELDS, CategoryPayload, createCategory() (+21 more)

### Community 10 - "admin-data.service.ts"
Cohesion: 0.10
Nodes (21): @angular/forms, adminAuthGuard(), DashboardOverview, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuCategory (+13 more)

### Community 11 - "site-settings.service.ts"
Cohesion: 0.11
Nodes (16): @angular/platform-browser, @angular/router, rxjs, routes, AppComponent, Component, authInterceptor(), SeoConfig (+8 more)

### Community 12 - "CatalogValidationError"
Cohesion: 0.17
Nodes (27): CatalogValidationError, cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolProgram(), createSchoolRegistration(), createSchoolSession() (+19 more)

### Community 13 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 14 - "settings.controller.ts"
Cohesion: 0.14
Nodes (25): isRecord(), requireKnownFields(), BRAND_FIELDS, getLogs(), getSettings(), MEDIA_REFERENCE_FIELDS, MediaReference, OPENING_DAY_FIELDS (+17 more)

### Community 15 - "routes/index.ts"
Cohesion: 0.13
Nodes (24): getCategories(), addExpense(), DAILY_CLOSE_FIELDS, dailyClose(), EXPENSE_FIELDS, getExpenses(), getReports(), validateDailyClosePayload() (+16 more)

### Community 16 - "@angular/core"
Cohesion: 0.12
Nodes (13): @angular/core, NotFoundComponent, Component, CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent (+5 more)

### Community 17 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 18 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+14 more)

### Community 19 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 20 - "gallery.controller.ts"
Cohesion: 0.14
Nodes (18): @supabase/supabase-js, supabase, createGalleryImage(), deleteGalleryImage(), GALLERY_CATEGORIES, GALLERY_FIELDS, GalleryCategory, GalleryRow (+10 more)

### Community 21 - "catalogError"
Cohesion: 0.19
Nodes (21): catalogError(), validateUuid(), deleteCategory(), createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload (+13 more)

### Community 22 - "media.controller.ts"
Cohesion: 0.14
Nodes (21): createMediaAsset(), createMediaTag(), downloadMediaAsset(), EXTENSIONS, getMediaAssets(), getMediaTags(), MEDIA_CATEGORIES, MEDIA_FIELDS (+13 more)

### Community 23 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 24 - "AdminRestaurantComponent"
Cohesion: 0.20
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 25 - "reservation.service.ts"
Cohesion: 0.16
Nodes (9): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable, AdminLoginComponent, Component, supabaseClient (+1 more)

### Community 26 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 27 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 28 - "AdminTraiteurComponent"
Cohesion: 0.26
Nodes (4): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, Component

### Community 29 - "team.controller.ts"
Cohesion: 0.21
Nodes (15): createTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment(), TEAM_DEPARTMENTS, TEAM_FIELDS (+7 more)

### Community 30 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

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

### Community 36 - "security.middleware.ts"
Cohesion: 0.18
Nodes (8): cors, express-rate-limit, helmet, allowedOrigins, configuredOrigins, contentSecurityPolicy, corsOptions, publicWriteRateLimiter

### Community 38 - "SiteSettingsService"
Cohesion: 0.20
Nodes (6): SiteSettingsService, Injectable, STATUS_CLASSES, STATUS_LABELS, LABELS, STATUSES

### Community 40 - "HeaderComponent"
Cohesion: 0.27
Nodes (3): HeaderComponent, Component, HostListener

### Community 41 - "worker.ts"
Cohesion: 0.24
Nodes (9): ref_cloudflare_node, @cloudflare/workers-types, staticAssetSecurityHeaders, apiHandler, app, Env, fetch(), rewritePublicOrigin() (+1 more)

### Community 42 - "server.ts"
Cohesion: 0.20
Nodes (9): ref_path, ref_url, app, __dirname, distPath, __filename, PORT, configureSecurity() (+1 more)

### Community 43 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 45 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 46 - "about.component.ts"
Cohesion: 0.25
Nodes (4): AboutComponent, Component, TeamGridComponent, Component

### Community 48 - "express"
Cohesion: 0.38
Nodes (4): express, ref_node_events, ref_node_net, errorHandler()

### Community 52 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 53 - "admin.component.ts"
Cohesion: 0.33
Nodes (5): ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem, AdminSearchItem, EMPTY_OVERVIEW

### Community 57 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **260 isolated node(s):** `MenuPayload`, `ServerLogLevel`, `DashboardReadinessCheck`, `MenuItemCategory`, `ReservationStatus` (+255 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 521 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `express` to `menu.controller.ts`, `security.middleware.ts`, `wine.controller.ts`, `server.ts`, `worker.ts`, `CatalogValidationError`, `settings.controller.ts`, `routes/index.ts`, `package.json`, `gallery.controller.ts`, `catalogError`, `media.controller.ts`, `team.controller.ts`?**
  _High betweenness centrality (0.274) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `AdminSettingsComponent`, `CMSComponent`, `AdminSchoolComponent`, `SiteSettingsService`, `@angular/common`, `admin-data.service.ts`, `site-settings.service.ts`, `about.component.ts`, `package.json`, `admin.component.ts`, `reservation.service.ts`?**
  _High betweenness centrality (0.202) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `AdminSettingsComponent`, `CMSComponent`, `AdminSchoolComponent`, `SiteSettingsService`, `admin-data.service.ts`, `site-settings.service.ts`, `about.component.ts`, `@angular/core`, `package.json`, `reservation.service.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `MenuPayload`, `ServerLogLevel`, `DashboardReadinessCheck` to the rest of the system?**
  _260 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_node_assert` be split into smaller, more focused modules?**
  _Cohesion score 0.05052631578947368 - nodes in this community are weakly interconnected._
- **Should `menu.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055534987041836355 - nodes in this community are weakly interconnected._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.0655367231638418 - nodes in this community are weakly interconnected._