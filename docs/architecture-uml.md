# Architecture UML - Web App Restaurant Le Jacquier

Ce document présente l'architecture complète de l'application web Angular pour le restaurant premium "Le Jacquier", intégrant les services de restauration, traiteur et école de gastronomie.

## 1. Diagramme de Cas d'Utilisation (Use Case)

Ce diagramme illustre les interactions entre les différents acteurs (Visiteur, Client, Administrateur) et le système.

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome

actor "Visiteur" as V
actor "Client" as C
actor "Administrateur" as A

package "Web App Restaurant Le Jacquier" {
  usecase "Consulter le menu" as UC1
  usecase "Voir plats locaux & seafood" as UC2
  usecase "Consulter service traiteur" as UC3
  usecase "Consulter école gastronomique" as UC4
  usecase "Demander devis traiteur" as UC5
  usecase "Réserver table" as UC6
  usecase "S'inscrire formation" as UC7
  usecase "Gérer menu & plats" as UC8
  usecase "Gérer événements & traiteur" as UC9
  usecase "Gérer équipe & école" as UC10
}

V --> UC1
V --> UC2
V --> UC3
V --> UC4

C --> UC1
C --> UC3
C --> UC5
C --> UC6
C --> UC7

A --> UC8
A --> UC9
A --> UC10
@enduml
```

## 2. Diagramme de Classes (Domain Model)

Modélisation orientée objet du domaine métier (Clean Architecture).

```plantuml
@startuml
skinparam classAttributeIconSize 0

class Restaurant {
  +id: string
  +name: string
  +address: string
  +phone: string
  +email: string
  +openingHours: string
  +description: string
}

class Dish {
  +id: string
  +name: string
  +description: string
  +price: number
  +category: DishCategory
  +isAvailable: boolean
  +imageUrl: string
  +createdAt: Date
  +updatePrice(newPrice: number): void
  +toggleAvailability(): void
}

class Drink {
  +id: string
  +name: string
  +type: DrinkType
  +price: number
  +description: string
  +imageUrl: string
}

class CateringService {
  +id: string
  +eventType: EventType
  +clientName: string
  +eventDate: Date
  +guestCount: number
  +budget: number
  +customMenu: boolean
  +status: CateringStatus
  +calculateQuote(): number
  +updateStatus(status: CateringStatus): void
}

class WeeklyMenu {
  +id: string
  +weekStart: Date
  +weekEnd: Date
  +addDish(dish: Dish): void
  +removeDish(dishId: string): void
}

class GastronomySchoolProgram {
  +id: string
  +title: string
  +description: string
  +durationWeeks: number
  +certification: boolean
  +price: number
  +enrollStudent(student: Student): void
}

class Student {
  +id: string
  +firstName: string
  +lastName: string
  +email: string
  +enroll(program: GastronomySchoolProgram): void
}

class User {
  +id: string
  +firstName: string
  +lastName: string
  +email: string
  +role: UserRole
  +authenticate(password: string): boolean
}

class Reservation {
  +id: string
  +customerName: string
  +date: Date
  +time: string
  +guests: number
  +status: ReservationStatus
}

WeeklyMenu "1" *-- "N" Dish : contains >
CateringService "N" -- "N" Dish : includes >
Student "N" -- "N" GastronomySchoolProgram : enrolled in >
User "1" -- "N" Reservation : makes >
User "1" -- "N" CateringService : requests >

@enduml
```

## 3. Diagramme de Composants (Architecture Angular)

Structure modulaire et Lazy Loading de l'application Angular.

```plantuml
@startuml
package "Angular Application (Frontend)" {
  [AppModule] <<Core>>

  package "CoreModule" {
    [AuthService]
    [ApiInterceptor]
    [ErrorHandler]
  }

  package "SharedModule" {
    [UI Components (Buttons, Cards)]
    [Pipes (Currency, Date)]
    [Directives]
  }

  package "Feature Modules (Lazy Loaded)" {
    [HomeModule]
    [MenuModule]
    [CateringModule]
    [SchoolModule]
    [ReservationModule]
  }

  [AppModule] --> CoreModule
  [AppModule] --> SharedModule
  [AppModule] ..> [HomeModule] : lazy load
  [AppModule] ..> [MenuModule] : lazy load
  [AppModule] ..> [CateringModule] : lazy load

  [CateringModule] *-- [CateringFormComponent]
  [CateringModule] *-- [CateringHeroComponent]
  [CateringModule] --> [CateringService]
}
@enduml
```

## 4. Diagramme de Séquence (Demande de Devis Traiteur)

Flux d'exécution lors de la soumission d'une demande de devis.

```plantuml
@startuml
actor Client
boundary "CateringFormComponent" as UI
control "CateringService (Angular)" as Service
entity "Backend API" as API
database "PostgreSQL" as DB

Client -> UI: Remplir formulaire devis
Client -> UI: Cliquer "Envoyer"
UI -> UI: Validation locale (Reactive Forms)
UI -> Service: submitQuoteRequest(data)
Service -> API: POST /api/catering/quote
API -> API: Validation métier & DTO
API -> DB: save(CateringRequest)
DB --> API: Success
API --> Service: 201 Created (Quote ID)
Service --> UI: Success Response
UI --> Client: Afficher message de confirmation
API -> API: Trigger Email Notification (Admin & Client)
@enduml
```

## 5. Diagramme d'Activité (Processus Traiteur)

Logique métier du cycle de vie d'une prestation traiteur.

```plantuml
@startuml
start
:Client soumet demande de devis;
if (Formulaire valide ?) then (Oui)
  :Enregistrement en base de données;
  :Notification Admin (Email/Dashboard);
  :Admin étudie la demande;
  if (Faisable ?) then (Oui)
    :Admin génère proposition personnalisée;
    :Envoi proposition au client;
    if (Client valide ?) then (Oui)
      :Paiement acompte;
      :Réservation confirmée;
      :Planification logistique & Achats;
      :Exécution Jour J;
    else (Non)
      :Annulation demande;
    endif
  else (Non)
    :Refus avec motif;
  endif
else (Non)
  :Afficher erreurs de validation UI;
endif
stop
@enduml
```

## 6. Diagramme de Déploiement

Architecture physique et infrastructure cloud.

```plantuml
@startuml
node "Client Device (Mobile/Desktop)" {
  [Web Browser]
}

node "CDN / Edge Network" {
  [Angular Static Assets]
}

node "Cloud Provider (ex: AWS / GCP)" {
  node "Application Server" {
    [Node.js / NestJS API]
  }
  node "Database Server" {
    database "PostgreSQL"
  }
  node "Cache Server" {
    database "Redis"
  }
}

[Web Browser] --> [Angular Static Assets] : HTTPS (Load UI)
[Web Browser] --> [Node.js / NestJS API] : REST / JSON (API Calls)
[Node.js / NestJS API] --> PostgreSQL : TCP/IP
[Node.js / NestJS API] --> Redis : TCP/IP
@enduml
```

## 7. Diagramme d'États (Réservation)

Cycle de vie d'une réservation de table ou de service traiteur.

```plantuml
@startuml
[*] --> PENDING : Nouvelle réservation

PENDING --> CONFIRMED : Validation Admin / Paiement
PENDING --> CANCELLED : Refus Admin / Annulation Client

CONFIRMED --> COMPLETED : Événement terminé / Client honoré
CONFIRMED --> NO_SHOW : Client absent
CONFIRMED --> CANCELLED : Annulation tardive

COMPLETED --> [*]
CANCELLED --> [*]
NO_SHOW --> [*]
@enduml
```

## Justification Architecturale

1. **Séparation des responsabilités (SOLID)** : Le frontend Angular est strictement séparé de la logique métier complexe (Backend). Les services Angular ne font que de la communication HTTP et de la gestion d'état local (Signals).
2. **Performance (Lazy Loading)** : Les modules comme `CateringModule` ou `SchoolModule` ne sont chargés que lorsque l'utilisateur navigue vers ces routes, réduisant le bundle initial.
3. **Scalabilité** : L'utilisation du pattern Repository sur le backend et de l'injection de dépendances sur Angular permet de faire évoluer l'application (ex: ajout de nouveaux restaurants) sans réécrire le cœur du système.
4. **Sécurité** : L'authentification par JWT et le RBAC (Role Based Access Control) garantissent que seuls les administrateurs peuvent modifier les menus ou valider les devis.
