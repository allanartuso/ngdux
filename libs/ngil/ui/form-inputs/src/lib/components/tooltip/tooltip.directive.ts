import { ComponentRef, Directive, HostBinding, HostListener, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[ngilTooltip]',
  standalone: true
})
export class NgilTooltipDirective {
  @Input('ngilTooltip') tooltipText = '';
  @Input('ngilTooltipDisabled') disabled = false;

  @HostBinding('style.position') position = 'relative';

  @HostListener('mouseenter', ['$event'])
  onMouseOver() {
    if (!this.disabled && !this.tooltipComponent) {
      this.tooltipComponent = this.createTooltipComponent();
    }
  }

  @HostListener('mouseleave')
  onMouseOut() {
    if (!this.disabled && this.tooltipComponent) {
      this.tooltipComponent.destroy();
      this.viewContainerRef.clear();
      this.tooltipComponent = undefined;
    }
  }

  private tooltipComponent?: ComponentRef<TooltipComponent>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  private createTooltipComponent() {
    const tooltipComponent = this.viewContainerRef.createComponent(TooltipComponent);
    this.renderer.appendChild(this.viewContainerRef.element.nativeElement, tooltipComponent.location.nativeElement);
    tooltipComponent.setInput('text', this.tooltipText);
    return tooltipComponent;
  }
}
