import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const node = this.element.nativeElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      this.reveal(node);
      return;
    }

    this.renderer.setStyle(node, 'opacity', '0');
    this.renderer.setStyle(node, 'transform', 'translateY(24px)');
    this.renderer.setStyle(node, 'transition', 'opacity 650ms ease, transform 650ms ease');

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        this.reveal(node);
        this.observer?.disconnect();
      }
    }, { threshold: 0.12 });

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private reveal(node: HTMLElement): void {
    this.renderer.setStyle(node, 'opacity', '1');
    this.renderer.setStyle(node, 'transform', 'translateY(0)');
  }
}
