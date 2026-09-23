import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('public pages do not depend on remote placeholder imagery', async () => {
  const files = await Promise.all([
    source('src', 'app', 'pages', 'about', 'about.component.ts'),
    source('src', 'app', 'pages', 'contact', 'contact.component.ts'),
    source('src', 'app', 'pages', 'gallery', 'gallery.component.ts'),
    source('src', 'app', 'pages', 'home', 'home.component.ts'),
    source('src', 'app', 'pages', 'menu', 'menu.component.ts'),
    source('src', 'app', 'pages', 'reservation', 'reservation.component.ts'),
    source('src', 'app', 'pages', 'school', 'school.component.ts'),
    source('src', 'app', 'shared', 'components', 'catering-hero', 'catering-hero.component.ts')
  ]);

  for (const file of files) {
    assert.doesNotMatch(file, /picsum\.photos/);
  }
});

test('about page avoids unverified awards history and sourcing claims', async () => {
  const about = await source('src', 'app', 'pages', 'about', 'about.component.ts');

  assert.doesNotMatch(about, /Meilleure Table Fusion/);
  assert.doesNotMatch(about, />2018</);
  assert.doesNotMatch(about, />2020</);
  assert.doesNotMatch(about, />2022</);
  assert.doesNotMatch(about, /port de Boulbinet/);
  assert.doesNotMatch(about, /vergers.*Kindia/);
  assert.match(about, /siteSettings\.publicInfo\(\)\.address/);
  assert.match(about, /aboutVisuals/);
});

test('school page only presents programmes backed by admin data', async () => {
  const school = await source('src', 'app', 'pages', 'school', 'school.component.ts');

  assert.doesNotMatch(school, /chefs étoilés/);
  assert.doesNotMatch(school, /50\+/);
  assert.doesNotMatch(school, /95%/);
  assert.match(school, /programs = this\.restaurantService\.getSchoolPrograms\(\)/);
  assert.match(school, /Aucun programme publié actuellement/);
});

test('public catering has no fictitious testimonials or guaranteed response delay', async () => {
  const page = await source('src', 'app', 'pages', 'traiteur', 'traiteur.component.ts');
  const form = await source('src', 'app', 'shared', 'components', 'catering-form', 'catering-form.component.ts');
  const cta = await source('src', 'app', 'shared', 'components', 'catering-cta', 'catering-cta.component.ts');

  assert.doesNotMatch(page, /app-catering-testimonials/);
  assert.doesNotMatch(form, /sous 24h/);
  assert.doesNotMatch(cta, /sous 24h/);
  assert.match(form, /requestReference/);
});


test('restaurant public identity and catering content have no duplicate static source', async () => {
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');

  assert.doesNotMatch(service, /readonly info =/);
  assert.doesNotMatch(service, /getCateringServices/);
  assert.doesNotMatch(service, /CateringService/);
  assert.doesNotMatch(service, /Face au Lycée Kipé/);
});

test('active catering copy avoids unsupported operational promises', async () => {
  const hero = await source('src', 'app', 'shared', 'components', 'catering-hero', 'catering-hero.component.ts');
  const services = await source('src', 'app', 'shared', 'components', 'catering-services', 'catering-services.component.ts');
  const process = await source('src', 'app', 'shared', 'components', 'catering-process', 'catering-process.component.ts');

  for (const component of [hero, services, process]) {
    assert.doesNotMatch(component, /organisation complète/i);
    assert.doesNotMatch(component, /chef à domicile/i);
    assert.doesNotMatch(component, /camion réfrigéré/i);
    assert.doesNotMatch(component, /décoration florale/i);
  }
  assert.doesNotMatch(process, /dégustation avec notre Chef/i);
  assert.match(services, /Le contenu précis de la prestation est défini après étude de votre demande/);
});
