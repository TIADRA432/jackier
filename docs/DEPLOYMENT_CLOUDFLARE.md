# Déploiement Le Jacquier — Cloudflare Workers + Supabase

## Architecture

- **Frontend** : Angular 21, servi par Cloudflare Workers Static Assets.
- **API** : Express exécuté dans le Worker via `cloudflare:node`.
- **Base de données / Auth / Storage** : Supabase.
- **Secret serveur** : `SUPABASE_SERVICE_ROLE_KEY`, uniquement dans les secrets Cloudflare.

Le fichier `wrangler.jsonc` déclare `SUPABASE_URL` comme variable publique et exige `SUPABASE_SERVICE_ROLE_KEY` comme secret avant déploiement.

## Pré-requis

1. Un compte Cloudflare avec les droits Workers.
2. Le projet Supabase `pesraxtkhkruiipjkrty` opérationnel.
3. Une clé **service role** Supabase disponible uniquement pour l'administrateur du déploiement.
4. Node.js et npm installés.

## Déploiement initial

Depuis la racine du projet :

```bash
npm install
npm run build
npx wrangler login
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npm run deploy:cloudflare
```

La commande `secret put` demande la valeur de la clé de manière interactive. **Ne jamais placer cette clé dans GitHub, `wrangler.jsonc`, `.env.example` ou le code source.**

## Vérification

Après le déploiement :

1. Ouvrir l'URL `*.workers.dev` fournie par Wrangler.
2. Vérifier qu'une page Angular publique se charge.
3. Vérifier une route API publique, par exemple `/api/menu`.
4. Vérifier la connexion administrateur.
5. Vérifier une lecture depuis Supabase.
6. Vérifier un upload d'image depuis l'administration.
7. Vérifier la création et la gestion d'une réservation.

## Sécurité avant production

- Créer le premier compte administrateur dans Supabase Auth puis créer son profil avec le rôle `ADMIN`.
- Ne jamais exposer la clé service role côté navigateur.
- Ajouter un mécanisme anti-abus sur les POST publics `/api/reservations` et `/api/catering` (rate limiting et/ou CAPTCHA).
- Vérifier les politiques RLS Supabase avant l'ouverture publique.
- Tester les parcours d'authentification après un rafraîchissement de page.

## CI/CD GitHub

Le workflow de migration valide actuellement le build Angular et le type-check Worker. Le déploiement Cloudflare n'est volontairement pas exécuté par la CI tant que les identifiants Cloudflare et le secret Supabase ne sont pas configurés dans l'environnement de déploiement.

## Important

Le dépôt peut être construit et vérifié sans secret Supabase réel. Le déploiement Cloudflare, lui, doit disposer de `SUPABASE_SERVICE_ROLE_KEY` configuré comme secret Worker.
