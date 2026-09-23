
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { DOCUMENT, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './app/shared/components/header/header.component';
import { FooterComponent } from './app/shared/components/footer/footer.component';
import { VisitorActionBarComponent } from './app/shared/components/visitor-action-bar/visitor-action-bar.component';
import { filter } from 'rxjs/operators';
import { SeoConfig, SeoService } from './app/core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, VisitorActionBarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly defaultSeo: SeoConfig = {
    description: 'Découvrez Le Jacquier à Kipé, Conakry : menu, réservation, galerie, service traiteur et informations pratiques.'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private seo: SeoService
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.viewportScroller.scrollToPosition([0, 0]);

      let current = this.route;
      while (current.firstChild) current = current.firstChild;

      const routeSeo = current.snapshot.data['seo'] as SeoConfig | undefined;
      const isAdmin = event.urlAfterRedirects.startsWith('/admin');
      const config: SeoConfig = isAdmin
        ? { description: 'Espace d’administration du Jacquier.', noindex: true }
        : (routeSeo ?? this.defaultSeo);

      this.seo.apply(event.urlAfterRedirects, config, current.snapshot.title);

      if (isPlatformBrowser(this.platformId)) {
        queueMicrotask(() => {
          this.document.getElementById('main-content')?.focus({ preventScroll: true });
        });
      }
    });
  }
}
