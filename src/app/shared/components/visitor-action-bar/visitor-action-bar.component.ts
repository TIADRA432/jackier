import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-visitor-action-bar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!hidden()) {
      <div class="fixed inset-x-3 bottom-3 z-[70] lg:hidden" style="padding-bottom: env(safe-area-inset-bottom);" aria-label="Actions rapides">
        @if (showStatus()) {
          <div class="mx-auto mb-2 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-jacquier-dark/90 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur">
            <span [class]="siteSettings.openStatus().isOpen ? 'h-2 w-2 rounded-full bg-emerald-400' : 'h-2 w-2 rounded-full bg-gray-500'"></span>
            <span>{{ siteSettings.openStatus().label }}</span>
            @if (siteSettings.openStatus().detail) { <span class="font-normal text-white/60">· {{ siteSettings.openStatus().detail }}</span> }
          </div>
        }
        <div class="mx-auto flex max-w-md gap-2 rounded-2xl border border-white/15 bg-jacquier-dark/95 p-2 shadow-2xl backdrop-blur">
          <a [routerLink]="primaryPath()"
            class="flex min-h-[48px] min-w-0 flex-1 items-center justify-center rounded-xl bg-jacquier-gold px-3 text-center text-[11px] font-bold uppercase tracking-wide text-jacquier-dark sm:px-4 sm:text-xs sm:tracking-wider">
            {{ primaryLabel() }}
          </a>

          @if (siteSettings.socialUrl('whatsapp')) {
            <a [href]="siteSettings.socialUrl('whatsapp')" target="_blank" rel="noopener noreferrer"
              class="flex min-h-[48px] min-w-0 flex-1 items-center justify-center rounded-xl border border-white/20 px-3 text-center text-[11px] font-bold uppercase tracking-wide text-white sm:px-4 sm:text-xs sm:tracking-wider">
              WhatsApp
            </a>
          } @else {
            <a [href]="phoneHref()"
              class="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-white/20 px-4 text-center text-xs font-bold uppercase tracking-wider text-white">
              Appeler
            </a>
          }
        </div>
      </div>
    }
  `
})
export class VisitorActionBarComponent {
  private readonly router = inject(Router);
  readonly siteSettings = inject(SiteSettingsService);
  readonly currentUrl = signal(this.router.url);

  readonly hidden = computed(() => this.currentUrl().startsWith('/admin'));
  readonly showStatus = computed(() =>
    this.siteSettings.openStatus().configured &&
    !this.currentUrl().startsWith('/reservation') &&
    !this.currentUrl().startsWith('/contact')
  );
  readonly primaryPath = computed(() => this.currentUrl().startsWith('/reservation') ? '/menu' : '/reservation');
  readonly primaryLabel = computed(() => this.currentUrl().startsWith('/reservation') ? 'Voir le menu' : 'Réserver');

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.currentUrl.set((event as NavigationEnd).urlAfterRedirects));
  }

  phoneHref(): string {
    return 'tel:' + this.siteSettings.publicInfo().phone.replace(/[^+\d]/g, '');
  }
}
