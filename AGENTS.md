# AGENTS.md — Le Jacquier

Ce fichier définit les règles de travail pour tout agent intervenant sur ce dépôt.

## 1. Projet

- Application : **Le Jacquier**
- Stack : Angular 21, TypeScript, Express, Cloudflare Worker, Supabase
- Production : `https://jackier.abdourahmane591.workers.dev`
- Branche production : `main`
- Branche de travail : `develop`
- Base de données / stockage : Supabase
- Déploiement production : GitHub Actions → Cloudflare Worker

## 2. Règle générale

Travailler sur `develop` sauf instruction explicite contraire.

Ne jamais pousser directement une évolution fonctionnelle sur `main`.

Ne jamais annoncer qu’une modification est “déployée”, “en production” ou “validée” sans avoir observé les workflows correspondants jusqu’à leur état final.

Ne pas inventer de contenu métier pour le restaurant :
- aucun faux membre d’équipe ;
- aucun faux avis client ;
- aucune fausse distinction ;
- aucun faux vin ;
- aucun faux programme d’école ;
- aucun faux horaire ;
- aucun faux lien social ou légal.

Lorsqu’une donnée réelle manque, conserver un état vide propre ou un fallback explicitement neutre.

## 3. Workflow Git

### Développement

1. Vérifier l’état `main...develop`.
2. Si `develop` est seulement derrière `main`, la réaligner avant de travailler.
3. Implémenter sur `develop`.
4. Ajouter ou mettre à jour les tests.
5. Attendre la CI complète.
6. Corriger jusqu’à obtenir :
   - tests ✅
   - type-check serveur ✅
   - build Angular ✅
7. Ne déployer que lorsque l’utilisateur demande explicitement **déployer / deploy / production**.

### Déploiement

Pour une livraison production :

1. Comparer `main...develop`.
2. Vérifier que la dernière CI applicative de `develop` est verte.
3. Si Graphify a créé un commit après la CI, vérifier que seuls les fichiers `graphify-out/**` ont changé.
4. Créer une PR `develop → main`.
5. Re-fetch la PR et vérifier `mergeable=true`.
6. Fusionner avec le SHA de tête attendu.
7. Suivre les workflows `main` :
   - **Quality checks**
   - **Deploy Cloudflare Worker**
8. Vérifier jusqu’à :
   - tests ✅
   - type-check ✅
   - build ✅
   - dry-run Wrangler ✅
   - Worker + static assets ✅
   - smoke tests production ✅
9. Réaligner `develop` sur la production si nécessaire.

## 4. CI et commandes

Le dépôt n’a volontairement **pas de lockfile** pour l’instant.

Ne pas remplacer `npm install --no-package-lock` par `npm ci` tant qu’un lockfile n’est pas introduit officiellement.

Commandes de référence :

```bash
npm install --no-package-lock
npm test
npm run lint
npm run build
```

Déploiement manuel local uniquement si nécessaire :

```bash
npm run deploy:cloudflare
```

La CI officielle reste la source de vérité avant production.

## 5. Cloudflare

Le workflow production se déclenche sur un push vers `main`.

Il doit valider :
- application ;
- credentials Cloudflare ;
- configuration Wrangler ;
- déploiement Worker ;
- assets statiques ;
- smoke tests.

Les smoke tests production vérifient notamment :
- `/`
- `/api/settings`
- `/api/menu`
- `/api/gallery`
- `/api/wines`
- `/api/school`
- `/api/team/public`
- `/menu`
- `/reservation`
- `/contact`

Ne jamais contourner ces contrôles pour forcer une livraison.

## 6. Supabase

Avant toute modification de schéma :
- inspecter les vraies tables et colonnes ;
- ne pas supposer une structure ;
- préférer une migration versionnée dans `supabase/migrations/`.

Pour les données métier :
- ne modifier que ce qui est clairement sûr ou explicitement demandé ;
- ne jamais activer artificiellement du contenu non validé ;
- conserver les éléments non approuvés en inactif plutôt que les publier.

Ne jamais exposer :
- service role key ;
- secrets ;
- tokens ;
- informations internes réservées à l’administration.

## 7. Séparation public / admin

Tout contenu éditable doit respecter cette règle :

- public : uniquement les éléments actifs/publiés ;
- admin : catalogue complet, y compris éléments masqués/inactifs.

Exemples :
- `/menu` → plats publics actifs ;
- `/admin/menu` → catalogue admin complet ;
- `/wines` → vins publics actifs ;
- `/admin/wines` → catalogue admin complet ;
- `/team/public` → membres actifs + explicitement publics ;
- `/team` → annuaire admin protégé.

Toute route d’écriture doit être protégée par authentification + rôle ADMIN sauf fonctionnalité volontairement publique comme réservation ou demande traiteur.

## 8. Paramètres globaux

`/settings` constitue la source de vérité des informations publiques globales.

Les pages visiteur doivent lire les valeurs administrées au lieu de dupliquer des constantes.

Paramètres globaux actuels :
- nom ;
- slogan ;
- adresse ;
- quartier ;
- téléphone ;
- e-mail ;
- horaires éditoriaux ;
- horaires hebdomadaires structurés ;
- devise ;
- localisation Google Maps ;
- réseaux sociaux ;
- liens légaux ;
- logo ;
- couvertures ;
- “Aujourd’hui au Jacquier”.

Ne pas mettre de secrets ou paramètres internes dans les settings publics.

## 9. Médias

Utiliser la Médiathèque centrale pour les images administrées.

Préférer :
- vraies photos du restaurant ;
- galerie publique ;
- assets média réutilisables.

Éviter de rajouter de nouveaux placeholders externes si un média réel existe.

Toute référence média doit disposer d’un `altText` utilisable ; générer un fallback raisonnable si nécessaire.

## 10. UX visiteur

Direction : **restaurant haut de gamme / cinematic editorial**.

Principes :
- élégance avant effets ;
- animations lentes et sobres ;
- vrais contenus ;
- mobile prioritaire ;
- CTA utiles ;
- états de chargement / erreur / vide propres.

Les animations doivent :
- respecter `prefers-reduced-motion` ;
- rester compatibles SSR ;
- éviter le scroll hijacking ;
- éviter le WebGL lourd sans justification ;
- éviter les zooms agressifs et animations permanentes.

## 11. Accessibilité

Toujours préserver :
- navigation clavier ;
- focus visible ;
- labels de formulaire ;
- texte alternatif des images ;
- contrastes lisibles ;
- boutons avec zones tactiles suffisantes ;
- lightbox utilisable au clavier ;
- respect de `prefers-reduced-motion`.

## 12. Validation serveur

Ne jamais faire confiance uniquement au formulaire Angular.

Toute donnée modifiable doit être validée côté serveur :
- champs connus uniquement ;
- types ;
- longueurs ;
- UUID ;
- URLs ;
- e-mails ;
- nombres ;
- booléens ;
- whitelists d’énumérations.

Les champs facultatifs doivent pouvoir être vidés proprement lorsque cela a du sens.

## 13. Réservations

Le parcours attendu est :

visiteur → validation → API → Supabase → admin → changement de statut.

Les créneaux publics doivent respecter les horaires structurés lorsqu’ils sont activés.

Ne jamais proposer un créneau incompatible avec les horaires configurés.

Les limitations/rate limits publiques doivent rester compatibles Cloudflare Worker.

## 14. Pré-livraison

Le Dashboard contient un indicateur de préparation à la livraison.

Les contrôles principaux sont :
- Paramètres établissement ;
- Menu public ;
- Carte des vins ;
- Équipe publique ;
- Galerie ;
- École gastronomique ;
- Horaires temps réel ;
- Réseaux sociaux ;
- Liens légaux.

Ne pas considérer le site “prêt à livrer” uniquement parce que le build est vert.

La livraison finale exige aussi :
- contenu réel ;
- parcours métier testés ;
- responsive ;
- accessibilité ;
- performance ;
- SEO ;
- sécurité ;
- recette client ;
- sauvegarde / point de restauration.

## 15. Graphify

Ce projet possède un rapport d’architecture Graphify :
- `graphify-out/GRAPH_REPORT.md`
- `graphify-out/graph.json`

Quand l’utilisateur tape `/graphify`, utiliser Graphify avant toute autre analyse du code.

Règles :
- pour une question d’architecture, utiliser `graphify query "<question>"` si le graphe existe ;
- si le graphe est absent ou obsolète, reconstruire avec `graphify extract . --code-only` ;
- utiliser `graphify query`, `graphify path` ou `graphify explain` selon le besoin ;
- lire `graphify-out/GRAPH_REPORT.md` pour l’architecture globale.

Le workflow GitHub met automatiquement à jour Graphify après les pushes.

Les commits Graphify peuvent créer une divergence de branche sans modifier le code applicatif. Toujours vérifier les fichiers modifiés avant de traiter cette divergence comme un conflit fonctionnel.

Ne jamais modifier manuellement `graphify-out/graph.json` pour résoudre un problème applicatif.

## 16. Critère de fin de tâche

Avant d’annoncer une tâche terminée :
- vérifier le code réellement modifié ;
- vérifier les tests associés ;
- observer la CI ;
- préciser si le changement est seulement sur `develop` ou réellement en production ;
- signaler clairement tout point restant incomplet.

La règle est simple : **état observé > état supposé**.
