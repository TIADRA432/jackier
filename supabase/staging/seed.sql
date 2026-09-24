-- Synthetic data for the free Le Jacquier staging project.
-- Never copy production customer, reservation or catering data here.

insert into public.settings (id, data)
values (
  'global',
  jsonb_build_object(
    'restaurantName', 'Le Jacquier — STAGING',
    'tagline', 'Environnement de test — aucune réservation réelle.',
    'email', 'staging@example.invalid',
    'phone', '+224 600 00 00 00',
    'address', 'ENVIRONNEMENT DE TEST — Conakry',
    'neighborhood', 'Staging',
    'mapQuery', '',
    'currency', 'GNF',
    'openingHours', 'Environnement de test',
    'weeklyHours', jsonb_build_object('enabled', false, 'timezone', 'Africa/Conakry', 'days', '{}'::jsonb),
    'socialMedia', '{}'::jsonb,
    'today', jsonb_build_object('enabled', false),
    'brand', jsonb_build_object('siteMedia', '{}'::jsonb),
    'legalNoticeUrl', '',
    'privacyPolicyUrl', ''
  )
)
on conflict (id) do update set data = excluded.data;

insert into public.menu_categories (name, description, "order", active)
select '[STAGING] Carte test', 'Catégorie synthétique réservée aux tests.', 1, true
where not exists (
  select 1 from public.menu_categories where name = '[STAGING] Carte test'
);

insert into public.menu_items (category_id, name, short_description, price, image_url, is_featured, display_order, active)
select c.id, '[STAGING] Plat test', 'Plat fictif destiné à valider le parcours Menu.', 75000, '/og-image.png', true, 1, true
from public.menu_categories c
where c.name = '[STAGING] Carte test'
  and not exists (select 1 from public.menu_items where name = '[STAGING] Plat test');

insert into public.wine_items (name, origin, grape, year, description, price_bottle, price_glass, image_url, display_order, active)
select '[STAGING] Boisson test', 'Test', 'Sans objet', 2026, 'Entrée synthétique pour la recette staging.', 100000, 25000, '/og-image.png', 1, true
where not exists (select 1 from public.wine_items where name = '[STAGING] Boisson test');

insert into public.gallery_images (image_url, title, category, display_order)
select '/og-image.png', '[STAGING] Galerie test', 'gallery', 1
where not exists (select 1 from public.gallery_images where title = '[STAGING] Galerie test');

insert into public.team_members (name, role, photo_url, active, department, bio, display_order, public_visible)
select '[STAGING] Équipe test', 'Profil de démonstration', '/og-image.png', true, 'salle',
       'Profil fictif réservé aux tests de présentation.', 1, true
where not exists (select 1 from public.team_members where name = '[STAGING] Équipe test');

with inserted_program as (
  insert into public.school_programs (data)
  select jsonb_build_object(
    'title', '[STAGING] Atelier test',
    'description', 'Atelier fictif pour tester inscription, jauge et statuts.',
    'duration', '2 heures',
    'level', 'Débutant',
    'price', 50000,
    'capacity', 2,
    'prerequisites', 'Aucun',
    'instructor', '[STAGING] Formateur test',
    'materialsIncluded', jsonb_build_array('Matériel de test'),
    'status', 'published',
    'active', true,
    'displayOrder', 1
  )
  where not exists (
    select 1 from public.school_programs where data->>'title' = '[STAGING] Atelier test'
  )
  returning id
),
program as (
  select id from inserted_program
  union all
  select id from public.school_programs where data->>'title' = '[STAGING] Atelier test'
  limit 1
)
insert into public.school_sessions (program_id, starts_at, ends_at, capacity, location, status)
select program.id, '2027-06-15 10:00:00+00', '2027-06-15 12:00:00+00', 2, '[STAGING] Le Jacquier', 'scheduled'
from program
where not exists (
  select 1 from public.school_sessions s
  where s.program_id = program.id and s.starts_at = '2027-06-15 10:00:00+00'
);
