
# Le Jacquier — STATE.md

> Dernière mise à jour : 24 septembre 2026
>
> Point de reprise opérationnel officiel du projet.
>
> Production : https://jackier.abdourahmane591.workers.dev

## 1. État actuel

### Branches et production

- main = develop au dernier relevé : 9fcdf0c0e99017df0e6c8be1cf701896d68a5999
- Le dernier commit de branche est Graphify.
- Dernier déploiement applicatif confirmé : 1bae7f7203b2b66393b247baec6695d9f68b74df
- Quality checks : SUCCESS
- Deploy Cloudflare Worker : SUCCESS
- Graphify : SUCCESS
- Smoke tests post-déploiement : actifs
- Headers de sécurité sur assets statiques : actifs
- CSP durcie : active
- Google Maps explicitement autorisé par la CSP

### Expérience visiteur livrée

- Accueil vivant avec hero rotatif alimenté par la Galerie.
- Animations premium sobres : reveal, fade/scale, mask reveal, parallax léger.
- Respect de prefers-reduced-motion.
- Header glass dynamique.
- Navigation mobile éditoriale.
- Menu public limité aux plats actifs.
- Carte des vins publique prévue et masquée si vide.
- Galerie dynamique.
- Équipe publique pilotée par l’admin.
- École publique pilotée par les programmes actifs.
- Bloc Aujourd’hui au Jacquier pilotable depuis Paramètres.
- Barre mobile Réserver / WhatsApp / Appeler.
- Horaires structurés et statut Ouvert / Fermé.
- Réservation filtrée selon les horaires du jour.
- Gestion des fermetures après minuit.
- Contact, Footer, Accueil et Traiteur alimentés par Paramètres.

### Administration livrée

- Dashboard opérationnel.
- Score de préparation à la livraison.
- Séparation actions admin / informations client.
- Cartes de readiness actionnables.
- Copie de la liste des informations client manquantes.
- Paramètres comme source unique de vérité.
- Médiathèque centrale.
- Galerie dédiée.
- Équipe & Personnel.
- Menu et catégories.
- Carte des vins complète côté code.
- École gastronomique avec CRUD des programmes.
- Réservations avec workflow de statut et communication client manuelle.
- Traiteur.
- Finance.
- Stock.
- Analytics.

### Réservations

Workflow actuel :

pending -> confirmed -> completed  
pending -> cancelled  
confirmed -> cancelled

L’administration permet :

- consultation des demandes ;
- changement de statut ;
- journalisation ;
- préparation d’un message client ;
- WhatsApp ;
- e-mail ;
- copie du message.

Important : aucune notification automatique n’est encore envoyée. La communication client reste manuelle.

## 2. Données réelles présentes

Relevé Supabase au 24/09/2026 :

| Domaine | État |
|---|---:|
| Paramètres globaux | présents |
| Menu total | 8 plats |
| Menu public | 2 plats actifs |
| Galerie | 8 images |
| Horaires temps réel | activés |
| Carte des vins | 0 vin |
| Équipe totale | 0 membre |
| Équipe publique | 0 membre |
| École | 0 programme |
| Réseaux sociaux | non configurés |
| Mentions légales + confidentialité | incomplets |
| Aujourd’hui au Jacquier | désactivé |

### Readiness actuelle

1. Paramètres établissement : OK
2. Menu public : OK
3. Carte des vins : À FAIRE
4. Équipe publique : À FAIRE
5. Galerie : OK
6. École gastronomique : À FAIRE
7. Horaires temps réel : OK
8. Réseaux sociaux : À FAIRE
9. Liens légaux : À FAIRE

Score réel actuel : 4 / 9 = 44 %.

Ce score mesure la complétude de mise en service, pas la qualité technique du code.

## 3. Travaux terminés récemment

### Sécurité et déploiement

- CSP resserrée.
- Google Maps ajouté proprement à la CSP.
- Headers de sécurité appliqués aux assets statiques Cloudflare.
- Smoke tests de production rendus plus fiables.
- Workflow Cloudflare simplifié et durci.
- Contrôles du shell public et des headers après publication.

### Paramètres

- Validation avant sauvegarde.
- Validation e-mail et URLs.
- Validation des horaires détaillés.
- Protection contre le rechargement avec changements non sauvegardés.
- Fallback automatique des textes alternatifs médias.
- Garde-fou contre la publication de contenu placeholder.
- Résumé des horaires synchronisé avec les horaires structurés.

### Vins

Le code supporte :

- nom ;
- origine ;
- cépage ;
- année ;
- prix bouteille ;
- prix verre ;
- description ;
- image ;
- ordre ;
- actif / masqué ;
- endpoint public limité aux vins actifs ;
- endpoint admin complet.

Blocage actuel : absence de contenu réel, 0 vin en base.

### École

Le module admin permet :

- création ;
- modification ;
- activation / masquage ;
- ordre ;
- suppression ;
- titre ;
- description ;
- niveau ;
- durée.

Non modélisé pour l’instant : étudiants, inscriptions et paiements.

### Dashboard pré-livraison

Le Dashboard distingue :

- les actions que l’admin peut corriger ;
- les informations qui doivent venir du restaurant ;
- les liens directs vers les écrans concernés ;
- une liste client copiable.

## 4. Feuille de route

### Phase A — Mise en service du contenu réel — P0

Objectif : passer de 44 % à au moins 89 % sans inventer de données.

#### A1. Carte des vins

À obtenir du restaurant :

- noms ;
- origine ;
- cépage si pertinent ;
- année ;
- prix bouteille ;
- prix verre ;
- description courte ;
- photos.

Action admin :

- saisir dans /admin/vins ;
- garder masqué tant que non validé ;
- publier après validation.

Critère de sortie : au moins 1 vin actif, idéalement toute la carte réellement vendue.

#### A2. Équipe publique

À obtenir :

- nom ;
- rôle ;
- département ;
- photo ;
- bio courte ;
- accord de publication.

Action admin :

- saisir dans /admin/equipe ;
- actif ;
- public seulement après validation.

Critère de sortie : au moins 1 profil public.

#### A3. École gastronomique

À obtenir :

- titre des programmes ;
- niveau ;
- durée ;
- description ;
- programmes réellement ouverts.

Action admin :

- saisir dans /admin/ecole ;
- garder les brouillons masqués ;
- publier seulement les programmes validés.

Critère de sortie : au moins 1 programme public si l’École est une offre active.

#### A4. Réseaux sociaux

À confirmer :

- Facebook ;
- Instagram ;
- WhatsApp ;
- TikTok ;
- LinkedIn.

Action admin : renseigner uniquement les URLs officielles dans /admin/settings.

Critère de sortie : au moins 1 réseau officiel configuré.

#### A5. Légal

À obtenir ou rédiger :

- Mentions légales ;
- Politique de confidentialité ;
- identité de l’exploitant ;
- coordonnées légales nécessaires.

Action admin : publier les pages/URLs puis renseigner les liens dans Paramètres.

Critère de sortie : les deux liens du Footer fonctionnent.

### Phase B — Menu réel complet — P0

État : 8 plats présents, 2 actifs.

Ne pas activer automatiquement les 6 autres.

Pour chaque plat :

- confirmer nom ;
- catégorie ;
- description ;
- prix ;
- disponibilité ;
- photo ;
- suggestion de la Cheffe ;
- ordre d’affichage.

Critère de sortie : tous les plats réellement proposés sont actifs, aucun contenu test n’est public.

### Phase C — Réservation — P1

Déjà disponible :

- saisie visiteur ;
- validation ;
- DB ;
- admin ;
- statuts ;
- messages préparés ;
- WhatsApp / e-mail / copier.

Décision restante :

1. conserver la communication manuelle ;
2. ajouter une notification e-mail automatique ;
3. éventuellement ajouter WhatsApp/SMS automatisé plus tard.

Ne jamais promettre une notification automatique tant qu’elle n’existe pas réellement.

Critère de sortie : réservation test complète, statut vérifié, communication client vérifiée.

### Phase D — Traiteur — P1

Tester de bout en bout :

Visiteur -> demande -> validation serveur -> DB -> admin -> statut -> communication client

Contrôler :

- champs obligatoires ;
- budget ;
- téléphone ;
- date ;
- type d’événement ;
- notes ;
- erreurs ;
- états vides ;
- communication client.

### Phase E — QA pré-livraison — P1

Avancement accessibilité au 24/09/2026 :

- menu mobile : focus piégé pendant l’ouverture ;
- retour du focus au déclencheur après fermeture ;
- fermeture par Escape ;
- scroll de fond verrouillé pendant l’ouverture ;
- lightbox Galerie : rôle dialog, aria-modal, focus trap, Escape, flèches clavier et restauration du focus ;
- formulaires Réservation et Traiteur : aria-invalid, aria-describedby, messages d’erreur reliés aux champs ;
- autocomplete name/email/tel ajouté ;
- carte Google Maps chargée en lazy ;
- CI complète verte après ces corrections.

Responsive :

- petits Android ;
- grands Android ;
- iPhone ;
- tablette portrait/paysage ;
- desktop 1366 ;
- desktop large.

Points sensibles :

- Header ;
- menu mobile ;
- barre d’actions flottante ;
- tableaux admin ;
- lightbox ;
- formulaires ;
- hero ;
- boutons sticky.

Accessibilité :

- tabulation ;
- focus visible ;
- labels ;
- modales ;
- Escape ;
- contrastes ;
- formulaires essentiels ;
- prefers-reduced-motion.

Performance :

- LCP ;
- CLS ;
- INP ;
- poids des images ;
- Galerie ;
- hero ;
- bundles JS.

SEO :

- titles ;
- descriptions ;
- canonical ;
- Open Graph ;
- sitemap ;
- robots.txt ;
- favicon ;
- previews sociales ;
- données structurées Restaurant / LocalBusiness si retenues.

### Phase F — Sécurité finale — P1

Déjà en place :

- auth admin ;
- rôles ;
- routes protégées ;
- validation serveur ;
- rate limiting public ;
- CORS ;
- CSP ;
- headers de sécurité ;
- smoke tests production.

À refaire avant livraison :

- revue endpoints publics ;
- revue secrets ;
- permissions Supabase ;
- validation téléchargements ;
- exposition des données clients ;
- test accès admin non authentifié ;
- nettoyage des logs trop bavards.

### Phase G — Recette client — P2

Faire valider :

- identité ;
- textes ;
- photos ;
- menu ;
- prix ;
- vins ;
- horaires ;
- équipe ;
- École ;
- téléphone ;
- e-mail ;
- adresse / Maps ;
- réseaux ;
- réservation ;
- traiteur.

Classer les retours :

- Bloquant
- Important
- Confort
- Après livraison

### Phase H — Livraison officielle — P2

Avant remise :

1. CI verte ;
2. smoke tests production verts ;
3. snapshot DB ;
4. sauvegarde paramètres ;
5. contrôle des rôles ;
6. release Git ;
7. tag de version ;
8. documentation admin ;
9. remise des accès appropriés ;
10. validation de recette.

## 5. Prochain STATE cible

### STATE NEXT — Contenu client intégré

Objectif : readiness supérieur ou égal à 8/9.

État cible :

- Paramètres : OK
- Menu : OK
- Galerie : OK
- Horaires : OK
- Vins : À intégrer
- Équipe : À intégrer
- École : À intégrer
- Réseaux sociaux : À intégrer
- Légal : À intégrer

Le passage au STATE suivant se fait lorsque les informations client sont reçues et intégrées.

### Après STATE NEXT

Ordre :

1. Recette contenu
2. Test E2E réservation
3. Test E2E traiteur
4. Audit responsive
5. Audit accessibilité
6. Mesure performance
7. SEO final
8. Audit sécurité final
9. Recette client
10. Release / tag / sauvegarde

## 6. Prochaine action immédiate

Ne pas inventer les contenus manquants.

Demander au restaurant, en une seule fois :

1. carte des vins ;
2. membres à afficher ;
3. programmes de l’École ;
4. URLs des réseaux sociaux ;
5. informations légales / liens légaux ;
6. validation des 8 plats existants ;
7. validation définitive des coordonnées, horaires et localisation.

Le Dashboard peut déjà générer/copier la liste des informations client manquantes.

## 7. Règles de travail

- main = production stable.
- develop = prochaine version.
- Travail fonctionnel d’abord sur develop.
- CI verte obligatoire avant fusion.
- Re-fetch du HEAD avant merge.
- Déploiement uniquement depuis main.
- Vérifier Cloudflare + Quality + smoke tests après déploiement.
- Ne jamais activer du contenu non validé pour améliorer artificiellement le score.
- Ne jamais utiliser avis, distinctions, équipe, programmes ou produits fictifs.
- Les données client réelles priment sur les fallbacks.
- Toute fonctionnalité annoncée au visiteur doit fonctionner réellement de bout en bout.
- Mettre à jour STATE.md après chaque jalon important.

## 8. Résumé exécutif

Le projet n’est plus en phase de construction générale.

Il est désormais en phase :

Mise en service réelle -> Complétude du contenu -> Recette -> Livraison

Le socle technique, le design, les interactions, l’administration, la sécurité de base, le déploiement Cloudflare et les principaux workflows sont en place.

Le principal facteur bloquant restant est la donnée métier validée par le restaurant, puis la recette finale de bout en bout.
