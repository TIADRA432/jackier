# Aperçu isolé du Jacquier

## État au 21 septembre 2026

Configuration préparée à partir de `main`. Aucun aperçu n'a encore été déployé.
Le projet Supabase `le-jacquier-restaurant` est celui de production. Aucune branche de test n'a été trouvée ; seule la branche par défaut existe, avec un ancien statut `MIGRATIONS_FAILED`. Ne pas la réinitialiser pour préparer la démonstration.

## Préparer la base de test

Créer un projet ou une branche Supabase dédiée, sans copie des données clients. La création d'une branche nécessite la confirmation de son coût. L'organisation du projet existant est `xtcteuhlvkqnwoouznue` ; confirmer l'organisation avant de demander le tarif.

Appliquer et vérifier les migrations du dépôt sur cette base seulement. Préparer les catégories, plats et comptes de démonstration avec des données fictives. Vérifier les politiques RLS et les buckets médias. Configurer les URL Auth pour l'aperçu et désactiver les envois réels (SMTP, SMS, webhooks, fonctions et tâches éventuelles). Ne pas importer les utilisateurs de production.

## Configurer GitHub

Dans Settings → Environments → `preview`, définir :

| Type | Nom | Valeur |
|---|---|---|
| Variable | `PREVIEW_SUPABASE_URL` | URL du projet de test uniquement |
| Variable | `PREVIEW_SUPABASE_PUBLISHABLE_KEY` | Clé `sb_publishable_…` du projet de test |
| Secret | `PREVIEW_SUPABASE_SERVICE_ROLE_KEY` | Clé serveur du projet de test |
| Secret | `CLOUDFLARE_API_TOKEN` | Jeton autorisé à déployer le Worker d'aperçu |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | Identifiant du compte Cloudflare |

Les secrets de l'environnement `production` ne sont pas automatiquement disponibles dans `preview`. Ne jamais publier une clé serveur dans un fichier versionné ou dans la conversation.

## Déployer

Après fusion dans `main` et préparation de la base : Actions → **Deploy isolated preview** → Run workflow → branche `main`.

Le workflow est manuel. Aucun push ne déclenche ce déploiement. Il compile Angular avec la configuration `preview`, vérifie le code, puis déploie uniquement `jackier-preview`. L'URL exacte doit être relevée dans le résultat Wrangler ; elle n'est pas considérée comme disponible avant succès du déploiement.

Le workflow de production et sa branche `integration/backend-supabase` restent inchangés. La commande `npm run deploy:cloudflare` continue de viser la production et ne doit pas servir pour cet aperçu.

## Recette avant présentation

- Vérifier le domaine affiché et la base de test dans les requêtes navigateur.
- Vérifier la réponse HTML et son en-tête `X-Robots-Tag: noindex, nofollow, noarchive` (ce n'est pas un contrôle d'accès).
- Tester navigation, carte et images sur mobile et ordinateur.
- Se connecter avec un compte fictif et vérifier les permissions administrateur.
- Créer une réservation fictive, la retrouver dans l'administration et vérifier sa persistance.
- Vérifier les changements de carte et les médias sans toucher à la production.
- Vérifier qu'aucun message réel n'est envoyé. Les tests automatiques du dépôt ne remplacent pas cette recette.

## Limites d'accès de cette session

Les outils GitHub disponibles ne permettent ni de définir les secrets/variables des environnements, ni de déclencher un nouveau workflow manuellement. Les identifiants Cloudflare ne sont pas disponibles localement. Ces paramètres et le premier lancement nécessitent l'interface GitHub ou une connexion disposant de ces capacités.

Références : [configuration Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/) ; [branches Supabase](https://supabase.com/docs/guides/deployment/branching).
