# Médiathèque et identité visuelle

## Rôle de chaque emplacement

```text
ordinateur de l’administrateur
  → Admin / Médiathèque
  → API /api/media (JWT ADMIN requis)
  → Supabase Storage / restaurant-media
  → table media_assets (métadonnées)
  → Paramètres ou écrans métier
  → site public
```

Les fichiers binaires sont conservés dans Supabase Storage. La table
`media_assets` ne contient que leur chemin, leur URL publique, leur texte
alternatif, leur catégorie et leurs informations de traçabilité.

## Utilisation par l’administration

1. Ouvrir **Administration → CMS & Contenu** (Médiathèque).
2. Importer une image JPEG, PNG ou WebP de 5 Mo au plus.
3. Fournir un texte alternatif descriptif et choisir sa zone : identité,
   couverture, plats, vins, galerie ou équipe.
4. Ouvrir **Administration → Paramètres → Identité visuelle** pour choisir le
   logo et les huit images permanentes du site.
5. Cliquer sur **Sauvegarder**. Le site public récupère les nouveaux réglages
   au prochain chargement.

Une image de catégorie `gallery` est publiée automatiquement dans la galerie
publique. Les images de l’équipe peuvent être choisies dans
**Administration → Équipe**.

## Identité de référence dans Git

`public/brand/` contient le logo de secours et sa documentation. Il reste
versionné dans Git et s’affiche tant qu’aucun logo n’est sélectionné dans les
paramètres. Sa palette respecte l’existant : vert `#1a3622`, or `#d4af37`,
bourgogne `#5c1a1b`, crème `#f9f5f0` et anthracite `#1f1f1f`.

## Sécurité et règles importantes

- Aucun navigateur ne reçoit `SUPABASE_SERVICE_ROLE_KEY`.
- Les uploads passent uniquement par `/api/media`, protégé par JWT et rôle
  `ADMIN`.
- Le serveur contrôle le MIME, la signature binaire, le format, la taille et
  crée un chemin unique sans écrasement.
- Les fichiers encore référencés par les paramètres, la galerie, le menu, les
  vins ou l’équipe ne peuvent pas être supprimés.
- Les images destinées au public sont dans le bucket public
  `restaurant-media`. Les futurs documents internes devront aller dans un
  bucket privé séparé avec URLs signées.

## Mise en production

Avant de déployer cette fonctionnalité, appliquer la migration :

`supabase/migrations/20260909012613_create_media_library.sql`

Elle crée le bucket configuré, limite les types et la taille des fichiers,
crée `public.media_assets` et active RLS. Ensuite seulement déployer le Worker
et le frontend. Sans migration, l’écran administratif s’affiche mais les
imports échoueront volontairement : la base ne dispose pas encore du registre
de médias.
