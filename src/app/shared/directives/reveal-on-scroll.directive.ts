import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type RevealVariant = 'fade-up' | 'mask-left' | 'fade-scale';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  @Input() revealVariant: RevealVariant = 'fade-up';
  @Input() revealDelay = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const node = this.element.nativeElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      this.reveal(node);
      return;
    }

    const delay = Math.max(0, Math.min(Number(this.revealDelay) || 0, 1200));
    this.renderer.setStyle(node, 'transition-delay', `${delay}ms`);

    if (this.revealVariant === 'mask-left') {
      this.renderer.setStyle(node, 'clip-path', 'inset(0 100% 0 0 round 1.5rem)');
      this.renderer.setStyle(node, 'opacity', '0.75');
      this.renderer.setStyle(node, 'transition', 'clip-path 950ms cubic-bezier(.22,.61,.36,1), opacity 700ms ease');
    } else if (this.revealVariant === 'fade-scale') {
      this.renderer.setStyle(node, 'opacity', '0');
      this.renderer.setStyle(node, 'transform', 'scale(.97)');
      this.renderer.setStyle(node, 'transition', 'opacity 700ms ease, transform 900ms cubic-bezier(.22,.61,.36,1)');
    } else {
      this.renderer.setStyle(node, 'opacity', '0');
      this.renderer.setStyle(node, 'transform', 'translateY(24px)');
      this.renderer.setStyle(node, 'transition', 'opacity 650ms ease, transform 650ms ease');
    }

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        this.reveal(node);
        this.observer?.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private reveal(node: HTMLElement): void {
    this.renderer.setStyle(node, 'opacity', '1');
    this.renderer.setStyle(node, 'transform', 'translateY(0) scale(1)');
    this.renderer.setStyle(node, 'clip-path', 'inset(0 0 0 0 round 1.5rem)');
  }
}
