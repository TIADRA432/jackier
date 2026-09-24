# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1251 nodes · 2639 edges · 78 communities (48 shown, 30 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33cc05f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- reservation.controller.ts
- admin-data.service.ts
- AdminSettingsComponent
- AdminDataService
- routes/index.ts
- options
- CMSComponent
- RestaurantService
- CatalogValidationError
- @angular/core
- school.controller.ts
- restaurant.service.ts
- pages/traiteur/traiteur.component.ts
- app.component.ts
- AdminComponent
- wine.controller.ts
- validateUuid
- AdminGalleryComponent
- package.json
- dependencies
- menu.controller.ts
- security.middleware.ts
- AdminEquipeComponent
- AdminRestaurantComponent
- site-settings.service.ts
- catalogError
- compilerOptions
- @angular/common
- GalleryComponent
- AdminTraiteurComponent
- ReservationsComponent
- StockComponent
- devDependencies
- AdminWinesComponent
- SchoolComponent
- AdminCategoriesComponent
- inventory.controller.ts
- cms.component.ts
- SeoService
- SiteSettingsService
- HeaderComponent
- worker.ts
- compilerOptions
- DashboardComponent
- scripts
- ref_node_path
- ref_node_test
- ref_node_fs
- ReservationComponent
- AnalyticsComponent
- MenuComponent
- ParallaxDirective
- ref_node_assert
- HomeComponent
- prepare-preview.mjs
- DishDetailComponent
- production-shell.test.ts
- security.middleware.test.ts
- smoke-production.sh
- TraiteurComponent
- TeamGridComponent
- AboutComponent
- AdminLoginComponent
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
- `SessionDraft` --references--> `SchoolSessionStatus`  [EXTRACTED]
  src/app/pages/admin/school/school.component.ts → src/app/core/services/admin-data.service.ts
- `deleteCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/category.controller.ts → src/controllers/catalog.validation.ts
- `createGalleryImage()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts
- `validateCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts
- `validateGalleryPayload()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts

## Import Cycles
- None detected.

## Communities (78 total, 30 thin omitted)

### Community 0 - "reservation.controller.ts"
Cohesion: 0.07
Nodes (54): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+46 more)

### Community 1 - "admin-data.service.ts"
Cohesion: 0.06
Nodes (18): DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuItemCategory, SchoolLevel, SchoolProgram, SchoolProgramStatus (+10 more)

### Community 2 - "AdminSettingsComponent"
Cohesion: 0.07
Nodes (15): BrandSettings, MediaReference, OpeningDay, PublicSettings, SiteMediaSlot, TodaySettings, WeekdayKey, WeeklyHours (+7 more)

### Community 4 - "routes/index.ts"
Cohesion: 0.07
Nodes (40): express, @supabase/supabase-js, supabase, addExpense(), DAILY_CLOSE_FIELDS, dailyClose(), EXPENSE_FIELDS, getExpenses() (+32 more)

### Community 5 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 6 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 8 - "CatalogValidationError"
Cohesion: 0.11
Nodes (36): CatalogValidationError, isRecord(), optionalPrice(), requireKnownFields(), validateDailyClosePayload(), validateExpensePayload(), createMediaAsset(), setAssetTags() (+28 more)

### Community 9 - "@angular/core"
Cohesion: 0.11
Nodes (20): @angular/core, @angular/forms, @angular/router, adminAuthGuard(), DashboardOverview, ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem (+12 more)

### Community 10 - "school.controller.ts"
Cohesion: 0.13
Nodes (31): cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolRegistration(), createSchoolSession(), deleteSchoolSession(), getAdminSchoolSessions() (+23 more)

### Community 11 - "restaurant.service.ts"
Cohesion: 0.14
Nodes (19): Dish, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine, CategoryFilter, categoryFilters() (+11 more)

### Community 12 - "pages/traiteur/traiteur.component.ts"
Cohesion: 0.09
Nodes (12): CateringCtaComponent, Component, CateringFormComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent, Component (+4 more)

### Community 13 - "app.component.ts"
Cohesion: 0.11
Nodes (13): @angular/platform-browser, rxjs, routes, AppComponent, Component, authInterceptor(), SeoConfig, ContactComponent (+5 more)

### Community 14 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 15 - "wine.controller.ts"
Cohesion: 0.17
Nodes (22): optionalImageUrl(), optionalOrder(), optionalText(), requiredText(), createGalleryImage(), GALLERY_CATEGORIES, GALLERY_FIELDS, GalleryCategory (+14 more)

### Community 16 - "validateUuid"
Cohesion: 0.14
Nodes (24): validateUuid(), CATEGORY_FIELDS, CategoryPayload, createCategory(), deleteCategory(), getCategories(), updateCategory(), validateCategoryPayload() (+16 more)

### Community 17 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 18 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+14 more)

### Community 19 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 20 - "menu.controller.ts"
Cohesion: 0.24
Nodes (21): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getParam(), isRecord(), MENU_FIELDS, MenuPayload, optionalBoolean() (+13 more)

### Community 21 - "security.middleware.ts"
Cohesion: 0.10
Nodes (17): cors, express-rate-limit, helmet, ref_path, ref_url, app, __dirname, distPath (+9 more)

### Community 22 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 23 - "AdminRestaurantComponent"
Cohesion: 0.19
Nodes (4): MenuItem, MenuItemPayload, AdminRestaurantComponent, Component

### Community 24 - "site-settings.service.ts"
Cohesion: 0.16
Nodes (9): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable, DEFAULT_SETTINGS, FALLBACK_LOGO, supabaseClient (+1 more)

### Community 25 - "catalogError"
Cohesion: 0.21
Nodes (17): catalogError(), createTeamMember(), deleteTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment() (+9 more)

### Community 26 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 27 - "@angular/common"
Cohesion: 0.16
Nodes (10): @angular/common, GalleryImage, CATEGORY_LABELS, LAYOUT_PATTERN, DailySpecialComponent, Component, RevealOnScrollDirective, RevealVariant (+2 more)

### Community 28 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 29 - "AdminTraiteurComponent"
Cohesion: 0.26
Nodes (4): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, Component

### Community 30 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 31 - "StockComponent"
Cohesion: 0.20
Nodes (5): InventoryItem, emptyDraft(), InventoryDraft, StockComponent, Component

### Community 32 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 33 - "AdminWinesComponent"
Cohesion: 0.23
Nodes (3): WineItem, AdminWinesComponent, Component

### Community 34 - "SchoolComponent"
Cohesion: 0.21
Nodes (3): SchoolSession, SchoolComponent, Component

### Community 35 - "AdminCategoriesComponent"
Cohesion: 0.24
Nodes (3): MenuCategory, AdminCategoriesComponent, Component

### Community 36 - "inventory.controller.ts"
Cohesion: 0.29
Nodes (11): createInventoryItem(), deleteInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload, optionalBoolean(), optionalQuantity(), toClient() (+3 more)

### Community 37 - "cms.component.ts"
Cohesion: 0.18
Nodes (10): @uppy/angular, @uppy/core, @uppy/dashboard, @uppy/locales, MediaTag, CATEGORIES, EditDraft, GALLERY_CATEGORIES (+2 more)

### Community 39 - "SiteSettingsService"
Cohesion: 0.20
Nodes (6): SiteSettingsService, Injectable, STATUS_CLASSES, STATUS_LABELS, LABELS, STATUSES

### Community 40 - "HeaderComponent"
Cohesion: 0.27
Nodes (3): HeaderComponent, Component, HostListener

### Community 41 - "worker.ts"
Cohesion: 0.24
Nodes (9): ref_cloudflare_node, @cloudflare/workers-types, staticAssetSecurityHeaders, apiHandler, app, Env, fetch(), rewritePublicOrigin() (+1 more)

### Community 42 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 44 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 45 - "ref_node_path"
Cohesion: 0.22
Nodes (4): ref_node_path, root, root, root

### Community 46 - "ref_node_test"
Cohesion: 0.22
Nodes (4): ref_node_test, root, root, valid

### Community 47 - "ref_node_fs"
Cohesion: 0.25
Nodes (3): ref_node_fs, root, root

### Community 51 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 52 - "ref_node_assert"
Cohesion: 0.33
Nodes (3): ref_node_assert, root, root

### Community 54 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 58 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **262 isolated node(s):** `ReservationWorkflowStatus`, `ServerLogLevel`, `DashboardReadinessCheck`, `MenuItemCategory`, `SchoolPayload` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 524 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `reservation.controller.ts`, `inventory.controller.ts`, `CatalogValidationError`, `worker.ts`, `school.controller.ts`, `wine.controller.ts`, `validateUuid`, `package.json`, `menu.controller.ts`, `security.middleware.ts`, `catalogError`, `security.middleware.test.ts`?**
  _High betweenness centrality (0.310) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `admin-data.service.ts`, `AdminSettingsComponent`, `cms.component.ts`, `SiteSettingsService`, `restaurant.service.ts`, `pages/traiteur/traiteur.component.ts`, `app.component.ts`, `package.json`, `site-settings.service.ts`, `@angular/common`, `StockComponent`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `admin-data.service.ts`, `AdminSettingsComponent`, `cms.component.ts`, `SiteSettingsService`, `@angular/core`, `restaurant.service.ts`, `pages/traiteur/traiteur.component.ts`, `app.component.ts`, `package.json`, `site-settings.service.ts`, `StockComponent`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **What connects `ReservationWorkflowStatus`, `ServerLogLevel`, `DashboardReadinessCheck` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06612021857923497 - nodes in this community are weakly interconnected._
- **Should `admin-data.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05706214689265537 - nodes in this community are weakly interconnected._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._