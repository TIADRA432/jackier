import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private frame = 0;
  private enabled = false;

  @Input() parallaxStrength = 0.045;
  @Input() parallaxLimit = 28;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.enabled = true;
    this.renderer.setStyle(this.element.nativeElement, 'will-change', 'translate');
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    this.schedule();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId) || !this.enabled) return;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.renderer.removeStyle(this.element.nativeElement, 'will-change');
    this.renderer.removeStyle(this.element.nativeElement, 'translate');
  }

  private readonly onScroll = () => this.schedule();

  private schedule(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const node = this.element.nativeElement;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const limit = Math.max(0, Number(this.parallaxLimit) || 28);
      const strength = Math.max(0, Math.min(Number(this.parallaxStrength) || 0.045, 0.12));
      const offset = Math.max(-limit, Math.min(limit, (viewportCenter - elementCenter) * strength));
      this.renderer.setStyle(node, 'translate', `0 ${offset.toFixed(1)}px`);
    });
  }
}
