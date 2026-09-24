# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1242 nodes · 2611 edges · 81 communities (48 shown, 33 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5c110f6a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- reservation.controller.ts
- AdminDataService
- routes/index.ts
- options
- CMSComponent
- AdminSettingsComponent
- AdminSchoolComponent
- RestaurantService
- CatalogValidationError
- admin-data.service.ts
- @angular/common
- school.controller.ts
- site-settings.service.ts
- AdminComponent
- wine.controller.ts
- validateUuid
- AdminGalleryComponent
- app.routes.ts
- SiteSettingsService
- package.json
- dependencies
- @angular/core
- menu.controller.ts
- AdminEquipeComponent
- AdminRestaurantComponent
- catalogError
- compilerOptions
- GalleryComponent
- AdminTraiteurComponent
- ReservationsComponent
- reservation.service.ts
- devDependencies
- menu-catalog.ts
- StockComponent
- SchoolComponent
- AdminWinesComponent
- inventory.controller.ts
- worker.ts
- security.middleware.ts
- cms.component.ts
- SeoService
- AdminCategoriesComponent
- HeaderComponent
- compilerOptions
- DashboardComponent
- scripts
- server.ts
- ref_node_assert
- AdminFinanceComponent
- ref_node_path
- ref_node_test
- AnalyticsComponent
- MenuComponent
- ReservationComponent
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
- TeamGridComponent
- reservations.component.ts
- content-authenticity.test.ts
- database-security.test.ts
- gallery-experience.test.ts
- live-visitor-experience.test.ts
- media-library.test.ts
- reservation-flow.test.ts
- security-logging.test.ts
- seo.test.ts
- settings-control-center.test.ts
- staging-environment.test.ts
- team-management.test.ts
- wine-catalog.test.ts
- workflow-transitions.test.ts
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
- `AdminSchoolComponent` --references--> `SchoolLevel`  [EXTRACTED]
  src/app/pages/admin/school/school.component.ts → src/app/core/services/admin-data.service.ts
- `deleteCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/category.controller.ts → src/controllers/catalog.validation.ts
- `createGalleryImage()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts

## Import Cycles
- None detected.

## Communities (81 total, 33 thin omitted)

### Community 0 - "reservation.controller.ts"
Cohesion: 0.07
Nodes (49): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+41 more)

### Community 2 - "routes/index.ts"
Cohesion: 0.07
Nodes (40): express, @supabase/supabase-js, supabase, addExpense(), DAILY_CLOSE_FIELDS, dailyClose(), EXPENSE_FIELDS, getExpenses() (+32 more)

### Community 3 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 4 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 5 - "AdminSettingsComponent"
Cohesion: 0.09
Nodes (5): OpeningDay, WeekdayKey, WeeklyHours, AdminSettingsComponent, Component

### Community 6 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (6): SchoolProgram, SchoolRegistrationStatus, SchoolSessionStatus, AdminSchoolComponent, SessionDraft, Component

### Community 8 - "CatalogValidationError"
Cohesion: 0.11
Nodes (36): CatalogValidationError, isRecord(), optionalPrice(), requireKnownFields(), validateDailyClosePayload(), validateExpensePayload(), createMediaAsset(), setAssetTags() (+28 more)

### Community 9 - "admin-data.service.ts"
Cohesion: 0.09
Nodes (25): @angular/forms, DashboardOverview, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuCategory, MenuItemCategory (+17 more)

### Community 10 - "@angular/common"
Cohesion: 0.12
Nodes (18): @angular/common, Dish, GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine (+10 more)

### Community 11 - "school.controller.ts"
Cohesion: 0.13
Nodes (31): cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolRegistration(), createSchoolSession(), deleteSchoolSession(), getAdminSchoolSessions() (+23 more)

### Community 12 - "site-settings.service.ts"
Cohesion: 0.10
Nodes (15): @angular/platform-browser, rxjs, routes, AppComponent, Component, authInterceptor(), SeoConfig, DEFAULT_SETTINGS (+7 more)

### Community 13 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 14 - "wine.controller.ts"
Cohesion: 0.17
Nodes (22): optionalImageUrl(), optionalOrder(), optionalText(), requiredText(), createGalleryImage(), GALLERY_CATEGORIES, GALLERY_FIELDS, GalleryCategory (+14 more)

### Community 15 - "validateUuid"
Cohesion: 0.14
Nodes (24): validateUuid(), CATEGORY_FIELDS, CategoryPayload, createCategory(), deleteCategory(), getCategories(), updateCategory(), validateCategoryPayload() (+16 more)

### Community 16 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 17 - "app.routes.ts"
Cohesion: 0.12
Nodes (13): @angular/router, adminAuthGuard(), AboutComponent, Component, EMPTY_OVERVIEW, DEPARTMENTS, TeamDraft, GALLERY_CATEGORIES (+5 more)

### Community 18 - "SiteSettingsService"
Cohesion: 0.10
Nodes (14): BrandSettings, MediaReference, PublicSettings, SiteMediaSlot, TodaySettings, SiteSettingsService, Injectable, EMPTY_SETTINGS (+6 more)

### Community 19 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+14 more)

### Community 20 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 21 - "@angular/core"
Cohesion: 0.14
Nodes (11): @angular/core, CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent, Component, CateringProcessComponent (+3 more)

### Community 22 - "menu.controller.ts"
Cohesion: 0.23
Nodes (20): createMenuItem(), deleteMenuItem(), getParam(), isRecord(), MENU_FIELDS, MenuPayload, optionalBoolean(), optionalImageUrl() (+12 more)

### Community 23 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 24 - "AdminRestaurantComponent"
Cohesion: 0.20
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 25 - "catalogError"
Cohesion: 0.21
Nodes (17): catalogError(), createTeamMember(), deleteTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment() (+9 more)

### Community 26 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 27 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 28 - "AdminTraiteurComponent"
Cohesion: 0.26
Nodes (4): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, Component

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

### Community 36 - "inventory.controller.ts"
Cohesion: 0.29
Nodes (11): createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload, optionalBoolean(), optionalQuantity(), toClient() (+3 more)

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

### Community 45 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 46 - "server.ts"
Cohesion: 0.22
Nodes (8): ref_path, ref_url, app, __dirname, distPath, __filename, PORT, configureSecurity()

### Community 47 - "ref_node_assert"
Cohesion: 0.25
Nodes (3): ref_node_assert, root, root

### Community 49 - "ref_node_path"
Cohesion: 0.29
Nodes (3): ref_node_path, root, root

### Community 50 - "ref_node_test"
Cohesion: 0.29
Nodes (3): ref_node_test, root, root

### Community 54 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 55 - "ref_node_fs"
Cohesion: 0.33
Nodes (3): ref_node_fs, root, root

### Community 59 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 62 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **260 isolated node(s):** `ServerLogLevel`, `Review`, `RevealVariant`, `SchoolPayload`, `GalleryCategory` (+255 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 522 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `inventory.controller.ts`, `worker.ts`, `security.middleware.ts`, `CatalogValidationError`, `school.controller.ts`, `server.ts`, `validateUuid`, `wine.controller.ts`, `package.json`, `menu.controller.ts`, `catalogError`, `security.middleware.test.ts`?**
  _High betweenness centrality (0.283) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `reservations.component.ts`, `cms.component.ts`, `admin-data.service.ts`, `@angular/common`, `site-settings.service.ts`, `app.routes.ts`, `SiteSettingsService`, `package.json`, `reservation.service.ts`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `reservations.component.ts`, `cms.component.ts`, `admin-data.service.ts`, `site-settings.service.ts`, `app.routes.ts`, `SiteSettingsService`, `package.json`, `@angular/core`, `reservation.service.ts`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **What connects `ServerLogLevel`, `Review`, `RevealVariant` to the rest of the system?**
  _260 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06818181818181818 - nodes in this community are weakly interconnected._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `routes/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07493061979648474 - nodes in this community are weakly interconnected._