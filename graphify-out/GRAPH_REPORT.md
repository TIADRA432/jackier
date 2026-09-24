# Graph Report - jackier  (2026-09-24)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1252 nodes · 2641 edges · 81 communities (48 shown, 33 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `177bfd97`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AdminSettingsComponent
- AdminDataService
- admin-data.service.ts
- AdminSchoolComponent
- options
- CMSComponent
- site-settings.service.ts
- RestaurantService
- wine.controller.ts
- school.controller.ts
- CatalogValidationError
- express
- AdminComponent
- reservation.controller.ts
- AdminGalleryComponent
- media.controller.ts
- menu.controller.ts
- package.json
- team.controller.ts
- routes/index.ts
- dependencies
- catalogError
- AdminEquipeComponent
- pages/traiteur/traiteur.component.ts
- supabase.ts
- restaurant.service.ts
- menu.component.ts
- AdminRestaurantComponent
- AdminTraiteurComponent
- compilerOptions
- GalleryComponent
- catering.controller.ts
- reservation.service.ts
- ReservationsComponent
- @angular/common
- devDependencies
- StockComponent
- SchoolComponent
- AdminWinesComponent
- worker.ts
- cms.component.ts
- SeoService
- AdminCategoriesComponent
- HeaderComponent
- compilerOptions
- DashboardComponent
- scripts
- ref_node_fs
- AdminFinanceComponent
- ReservationComponent
- AnalyticsComponent
- MenuComponent
- ParallaxDirective
- ref_node_assert
- ref_node_path
- ref_node_test
- HomeComponent
- CateringFormComponent
- prepare-preview.mjs
- DishDetailComponent
- production-shell.test.ts
- smoke-production.sh
- TraiteurComponent
- AdminLoginComponent
- admin-access.test.ts
- admin-gallery.test.ts
- catering-flow.test.ts
- content-authenticity.test.ts
- dashboard-readiness.test.ts
- database-security.test.ts
- gallery-experience.test.ts
- live-visitor-experience.test.ts
- media-library.test.ts
- school-catalog.test.ts
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

## Communities (81 total, 33 thin omitted)

### Community 0 - "AdminSettingsComponent"
Cohesion: 0.07
Nodes (15): BrandSettings, MediaReference, OpeningDay, PublicSettings, SiteMediaSlot, TodaySettings, WeekdayKey, WeeklyHours (+7 more)

### Community 2 - "admin-data.service.ts"
Cohesion: 0.09
Nodes (29): @angular/core, @angular/forms, @angular/router, adminAuthGuard(), DashboardOverview, DashboardReadinessCheck, FinanceExpense, FinanceReport (+21 more)

### Community 3 - "AdminSchoolComponent"
Cohesion: 0.08
Nodes (11): SchoolLevel, SchoolProgram, SchoolProgramStatus, SchoolRegistration, SchoolRegistrationStatus, SchoolSession, SchoolSessionStatus, AdminSchoolComponent (+3 more)

### Community 4 - "options"
Cohesion: 0.05
Nodes (43): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+35 more)

### Community 5 - "CMSComponent"
Cohesion: 0.08
Nodes (5): MediaAsset, MediaCategory, MediaUsage, CMSComponent, Component

### Community 6 - "site-settings.service.ts"
Cohesion: 0.08
Nodes (19): @angular/platform-browser, rxjs, routes, AppComponent, Component, authInterceptor(), SeoConfig, DEFAULT_SETTINGS (+11 more)

### Community 8 - "wine.controller.ts"
Cohesion: 0.13
Nodes (30): CATEGORY_FIELDS, CategoryPayload, createCategory(), deleteCategory(), getCategories(), updateCategory(), validateCategoryPayload(), updateSchoolProgram() (+22 more)

### Community 9 - "school.controller.ts"
Cohesion: 0.12
Nodes (31): cleanEmail(), cleanMaterials(), cleanPhone(), cleanText(), createSchoolProgram(), createSchoolRegistration(), createSchoolSession(), deleteSchoolProgram() (+23 more)

### Community 10 - "CatalogValidationError"
Cohesion: 0.15
Nodes (27): CatalogValidationError, isRecord(), requireKnownFields(), updateSchoolRegistrationStatus(), BRAND_FIELDS, getLogs(), getSettings(), MEDIA_REFERENCE_FIELDS (+19 more)

### Community 11 - "express"
Cohesion: 0.10
Nodes (20): cors, express, express-rate-limit, helmet, ref_node_events, ref_node_net, ref_path, ref_url (+12 more)

### Community 12 - "AdminComponent"
Cohesion: 0.11
Nodes (5): AdminAuthService, Injectable, AdminComponent, Component, HostListener

### Community 13 - "reservation.controller.ts"
Cohesion: 0.15
Nodes (25): ALLOWED_STATUSES, ALLOWED_TIMES, cleanString(), conakryNow(), createReservation(), deleteReservation(), ensureNoDuplicateReservation(), format() (+17 more)

### Community 14 - "AdminGalleryComponent"
Cohesion: 0.14
Nodes (3): GalleryMedia, AdminGalleryComponent, Component

### Community 15 - "media.controller.ts"
Cohesion: 0.14
Nodes (24): validateUuid(), collectMediaUsage(), createMediaAsset(), createMediaTag(), deleteMediaAsset(), downloadMediaAsset(), EXTENSIONS, getMediaAssets() (+16 more)

### Community 16 - "menu.controller.ts"
Cohesion: 0.20
Nodes (24): createMenuItem(), deleteMenuItem(), ensureCategoryExists(), getMenuItems(), getParam(), getPublicMenuItems(), isRecord(), MENU_FIELDS (+16 more)

### Community 17 - "package.json"
Cohesion: 0.08
Nodes (23): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+15 more)

### Community 18 - "team.controller.ts"
Cohesion: 0.18
Nodes (21): optionalImageUrl(), optionalOrder(), optionalText(), requiredText(), validateCategory(), validateGalleryPayload(), createTeamMember(), getPublicTeamMembers() (+13 more)

### Community 19 - "routes/index.ts"
Cohesion: 0.14
Nodes (21): createGalleryImage(), deleteGalleryImage(), GALLERY_CATEGORIES, GALLERY_FIELDS, GalleryCategory, GalleryRow, getGalleryImages(), toGalleryItem() (+13 more)

### Community 20 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+15 more)

### Community 21 - "catalogError"
Cohesion: 0.17
Nodes (21): catalogError(), optionalPrice(), addExpense(), DAILY_CLOSE_FIELDS, dailyClose(), EXPENSE_FIELDS, getExpenses(), getReports() (+13 more)

### Community 22 - "AdminEquipeComponent"
Cohesion: 0.17
Nodes (4): AdminTeamMember, AdminEquipeComponent, emptyDraft(), Component

### Community 23 - "pages/traiteur/traiteur.component.ts"
Cohesion: 0.12
Nodes (10): CateringCtaComponent, Component, CateringGalleryComponent, Component, CateringHeroComponent, Component, CateringProcessComponent, Component (+2 more)

### Community 24 - "supabase.ts"
Cohesion: 0.16
Nodes (15): supabase, CATERING_STATUS_LABELS, compactActivities(), CORE_SETTINGS_FIELDS, formatActivity(), getDashboardOverview(), RESERVATION_STATUS_LABELS, AuthenticatedRequest (+7 more)

### Community 25 - "restaurant.service.ts"
Cohesion: 0.15
Nodes (12): GalleryImage, Review, SchoolProgram, SchoolRegistrationReceipt, TeamMember, Wine, AboutComponent, Component (+4 more)

### Community 26 - "menu.component.ts"
Cohesion: 0.17
Nodes (14): Dish, CategoryFilter, categoryFilters(), categoryKey(), filterDishes(), labels, MenuCategory, MenuFilters (+6 more)

### Community 27 - "AdminRestaurantComponent"
Cohesion: 0.20
Nodes (3): MenuItem, AdminRestaurantComponent, Component

### Community 28 - "AdminTraiteurComponent"
Cohesion: 0.21
Nodes (6): CateringEvent, CateringWorkflowStatus, AdminTraiteurComponent, LABELS, STATUSES, Component

### Community 29 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 30 - "GalleryComponent"
Cohesion: 0.15
Nodes (3): GalleryComponent, Component, HostListener

### Community 31 - "catering.controller.ts"
Cohesion: 0.22
Nodes (15): ALLOWED_EVENT_TYPES, ALLOWED_STATUSES, CATERING_TRANSITIONS, cleanString(), conakryDateString(), createCateringEvent(), deleteCateringEvent(), ensureNoDuplicateCateringRequest() (+7 more)

### Community 32 - "reservation.service.ts"
Cohesion: 0.21
Nodes (7): Reservation, ReservationReceipt, ReservationResult, ReservationService, Injectable, supabaseClient, environment

### Community 33 - "ReservationsComponent"
Cohesion: 0.28
Nodes (4): AdminReservation, ReservationWorkflowStatus, ReservationsComponent, Component

### Community 34 - "@angular/common"
Cohesion: 0.21
Nodes (7): @angular/common, DailySpecialComponent, Component, RevealOnScrollDirective, RevealVariant, Directive, Input

### Community 35 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, @cloudflare/workers-types, concurrently, postcss, @tailwindcss/postcss, tsx, @types/cors, @types/express (+5 more)

### Community 36 - "StockComponent"
Cohesion: 0.22
Nodes (4): InventoryItem, emptyDraft(), StockComponent, Component

### Community 37 - "SchoolComponent"
Cohesion: 0.21
Nodes (3): SchoolSession, SchoolComponent, Component

### Community 39 - "worker.ts"
Cohesion: 0.22
Nodes (10): ref_cloudflare_node, @cloudflare/workers-types, staticAssetSecurityHeaders, router, apiHandler, app, Env, fetch() (+2 more)

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

### Community 47 - "ref_node_fs"
Cohesion: 0.25
Nodes (3): ref_node_fs, root, root

### Community 52 - "ParallaxDirective"
Cohesion: 0.38
Nodes (3): ParallaxDirective, Directive, Input

### Community 53 - "ref_node_assert"
Cohesion: 0.33
Nodes (3): ref_node_assert, valid, root

### Community 54 - "ref_node_path"
Cohesion: 0.33
Nodes (3): ref_node_path, root, root

### Community 55 - "ref_node_test"
Cohesion: 0.33
Nodes (3): ref_node_test, root, root

### Community 58 - "prepare-preview.mjs"
Cohesion: 0.50
Nodes (3): ref_node_url, previewConfiguration(), env

### Community 61 - "smoke-production.sh"
Cohesion: 0.83
Nodes (3): check_url(), require_header(), smoke-production.sh script

## Knowledge Gaps
- **262 isolated node(s):** `MediaReference`, `ReservationWorkflowStatus`, `MediaCategory`, `MediaRow`, `MediaTag` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 524 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `express` to `worker.ts`, `wine.controller.ts`, `school.controller.ts`, `CatalogValidationError`, `reservation.controller.ts`, `media.controller.ts`, `menu.controller.ts`, `package.json`, `team.controller.ts`, `routes/index.ts`, `catalogError`, `supabase.ts`, `catering.controller.ts`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `admin-data.service.ts` to `reservation.service.ts`, `AdminSettingsComponent`, `@angular/common`, `AdminSchoolComponent`, `site-settings.service.ts`, `cms.component.ts`, `package.json`, `pages/traiteur/traiteur.component.ts`, `restaurant.service.ts`, `menu.component.ts`, `AdminTraiteurComponent`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/common` to `reservation.service.ts`, `AdminSettingsComponent`, `admin-data.service.ts`, `AdminSchoolComponent`, `site-settings.service.ts`, `cms.component.ts`, `package.json`, `pages/traiteur/traiteur.component.ts`, `restaurant.service.ts`, `menu.component.ts`, `AdminTraiteurComponent`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **What connects `MediaReference`, `ReservationWorkflowStatus`, `MediaCategory` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AdminSettingsComponent` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `AdminDataService` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Should `admin-data.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09393939393939393 - nodes in this community are weakly interconnected._