#!/usr/bin/env bash
set -euo pipefail

: "${PRODUCTION_URL:?PRODUCTION_URL is required}"

check_url() {
  local path="$1"
  local label="$2"
  local output="$3"

  for attempt in 1 2 3 4 5 6 7 8; do
    if curl --fail --silent --show-error --location --max-time 20 "$PRODUCTION_URL$path" -o "$output"; then
      echo "✓ $label répond correctement"
      return 0
    fi
    echo "Tentative $attempt/8 échouée pour $label; nouvel essai..."
    sleep 5
  done

  echo "::error title=Production smoke test failed::$label ne répond pas correctement sur $PRODUCTION_URL$path"
  return 1
}

check_url "/" "Accueil" "/tmp/home.html"
check_url "/about" "Page À propos" "/tmp/about-page.html"
check_url "/gallery" "Page Galerie" "/tmp/gallery-page.html"
check_url "/services-traiteur" "Page Traiteur" "/tmp/catering-page.html"
check_url "/ecole-gastronomie" "Page École" "/tmp/school-page.html"
check_url "/admin/login" "Page Login admin" "/tmp/admin-login-page.html"
check_url "/menu" "Page Menu" "/tmp/menu-page.html"
check_url "/reservation" "Page Réservation" "/tmp/reservation-page.html"
check_url "/contact" "Page Contact" "/tmp/contact-page.html"

check_url "/api/settings" "API Paramètres" "/tmp/settings.json"
check_url "/api/menu" "API Menu" "/tmp/menu.json"
check_url "/api/gallery" "API Galerie" "/tmp/gallery.json"
check_url "/api/wines" "API Vins" "/tmp/wines.json"
check_url "/api/school" "API École" "/tmp/school.json"
check_url "/api/team/public" "API Équipe publique" "/tmp/team.json"

curl --fail --silent --show-error --location --max-time 20 \
  --dump-header /tmp/security-headers.txt \
  "$PRODUCTION_URL/" -o /dev/null
tr -d '\r' < /tmp/security-headers.txt > /tmp/security-headers-clean.txt

require_header() {
  local pattern="$1"
  local label="$2"
  if ! grep -Eqi "$pattern" /tmp/security-headers-clean.txt; then
    echo "::error title=Missing production security header::$label"
    echo "----- received headers -----"
    cat /tmp/security-headers-clean.txt
    return 1
  fi
  echo "✓ $label"
}

require_header '^content-security-policy:' 'Content-Security-Policy présent'
require_header '^x-content-type-options:[[:space:]]*nosniff([[:space:]]*)$' 'X-Content-Type-Options = nosniff'
require_header '^x-frame-options:[[:space:]]*DENY([[:space:]]*)$' 'X-Frame-Options = DENY'
require_header '^referrer-policy:[[:space:]]*no-referrer([[:space:]]*)$' 'Referrer-Policy = no-referrer'
require_header '^strict-transport-security:' 'HSTS présent'
require_header "frame-src 'self' https://maps\\.google\\.com https://www\\.google\\.com" 'Google Maps autorisé par la CSP'
require_header "script-src 'self'([;]|$)" 'Scripts limités au même origin'

if grep -Eqi "<link[^>]+rel=[\"']stylesheet[\"'][^>]+media=[\"']print[\"'][^>]+onload=" /tmp/home.html; then
  echo "::error title=Stylesheet blocked by CSP::Le build Angular utilise encore un handler inline onload pour activer la feuille CSS, incompatible avec script-src-attr 'none'"
  grep -Eio "<link[^>]+rel=[\"']stylesheet[\"'][^>]*>" /tmp/home.html || true
  exit 1
fi

if ! grep -Eqi "<link[^>]+rel=[\"']stylesheet[\"'][^>]+href=" /tmp/home.html; then
  echo "::error title=Production stylesheet missing::Aucune feuille CSS externe n'est référencée dans la page d'accueil"
  exit 1
fi

echo "✓ Feuille CSS écran compatible avec la CSP"

if grep -Eqi 'cdn\\.tailwindcss\\.com|esm\\.sh' /tmp/security-headers-clean.txt; then
  echo "::error title=Legacy script source still allowed::La CSP production autorise encore Tailwind CDN ou esm.sh"
  cat /tmp/security-headers-clean.txt
  exit 1
fi

echo "✓ Headers de sécurité production validés"

node - <<'NODE'
const fs = require('fs');

const checks = [
  ['/tmp/settings.json', 'Paramètres', value => value && typeof value === 'object' && !Array.isArray(value)],
  ['/tmp/menu.json', 'Menu', Array.isArray],
  ['/tmp/gallery.json', 'Galerie', Array.isArray],
  ['/tmp/wines.json', 'Vins', Array.isArray],
  ['/tmp/school.json', 'École', Array.isArray],
  ['/tmp/team.json', 'Équipe publique', Array.isArray],
];

const parsed = new Map();
for (const [file, label, valid] of checks) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  if (!valid(data)) throw new Error(`${label}: structure JSON inattendue`);
  parsed.set(file, data);
  console.log(`✓ ${label}: JSON valide`);
}

for (const [file, label] of [
  ['/tmp/menu.json', 'Menu'],
  ['/tmp/wines.json', 'Vins'],
  ['/tmp/school.json', 'École'],
]) {
  const data = parsed.get(file);
  if (data.some(item => item?.active === false)) {
    throw new Error(`${label}: un élément inactif est exposé publiquement`);
  }
  console.log(`✓ ${label}: aucun élément explicitement inactif exposé`);
}

const publicTeam = parsed.get('/tmp/team.json');
if (publicTeam.some(item => item?.active === false || item?.publicVisible === false)) {
  throw new Error('Équipe publique: un profil non publiable est exposé');
}

const pages = [
  ['/tmp/home.html', 'Accueil'],
  ['/tmp/about-page.html', 'À propos'],
  ['/tmp/gallery-page.html', 'Galerie'],
  ['/tmp/catering-page.html', 'Traiteur'],
  ['/tmp/school-page.html', 'École'],
  ['/tmp/admin-login-page.html', 'Login admin'],
  ['/tmp/menu-page.html', 'Menu'],
  ['/tmp/reservation-page.html', 'Réservation'],
  ['/tmp/contact-page.html', 'Contact'],
];

for (const [file, label] of pages) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('<app-root')) throw new Error(`${label}: shell Angular introuvable`);
  console.log(`✓ ${label}: shell Angular détecté`);
}
NODE
