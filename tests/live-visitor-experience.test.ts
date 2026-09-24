import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('today experience is part of validated public settings', async () => {
  const model = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const controller = await source('src', 'controllers', 'settings.controller.ts');
  const service = await source('src', 'app', 'core', 'services', 'site-settings.service.ts');

  assert.match(model, /export interface TodaySettings/);
  assert.match(model, /featuredDishId\?: string/);
  assert.match(controller, /TODAY_FIELDS/);
  assert.match(controller, /TODAY_CTA_PATHS/);
  assert.match(controller, /validateToday/);
  assert.match(service, /readonly today = computed/);
});

test('admin can publish and preview today at Le Jacquier', async () => {
  const settings = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');

  assert.match(settings, /Aujourd’hui au Jacquier/);
  assert.match(settings, /Expérience vivante/);
  assert.match(settings, /patchToday/);
  assert.match(settings, /featuredDishId/);
  assert.match(settings, /selectedTodayDish/);
  assert.match(settings, /Afficher sur l’Accueil/);
  assert.match(settings, /getMenuItems\(\)/);
});

test('homepage renders today experience only when enabled', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');

  assert.match(home, /siteSettings\.today\(\)\.enabled/);
  assert.match(home, /todayDish = computed/);
  assert.match(home, /siteSettings\.today\(\)\.ctaPath/);
  assert.match(home, /À découvrir aujourd’hui/);
  assert.match(home, /appRevealOnScroll/);
});

test('mobile visitor actions are mounted globally but hidden from admin', async () => {
  const rootComponent = await source('src', 'app.component.ts');
  const rootTemplate = await source('src', 'app.component.html');
  const actionBar = await source('src', 'app', 'shared', 'components', 'visitor-action-bar', 'visitor-action-bar.component.ts');

  assert.match(rootComponent, /VisitorActionBarComponent/);
  assert.match(rootTemplate, /app-visitor-action-bar/);
  assert.match(actionBar, /startsWith\('\/admin'\)/);
  assert.match(actionBar, /socialUrl\('whatsapp'\)/);
  assert.match(actionBar, /phoneHref\(\)/);
  assert.match(actionBar, /startsWith\('\/reservation'\)/);
});

test('mobile action bar avoids duplicating opening status on reservation and contact', async () => {
  const actionBar = await source('src', 'app', 'shared', 'components', 'visitor-action-bar', 'visitor-action-bar.component.ts');

  assert.match(actionBar, /showStatus = computed/);
  assert.match(actionBar, /!this\.currentUrl\(\)\.startsWith\('\/reservation'\)/);
  assert.match(actionBar, /!this\.currentUrl\(\)\.startsWith\('\/contact'\)/);
  assert.match(actionBar, /@if \(showStatus\(\)\)/);
});

test('scroll reveal respects reduced motion and SSR', async () => {
  const directive = await source('src', 'app', 'shared', 'directives', 'reveal-on-scroll.directive.ts');

  assert.match(directive, /isPlatformBrowser/);
  assert.match(directive, /prefers-reduced-motion: reduce/);
  assert.match(directive, /IntersectionObserver/);
  assert.match(directive, /ngOnDestroy/);
});


test('homepage only exposes real managed restaurant content', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');

  assert.match(home, /galleryHighlights/);
  assert.match(home, /schoolHighlights/);
  assert.match(home, /teamHighlights/);
  assert.match(home, /Suggestion de la Cheffe/);
  assert.match(home, /Le restaurant en images/);
  assert.match(home, /École de Gastronomie/);

  assert.doesNotMatch(home, /Guide Gastronomique 2023/);
  assert.doesNotMatch(home, /Meilleur Restaurant Conakry/);
  assert.doesNotMatch(home, /Prix d'Excellence Culinaire/);
  assert.doesNotMatch(home, />2010</);
  assert.doesNotMatch(home, />2015</);

  assert.doesNotMatch(service, /Mariam C\./);
  assert.doesNotMatch(service, /Jean-Pierre L\./);
  assert.doesNotMatch(service, /Fatim D\./);
  assert.doesNotMatch(service, /list\[Math\.min\(2/);
  assert.match(service, /find\(dish => dish\.isFeatured === true\)/);
});


test('homepage live visuals degrade gracefully when media is missing', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');

  assert.match(home, /cuisineVisual = computed/);
  assert.match(home, /ambianceVisual = computed/);
  assert.match(home, /image\.category === 'cuisine'/);
  assert.match(home, /image\.category === 'ambiance'/);
  assert.match(home, /À découvrir au Jacquier/);
  assert.match(home, /@if \(dish\.image\)/);
});


test('weekly opening hours are modeled and validated with Conakry timezone', async () => {
  const model = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const controller = await source('src', 'controllers', 'settings.controller.ts');

  assert.match(model, /export interface WeeklyHours/);
  assert.match(model, /timezone: 'Africa\/Conakry'/);
  assert.match(model, /Record<WeekdayKey, OpeningDay>/);
  assert.match(controller, /WEEKDAY_KEYS/);
  assert.match(controller, /TIME_PATTERN/);
  assert.match(controller, /validateWeeklyHours/);
  assert.match(controller, /weeklyHours\.timezone/);
});

test('site settings computes live status and supports overnight closing', async () => {
  const service = await source('src', 'app', 'core', 'services', 'site-settings.service.ts');

  assert.match(service, /readonly openStatus = computed/);
  assert.match(service, /Africa\/Conakry/);
  assert.match(service, /prevOpen > prevClose/);
  assert.match(service, /currentMinutes < prevClose/);
  assert.match(service, /window\.setInterval/);
  assert.match(service, /60_000/);
});

test('admin exposes structured weekly hours without enabling them by default', async () => {
  const settings = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');

  assert.match(settings, /Horaires détaillés/);
  assert.match(settings, /patchWeeklyEnabled/);
  assert.match(settings, /patchDay/);
  assert.match(settings, /Africa\/Conakry/);
  assert.match(settings, /Statut automatique désactivé/);
  assert.match(settings, /enabled: false/);
});

test('live open status is surfaced across key visitor touchpoints', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');
  const footer = await source('src', 'app', 'shared', 'components', 'footer', 'footer.component.ts');
  const contact = await source('src', 'app', 'pages', 'contact', 'contact.component.ts');
  const actionBar = await source('src', 'app', 'shared', 'components', 'visitor-action-bar', 'visitor-action-bar.component.ts');

  for (const component of [home, footer, contact, actionBar]) {
    assert.match(component, /openStatus\(\)/);
    assert.match(component, /openStatus\(\)\.configured/);
  }
});


test('homepage hero rotates through real gallery imagery accessibly', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');

  assert.match(home, /heroSlides = computed/);
  assert.match(home, /\['restaurant', 'ambiance', 'cuisine'\]/);
  assert.match(home, /activeHeroIndex = signal/);
  assert.match(home, /7000/);
  assert.match(home, /prefers-reduced-motion: reduce/);
  assert.match(home, /selectHero\(i\)/);
  assert.match(home, /aria-pressed/);
  assert.match(home, /ngOnDestroy/);
  assert.match(home, /clearInterval/);
});


test('reservation page filters backend slots using configured weekly hours', async () => {
  const reservation = await source('src', 'app', 'pages', 'reservation', 'reservation.component.ts');

  assert.match(reservation, /availableTimeSlots = computed/);
  assert.match(reservation, /weeklyHours\?\.enabled/);
  assert.match(reservation, /day\.closed/);
  assert.match(reservation, /open < close \? value >= open && value < close : value >= open \|\| value < close/);
  assert.match(reservation, /\[min\]="todayDate"/);
  assert.match(reservation, /Africa\/Conakry/);
  assert.match(reservation, /Le restaurant est fermé ce jour-là/);
  assert.match(reservation, /siteSettings\.openStatus\(\)/);
  assert.doesNotMatch(reservation, /picsum\.photos\/seed\/table/);
});

test('reservation clears a previously selected time when the chosen day invalidates it', async () => {
  const reservation = await source('src', 'app', 'pages', 'reservation', 'reservation.component.ts');

  assert.match(reservation, /effect\(\(\) =>/);
  assert.match(reservation, /!slots\.includes\(selected\)/);
  assert.match(reservation, /controls\.time\.setValue\(''\)/);
});


test('premium motion primitives remain accessible and SSR-safe', async () => {
  const reveal = await source('src', 'app', 'shared', 'directives', 'reveal-on-scroll.directive.ts');
  const parallax = await source('src', 'app', 'shared', 'directives', 'parallax.directive.ts');

  assert.match(reveal, /RevealVariant = 'fade-up' \| 'mask-left' \| 'fade-scale'/);
  assert.match(reveal, /prefers-reduced-motion: reduce/);
  assert.match(reveal, /isPlatformBrowser/);
  assert.match(reveal, /clip-path/);
  assert.match(parallax, /prefers-reduced-motion: reduce/);
  assert.match(parallax, /isPlatformBrowser/);
  assert.match(parallax, /requestAnimationFrame/);
  assert.match(parallax, /parallaxLimit = 28/);
});

test('homepage uses cinematic stagger and subtle parallax without scroll hijacking', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');

  assert.match(home, /hero-kicker/);
  assert.match(home, /hero-title/);
  assert.match(home, /hero-tagline/);
  assert.match(home, /hero-actions/);
  assert.match(home, /appParallax/);
  assert.match(home, /parallaxStrength/);
  assert.match(home, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(home, /preventDefault\(\).*scroll/);
});

test('gallery and menu use restrained premium transitions', async () => {
  const gallery = await source('src', 'app', 'pages', 'gallery', 'gallery.component.ts');
  const menu = await source('src', 'app', 'pages', 'menu', 'menu.component.ts');
  const card = await source('src', 'app', 'shared', 'components', 'dish-card', 'dish-card.component.ts');

  assert.match(gallery, /revealVariant="fade-scale"/);
  assert.match(gallery, /group-hover:scale-\[1\.035\]/);
  assert.match(gallery, /gallery-lightbox-image/);
  assert.match(menu, /RevealOnScrollDirective/);
  assert.match(menu, /backdrop-blur-xl/);
  assert.match(card, /group-hover:scale-\[1\.045\]/);
  assert.match(card, /dishCardIn/);
});

test('header becomes a blurred editorial navigation after scroll', async () => {
  const header = await source('src', 'app', 'shared', 'components', 'header', 'header.component.ts');

  assert.match(header, /bg-white\/90/);
  assert.match(header, /backdrop-blur-xl/);
  assert.match(header, /duration-700/);
  assert.match(header, /w-full bg-jacquier-cream/);
});


test('mobile navigation traps focus restores focus and closes with Escape', async () => {
  const header = await source('src', 'app', 'shared', 'components', 'header', 'header.component.ts');

  assert.match(header, /aria-hidden/);
  assert.match(header, /attr\.inert/);
  assert.match(header, /document:keydown\.escape/);
  assert.match(header, /document:keydown\.tab/);
  assert.match(header, /previousFocus/);
  assert.match(header, /body\.style\.overflow = 'hidden'/);
  assert.match(header, /body\.style\.overflow = ''/);
  assert.match(header, /mobileCloseButton/);
});

test('gallery lightbox behaves as a keyboard modal and restores focus', async () => {
  const gallery = await source('src', 'app', 'pages', 'gallery', 'gallery.component.ts');

  assert.match(gallery, /role="dialog"/);
  assert.match(gallery, /aria-modal="true"/);
  assert.match(gallery, /tabindex="-1"/);
  assert.match(gallery, /trapLightboxFocus/);
  assert.match(gallery, /event\.key === 'Tab'/);
  assert.match(gallery, /event\.key === 'Escape'/);
  assert.match(gallery, /previousFocus/);
  assert.match(gallery, /body\.style\.overflow = 'hidden'/);
  assert.match(gallery, /lightboxCloseButton/);
});


test('reservation form exposes accessible validation state and useful autocomplete hints', async () => {
  const reservation = await source('src', 'app', 'pages', 'reservation', 'reservation.component.ts');

  assert.match(reservation, /autocomplete="name"/);
  assert.match(reservation, /autocomplete="email"/);
  assert.match(reservation, /autocomplete="tel"/);
  assert.match(reservation, /aria-describedby/);
  assert.match(reservation, /aria-invalid/);
  assert.match(reservation, /res-name-error/);
  assert.match(reservation, /res-email-error/);
  assert.match(reservation, /res-phone-error/);
  assert.match(reservation, /res-date-error/);
  assert.match(reservation, /res-time-error/);
});

test('catering form connects invalid controls with announced error messages', async () => {
  const form = await source('src', 'app', 'shared', 'components', 'catering-form', 'catering-form.component.ts');

  assert.match(form, /autocomplete="name"/);
  assert.match(form, /autocomplete="email"/);
  assert.match(form, /autocomplete="tel"/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /aria-invalid/);
  assert.match(form, /catering-name-error/);
  assert.match(form, /catering-phone-error/);
  assert.match(form, /catering-email-error/);
  assert.match(form, /catering-type-error/);
  assert.match(form, /catering-date-error/);
  assert.match(form, /catering-guests-error/);
  assert.match(form, /catering-message-error/);
});

test('contact map uses a restrained mobile height', async () => {
  const contact = await source('src', 'app', 'pages', 'contact', 'contact.component.ts');

  assert.match(contact, /h-\[420px\]/);
  assert.match(contact, /sm:h-\[500px\]/);
  assert.match(contact, /lg:h-auto/);
});

test('contact map is deferred to protect initial page performance', async () => {
  const contact = await source('src', 'app', 'pages', 'contact', 'contact.component.ts');

  assert.match(contact, /loading="lazy"/);
  assert.match(contact, /referrerpolicy="no-referrer-when-downgrade"/);
});
