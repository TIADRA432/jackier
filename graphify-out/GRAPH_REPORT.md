# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1244 nodes · 2618 edges · 78 communities (49 shown, 29 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9b1198d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
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
- @angular/core
- admin-data.service.ts
- pages/traiteur/traiteur.component.ts
- AdminComponent
- settings.controller.ts
- AdminGalleryComponent
- package.json
- dependencies
- catalogError
- media.controller.ts
- menu.controller.ts
- @angular/common
- restaurant.service.ts
- AdminEquipeComponent
- menu.component.ts
- admin.component.ts
- AdminRestaurantComponent
- AdminTraiteurComponent
- site-settings.service.ts
- compilerOptions
- GalleryComponent
- team.controller.ts
- ReservationsComponent
- devDependencies
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
- server.ts
- ref_node_assert
- ref_node_fs
- AdminFinanceComponent
- RevealOnScrollDirective
- AnalyticsComponent
- MenuComponent
- ReservationComponent
- ParallaxDirective
- ref_node_test
- HomeComponent
- security.middleware.test.ts
- prepare-preview.mjs
- DishDetailComponent
- production-shell.test.ts
- smoke-production.sh
- admin-access.test.ts
- content-authenticity.test.ts
- dashboard-readiness.test.ts
- database-security.test.ts
- media-library.test.ts
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

## Communities (78 total, 29 thin omitted)

### Community 1 - "reservation.controller.ts"
Cohesion: 0.07
Nodes (49): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+41 more)

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

### Community 10 - "@angular/core"
Cohesion: 0.12
Nodes (17): @angular/core, @angular/router, routes, adminAuthGuard(), DashboardOverview, EMPTY_OVERVIEW, EMPTY_OVERVIEW, DEPARTMENTS (+9 more)

### Community 11 - "admin-data.service.ts"
Cohesion: 0.10
Nodes (21): @angular/forms, BrandSettings, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuCategory, MenuItemCategory (+13 more)

### Community 12 - "pages/traiteur/traiteur.component.ts"
Cohesion: 0.08
Nodes (14): TraiteurComponent, Component, CateringCtaComponent, Component, CateringFormComponent, Component, CateringGalleryComponent, Component (+6 more)

### Community 13 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 14 - "settings.controller.ts"
Cohesion: 0.14
Nodes (25): isRecord(), requireKnownFields(), BRAND_FIELDS, getLogs(), getSettings(), MEDIA_REFERENCE_FIELDS, MediaReference, OPENING_DAY_FIELDS (+17 more)

### Community 15 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 16 - "package.json"
Cohesion: 0.08
Nodes (23): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+15 more)

### Community 17 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 18 - "catalogError"
Cohesion: 0.19
Nodes (21): catalogError(), validateUuid(), deleteCategory(), createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload (+13 more)

### Community 19 - "media.controller.ts"
Cohesion: 0.14
Nodes (21): createMediaAsset(), createMediaTag(), downloadMediaAsset(), EXTENSIONS, getMediaAssets(), getMediaTags(), MEDIA_CATEGORIES, MEDIA_FIELDS (+13 more)

### Community 20 - "menu.controller.ts"
Cohesion: 0.24
Nodes (21): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getParam(), isRecord(), MENU_FIELDS, MenuPayload, optionalBoolean() (+13 more)

### Community 21 - "@angular/common"
Cohesion: 0.16
Nodes (11): @angular/common, @angular/platform-browser, rxjs, AppComponent, Component, authInterceptor(), SeoConfig, ContactComponent (+3 more)

### Community 22 - "restaurant.service.ts"
Cohesion: 0.15
Nodes (12): GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine, AboutComponent, Component (+4 more)

### Community 23 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 24 - "menu.component.ts"
Cohesion: 0.17
Nodes (14): Dish, CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters (+6 more)

### Community 25 - "admin.component.ts"
Cohesion: 0.14
Nodes (12): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable, ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem (+4 more)

### Community 26 - "AdminRestaurantComponent"
Cohesion: 0.20
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 27 - "AdminTraiteurComponent"
Cohesion: 0.21
Nodes (6): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, LABELS, STATUSES, Component

### Community 28 - "site-settings.service.ts"
Cohesion: 0.13
Nodes (8): DEFAULT_SETTINGS, FALLBACK_LOGO, SiteSettingsService, Injectable, STATUS_CLASSES, STATUS_LABELS, FooterComponent, Component

### Community 29 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 30 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 31 - "team.controller.ts"
Cohesion: 0.21
Nodes (15): createTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment(), TEAM_DEPARTMENTS, TEAM_FIELDS (+7 more)

### Community 32 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 33 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 34 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

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

### Community 45 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 46 - "ref_node_path"
Cohesion: 0.22
Nodes (4): ref_node_path, root, root, root

### Community 47 - "server.ts"
Cohesion: 0.22
Nodes (8): ref_path, ref_url, app, __dirname, distPath, __filename, PORT, configureSecurity()

### Community 48 - "ref_node_assert"
Cohesion: 0.25
Nodes (3): ref_node_assert, root, root

### Community 49 - "ref_node_fs"
Cohesion: 0.25
Nodes (3): ref_node_fs, root, root

### Community 51 - "RevealOnScrollDirective"
Cohesion: 0.29
Nodes (4): RevealOnScrollDirective, RevealVariant, Directive, Input

### Community 55 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 56 - "ref_node_test"
Cohesion: 0.33
Nodes (3): ref_node_test, root, root

### Community 59 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 62 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **261 isolated node(s):** `ServerLogLevel`, `TeamDraft`, `GalleryDraft`, `DashboardReadinessCheck`, `MenuItemCategory` (+256 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 523 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `worker.ts`, `security.middleware.ts`, `wine.controller.ts`, `CatalogValidationError`, `settings.controller.ts`, `server.ts`, `package.json`, `catalogError`, `media.controller.ts`, `menu.controller.ts`, `security.middleware.test.ts`, `team.controller.ts`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `AdminSchoolComponent`, `cms.component.ts`, `admin-data.service.ts`, `pages/traiteur/traiteur.component.ts`, `package.json`, `RevealOnScrollDirective`, `@angular/common`, `restaurant.service.ts`, `menu.component.ts`, `admin.component.ts`, `AdminTraiteurComponent`, `site-settings.service.ts`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `AdminSchoolComponent`, `cms.component.ts`, `@angular/core`, `admin-data.service.ts`, `package.json`, `RevealOnScrollDirective`, `restaurant.service.ts`, `menu.component.ts`, `admin.component.ts`, `AdminTraiteurComponent`, `site-settings.service.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `ServerLogLevel`, `TeamDraft`, `GalleryDraft` to the rest of the system?**
  _261 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06936026936026936 - nodes in this community are weakly interconnected._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.07908163265306123 - nodes in this community are weakly interconnected._