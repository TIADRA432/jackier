# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1258 nodes · 2659 edges · 82 communities (51 shown, 31 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `90664522`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- reservation.controller.ts
- AdminDataService
- AdminSettingsComponent
- CatalogValidationError
- AdminSchoolComponent
- options
- CMSComponent
- RestaurantService
- @angular/common
- gallery.controller.ts
- school.controller.ts
- admin-data.service.ts
- AdminComponent
- restaurant.service.ts
- AdminGalleryComponent
- routes/index.ts
- menu.controller.ts
- package.json
- wine.controller.ts
- dependencies
- @angular/core
- app.routes.ts
- AdminEquipeComponent
- AdminRestaurantComponent
- compilerOptions
- GalleryComponent
- admin.component.ts
- AdminTraiteurComponent
- team.controller.ts
- security.middleware.ts
- ReservationsComponent
- devDependencies
- express
- menu-catalog.ts
- StockComponent
- worker.ts
- SchoolComponent
- AdminWinesComponent
- menu.component.ts
- cms.component.ts
- SeoService
- SiteSettingsService
- AdminCategoriesComponent
- HeaderComponent
- inventory.controller.ts
- server.ts
- compilerOptions
- about.component.ts
- DashboardComponent
- scripts
- ref_node_assert
- ref_node_fs
- ref_node_path
- AdminFinanceComponent
- ReservationComponent
- AnalyticsComponent
- MenuComponent
- ParallaxDirective
- ref_node_test
- HomeComponent
- CateringFormComponent
- prepare-preview.mjs
- DishDetailComponent
- production-shell.test.ts
- smoke-production.sh
- TraiteurComponent
- admin-gallery.test.ts
- catering-flow.test.ts
- content-authenticity.test.ts
- dashboard-readiness.test.ts
- gallery-experience.test.ts
- live-visitor-experience.test.ts
- reservation-flow.test.ts
- school-catalog.test.ts
- school-management.test.ts
- seo.test.ts
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
5. `RestaurantService` - 45 edges
6. `catalogError()` - 45 edges
7. `CMSComponent` - 40 edges
8. `@angular/common` - 37 edges
9. `AdminSchoolComponent` - 36 edges
10. `validateUuid()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `AdminSettingsComponent` --references--> `PublicSettings`  [EXTRACTED]
  src/app/pages/admin/settings/settings.component.ts → src/app/core/services/admin-data.service.ts
- `deleteCategory()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/category.controller.ts → src/controllers/catalog.validation.ts
- `validateDailyClosePayload()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/finance.controller.ts → src/controllers/catalog.validation.ts
- `validateExpensePayload()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/finance.controller.ts → src/controllers/catalog.validation.ts
- `createGalleryImage()` --calls--> `CatalogValidationError`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/catalog.validation.ts

## Import Cycles
- None detected.

## Communities (82 total, 31 thin omitted)

### Community 0 - "reservation.controller.ts"
Cohesion: 0.07
Nodes (59): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, CateringValidationError, CateringWorkflowStatus, cleanString(), conakryDateString(), createCateringEvent() (+51 more)

### Community 2 - "AdminSettingsComponent"
Cohesion: 0.07
Nodes (7): MediaReference, OpeningDay, SiteMediaSlot, WeekdayKey, WeeklyHours, AdminSettingsComponent, Component

### Community 3 - "CatalogValidationError"
Cohesion: 0.09
Nodes (44): CatalogValidationError, isRecord(), requireKnownFields(), createMediaAsset(), createMediaTag(), EXTENSIONS, getMediaAssets(), getMediaTags() (+36 more)

### Community 4 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (11): SchoolLevel, SchoolProgram, SchoolProgramStatus, SchoolRegistration, SchoolRegistrationStatus, SchoolSession, SchoolSessionStatus, AdminSchoolComponent (+3 more)

### Community 5 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 6 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 8 - "@angular/common"
Cohesion: 0.11
Nodes (15): @angular/common, @angular/platform-browser, rxjs, AppComponent, Component, authInterceptor(), SeoConfig, DEFAULT_SETTINGS (+7 more)

### Community 9 - "gallery.controller.ts"
Cohesion: 0.14
Nodes (26): optionalImageUrl(), optionalOrder(), optionalPrice(), optionalText(), requiredText(), addExpense(), DAILY_CLOSE_FIELDS, dailyClose() (+18 more)

### Community 10 - "school.controller.ts"
Cohesion: 0.13
Nodes (28): cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolRegistration(), createSchoolSession(), getAdminSchoolSessions(), getPublicSchoolPrograms() (+20 more)

### Community 11 - "admin-data.service.ts"
Cohesion: 0.11
Nodes (20): @angular/forms, BrandSettings, DashboardReadinessCheck, FinanceExpense, FinanceReport, MENU_ITEM_CATEGORIES, MenuCategory, MenuItemCategory (+12 more)

### Community 12 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 13 - "restaurant.service.ts"
Cohesion: 0.15
Nodes (14): Dish, GalleryImage, Reservation, Review, SchoolProgram, SchoolRegistrationReceipt, Wine, ReservationReceipt (+6 more)

### Community 14 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 15 - "routes/index.ts"
Cohesion: 0.19
Nodes (24): catalogError(), validateUuid(), deleteCategory(), updateCategory(), deleteGalleryImage(), deleteInventoryItem(), collectMediaUsage(), deleteMediaAsset() (+16 more)

### Community 16 - "menu.controller.ts"
Cohesion: 0.20
Nodes (24): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getMenuItems(), getParam(), getPublicMenuItems(), isRecord(), MENU_FIELDS (+16 more)

### Community 17 - "package.json"
Cohesion: 0.08
Nodes (23): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+15 more)

### Community 18 - "wine.controller.ts"
Cohesion: 0.18
Nodes (21): CATEGORY_FIELDS, CategoryPayload, createCategory(), getCategories(), validateCategoryPayload(), getPublicWines(), getWines(), sortWines() (+13 more)

### Community 19 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 20 - "@angular/core"
Cohesion: 0.14
Nodes (11): @angular/core, CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent, Component, CateringProcessComponent (+3 more)

### Community 21 - "app.routes.ts"
Cohesion: 0.14
Nodes (12): @angular/router, routes, adminAuthGuard(), EMPTY_OVERVIEW, DEPARTMENTS, TeamDraft, GALLERY_CATEGORIES, GalleryDraft (+4 more)

### Community 22 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 23 - "AdminRestaurantComponent"
Cohesion: 0.24
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 24 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 25 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 26 - "admin.component.ts"
Cohesion: 0.13
Nodes (10): DashboardOverview, ADMIN_ROUTE_LABELS, ADMIN_SEARCH_ITEMS, AdminNotificationItem, AdminSearchItem, EMPTY_OVERVIEW, EMPTY_OVERVIEW, AdminLoginComponent (+2 more)

### Community 27 - "AdminTraiteurComponent"
Cohesion: 0.26
Nodes (4): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, Component

### Community 28 - "team.controller.ts"
Cohesion: 0.21
Nodes (15): createTeamMember(), getPublicTeamMembers(), getTeamMembers(), nullableBio(), optionalBoolean(), optionalDepartment(), TEAM_DEPARTMENTS, TEAM_FIELDS (+7 more)

### Community 29 - "security.middleware.ts"
Cohesion: 0.14
Nodes (10): cors, express-rate-limit, helmet, ref_node_events, ref_node_net, allowedOrigins, configuredOrigins, contentSecurityPolicy (+2 more)

### Community 30 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 31 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 32 - "express"
Cohesion: 0.24
Nodes (9): express, supabase, detectImageType(), EXTENSIONS, SupportedImage, uploadMenuImage(), uploadToStorage(), uploadWineImage() (+1 more)

### Community 33 - "menu-catalog.ts"
Cohesion: 0.24
Nodes (11): CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters, normalizeSearch() (+3 more)

### Community 34 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

### Community 35 - "worker.ts"
Cohesion: 0.21
Nodes (10): ref_cloudflare_node, @cloudflare/workers-types, errorHandler(), staticAssetSecurityHeaders, apiHandler, app, Env, fetch() (+2 more)

### Community 36 - "SchoolComponent"
Cohesion: 0.21
Nodes (3): SchoolSession, SchoolComponent, Component

### Community 38 - "menu.component.ts"
Cohesion: 0.20
Nodes (6): DishCardComponent, Component, RevealOnScrollDirective, RevealVariant, Directive, Input

### Community 39 - "cms.component.ts"
Cohesion: 0.18
Nodes (10): @uppy/angular, @uppy/core, @uppy/dashboard, @uppy/locales, MediaTag, CATEGORIES, EditDraft, GALLERY_CATEGORIES (+2 more)

### Community 41 - "SiteSettingsService"
Cohesion: 0.20
Nodes (6): SiteSettingsService, Injectable, STATUS_CLASSES, STATUS_LABELS, LABELS, STATUSES

### Community 43 - "HeaderComponent"
Cohesion: 0.27
Nodes (3): HeaderComponent, Component, HostListener

### Community 44 - "inventory.controller.ts"
Cohesion: 0.33
Nodes (10): createInventoryItem(), getInventoryItems(), INVENTORY_FIELDS, InventoryPayload, optionalBoolean(), optionalQuantity(), toClient(), toDatabase() (+2 more)

### Community 45 - "server.ts"
Cohesion: 0.20
Nodes (9): ref_path, ref_url, app, __dirname, distPath, __filename, PORT, configureSecurity() (+1 more)

### Community 46 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 47 - "about.component.ts"
Cohesion: 0.22
Nodes (5): TeamMember, AboutComponent, Component, TeamGridComponent, Component

### Community 49 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 50 - "ref_node_assert"
Cohesion: 0.25
Nodes (3): ref_node_assert, root, root

### Community 51 - "ref_node_fs"
Cohesion: 0.25
Nodes (3): ref_node_fs, root, root

### Community 52 - "ref_node_path"
Cohesion: 0.25
Nodes (4): ref_node_path, root, root, root

### Community 57 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 58 - "ref_node_test"
Cohesion: 0.33
Nodes (3): ref_node_test, valid, root

### Community 61 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 64 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **263 isolated node(s):** `CateringWorkflowStatus`, `ReservationWorkflowStatus`, `ServerLogLevel`, `SchoolPayload`, `DashboardReadinessCheck` (+258 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 524 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `express` to `reservation.controller.ts`, `CatalogValidationError`, `worker.ts`, `gallery.controller.ts`, `school.controller.ts`, `inventory.controller.ts`, `server.ts`, `routes/index.ts`, `menu.controller.ts`, `package.json`, `wine.controller.ts`, `team.controller.ts`, `security.middleware.ts`?**
  _High betweenness centrality (0.280) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `AdminSchoolComponent`, `menu.component.ts`, `cms.component.ts`, `@angular/common`, `SiteSettingsService`, `admin-data.service.ts`, `restaurant.service.ts`, `about.component.ts`, `package.json`, `app.routes.ts`, `admin.component.ts`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `AdminSchoolComponent`, `menu.component.ts`, `cms.component.ts`, `SiteSettingsService`, `admin-data.service.ts`, `restaurant.service.ts`, `about.component.ts`, `package.json`, `@angular/core`, `app.routes.ts`, `admin.component.ts`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **What connects `CateringWorkflowStatus`, `ReservationWorkflowStatus`, `ServerLogLevel` to the rest of the system?**
  _263 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `reservation.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06597222222222222 - nodes in this community are weakly interconnected._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.07450980392156863 - nodes in this community are weakly interconnected._