# Graph Report - jackier-graphify  (2026-09-07)

## Corpus Check
- 79 files · ~103,959 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 486 nodes · 798 edges · 39 communities (23 shown, 16 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- routes/index.ts
- package.json
- development
- pages/traiteur/traiteur.component.ts
- security.middleware.ts
- RestaurantService
- dependencies
- compilerOptions
- restaurant.service.ts
- reservation.controller.ts
- home.component.ts
- @angular/core
- 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE
- devDependencies
- compilerOptions
- @angular/router
- HeaderComponent
- upload.controller.ts
- Architecture UML - Web App Restaurant Le Jacquier
- GalleryComponent
- server.ts
- dashboard.component.ts
- ReservationComponent
- admin.component.ts
- cms.component.ts
- Passation — audit Jackier
- equipe.component.ts
- finance.component.ts
- reservations.component.ts
- app.routes.ts
- restaurant.component.ts
- contact.component.ts
- pages/school/school.component.ts
- environment.development.ts
- environment.prod.ts
- scripts
- worker.ts
- Run and deploy your AI Studio app
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 39 edges
2. `RestaurantService` - 36 edges
3. `@angular/common` - 25 edges
4. `express` - 20 edges
5. `compilerOptions` - 14 edges
6. `@angular/router` - 12 edges
7. `addDoc()` - 12 edges
8. `updateDoc()` - 12 edges
9. `supabase` - 11 edges
10. `getCollection()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `getCategories()` --calls--> `getCollection()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `createCategory()` --calls--> `addDoc()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `updateCategory()` --calls--> `updateDoc()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `deleteCategory()` --calls--> `deleteDoc()`  [EXTRACTED]
  src/controllers/category.controller.ts → src/services/db.service.ts
- `createGalleryImage()` --calls--> `validateUploadedImage()`  [EXTRACTED]
  src/controllers/gallery.controller.ts → src/controllers/upload.controller.ts

## Import Cycles
- None detected.

## Communities (39 total, 16 thin omitted)

### Community 0 - "routes/index.ts"
Cohesion: 0.07
Nodes (57): express, supabase, createCategory(), deleteCategory(), getCategories(), updateCategory(), ALLOWED_STATUSES, createCateringEvent() (+49 more)

### Community 1 - "package.json"
Cohesion: 0.10
Nodes (19): name, private, type, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+11 more)

### Community 2 - "development"
Cohesion: 0.06
Nodes (36): architect, prefix, projectType, root, sourceRoot, build, serve, builder (+28 more)

### Community 3 - "pages/traiteur/traiteur.component.ts"
Cohesion: 0.07
Nodes (18): @angular/forms, @angular/platform-browser, TraiteurComponent, Component, CateringCtaComponent, Component, CateringFormComponent, Component (+10 more)

### Community 4 - "security.middleware.ts"
Cohesion: 0.18
Nodes (8): cors, express-rate-limit, helmet, allowedOrigins, configuredOrigins, contentSecurityPolicy, corsOptions, publicWriteRateLimiter

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @angular/build, @angular/cli, @angular/common, @angular/compiler, @angular/compiler-cli, @angular/core, @angular/forms (+10 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (17): angularCompilerOptions, disableTypeScriptVersionCheck, compilerOptions, allowJs, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 8 - "restaurant.service.ts"
Cohesion: 0.09
Nodes (22): rxjs, @supabase/supabase-js, CateringService, Dish, GalleryImage, Reservation, Review, SchoolProgram (+14 more)

### Community 9 - "reservation.controller.ts"
Cohesion: 0.25
Nodes (12): ALLOWED_STATUSES, ALLOWED_TIMES, cleanString(), createReservation(), deleteReservation(), format(), getParam(), getReservations() (+4 more)

### Community 10 - "home.component.ts"
Cohesion: 0.40
Nodes (4): HomeComponent, Component, DailySpecialComponent, Component

### Community 11 - "@angular/core"
Cohesion: 0.15
Nodes (11): @angular/common, @angular/core, AnalyticsComponent, Component, AdminSettingsComponent, Component, StockComponent, Component (+3 more)

### Community 12 - "2️⃣ STRUCTURE MODULAIRE OPTIMISÉE"
Cohesion: 0.12
Nodes (16): 1. Menu & Plats, 1️⃣ NOUVELLE ARCHITECTURE FONCTIONNELLE (4 COUCHES), 2. Réservations (Workflow PRO), 2️⃣ STRUCTURE MODULAIRE OPTIMISÉE, 3. Traiteur, 3️⃣ UX/UI PREMIUM & PERFORMANCE, 4️⃣ SÉCURITÉ RENFORCÉE, 5️⃣ INTELLIGENCE BUSINESS (BI) (+8 more)

### Community 13 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @cloudflare/workers-types, concurrently, tsx, @types/cors, @types/express, @types/multer, @types/node (+3 more)

### Community 14 - "compilerOptions"
Cohesion: 0.20
Nodes (9): ./tsconfig.json, compilerOptions, esModuleInterop, module, moduleResolution, outDir, types, extends (+1 more)

### Community 15 - "@angular/router"
Cohesion: 0.21
Nodes (7): @angular/router, AppComponent, Component, NotFoundComponent, Component, FooterComponent, Component

### Community 16 - "HeaderComponent"
Cohesion: 0.33
Nodes (3): HostListener, HeaderComponent, Component

### Community 17 - "upload.controller.ts"
Cohesion: 0.23
Nodes (12): createGalleryImage(), deleteGalleryImage(), GalleryRow, getGalleryImages(), toGalleryItem(), detectImageType(), EXTENSIONS, SupportedImage (+4 more)

### Community 18 - "Architecture UML - Web App Restaurant Le Jacquier"
Cohesion: 0.20
Nodes (9): 1. Diagramme de Cas d'Utilisation (Use Case), 2. Diagramme de Classes (Domain Model), 3. Diagramme de Composants (Architecture Angular), 4. Diagramme de Séquence (Demande de Devis Traiteur), 5. Diagramme d'Activité (Processus Traiteur), 6. Diagramme de Déploiement, 7. Diagramme d'États (Réservation), Architecture UML - Web App Restaurant Le Jacquier (+1 more)

### Community 20 - "server.ts"
Cohesion: 0.18
Nodes (8): app, __dirname, distPath, __filename, PORT, errorHandler(), configureSecurity(), router

### Community 25 - "Passation — audit Jackier"
Cohesion: 0.13
Nodes (13): Artefacts versionnés, Intégrité de la version initiale, Naviguer le projet avec Graphify, Pour les agents, Découverte majeure non traitée — nouvel épique requis, Découvertes hors périmètre initial de l'audit — bugs métier critiques, Navigation Graphify pour les agents, Passation — audit Jackier (+5 more)

### Community 29 - "app.routes.ts"
Cohesion: 0.25
Nodes (5): routes, AdminSchoolComponent, Component, AdminTraiteurComponent, Component

### Community 37 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, deploy:cloudflare, dev, lint, preview, start, test (+1 more)

### Community 38 - "worker.ts"
Cohesion: 0.32
Nodes (7): @cloudflare/workers-types, staticAssetSecurityHeaders, apiHandler, app, Env, fetch(), withStaticSecurityHeaders()

## Knowledge Gaps
- **160 isolated node(s):** `$schema`, `version`, `newProjectRoot`, `projectType`, `root` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 244 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `package.json`, `security.middleware.ts`, `worker.ts`, `reservation.controller.ts`, `upload.controller.ts`, `server.ts`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Why does `@angular/core` connect `@angular/core` to `package.json`, `contact.component.ts`, `pages/school/school.component.ts`, `pages/traiteur/traiteur.component.ts`, `restaurant.service.ts`, `home.component.ts`, `@angular/router`, `dashboard.component.ts`, `admin.component.ts`, `cms.component.ts`, `equipe.component.ts`, `finance.component.ts`, `reservations.component.ts`, `app.routes.ts`, `restaurant.component.ts`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Why does `@angular/common` connect `@angular/core` to `package.json`, `contact.component.ts`, `pages/school/school.component.ts`, `restaurant.service.ts`, `home.component.ts`, `@angular/router`, `dashboard.component.ts`, `cms.component.ts`, `equipe.component.ts`, `finance.component.ts`, `reservations.component.ts`, `app.routes.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `$schema`, `version`, `newProjectRoot` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07484909456740442 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `development` be split into smaller, more focused modules?**
  _Cohesion score 0.057057057057057055 - nodes in this community are weakly interconnected._