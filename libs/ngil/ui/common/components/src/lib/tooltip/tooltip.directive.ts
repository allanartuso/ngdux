import { OverlayConfig } from '@angular/cdk/overlay';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { NgilOverlayComponent } from '../overlay/overlay.component';
import { NgilTooltipComponent } from './tooltip.component';

@Directive({
  selector: '[ngilTooltip]',
  standalone: true
})
export class NgilTooltipDirective implements OnDestroy {
  @Input('ngilTooltip') tooltipText = '';
  @Input('ngilTooltipDisabled') disabled = false;

  @HostBinding('style.position') position = 'relative';

  private tooltipComponentRef?: ComponentRef<NgilTooltipComponent>;
  private overlayComponentRef: ComponentRef<NgilOverlayComponent> =
    this.viewContainerRef.createComponent(NgilOverlayComponent);

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.renderOverlayComponentRef();
  }

  private renderOverlayComponentRef() {
    this.overlayComponentRef.instance.origin = this.elementRef;
    this.overlayComponentRef.instance.positions = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom'
      }
    ];
    this.renderer.appendChild(
      this.viewContainerRef.element.nativeElement,
      this.overlayComponentRef.location.nativeElement
    );
  }

  @HostListener('mouseenter')
  onMouseOver() {
    if (!this.disabled && !this.tooltipComponentRef) {
      const overwriteConfig: Partial<OverlayConfig> = {
        hasBackdrop: false,
        maxWidth: this.elementRef.nativeElement.offsetWidth
      };

      this.tooltipComponentRef = this.createTooltipComponentRef();
      this.overlayComponentRef.instance.el = this.tooltipComponentRef.location;
      this.overlayComponentRef.setInput('overwriteConfig', overwriteConfig);

      this.overlayComponentRef.instance.open();
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeaveOrigin(event: MouseEvent) {
    const newTarget = event.relatedTarget;
    if (!newTarget || !this.tooltipComponentRef?.location.nativeElement.contains(newTarget)) {
      this.hide();
    } else {
      this.tooltipComponentRef?.location.nativeElement.addEventListener('mouseleave', this.onMouseLeaveOverlay);
    }
  }

  private onMouseLeaveOverlay = (event: Event): void => {
    const newTarget = (event as MouseEvent).relatedTarget as Node | null;
    if (!newTarget || !this.elementRef.nativeElement.contains(newTarget)) {
      this.hide();
    }
  };

  private createTooltipComponentRef() {
    const tooltipComponentRef = this.viewContainerRef.createComponent(NgilTooltipComponent);
    this.renderer.appendChild(
      this.overlayComponentRef.location.nativeElement,
      tooltipComponentRef.location.nativeElement
    );
    tooltipComponentRef.setInput('text', this.tooltipText);
    return tooltipComponentRef;
  }

  private hide() {
    if (!this.disabled && this.tooltipComponentRef) {
      this.tooltipComponentRef?.location.nativeElement.removeEventListener('mouseleave', this.onMouseLeaveOverlay);
      this.overlayComponentRef.instance.close();
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = undefined;
    }
  }

  ngOnDestroy(): void {
    this.tooltipComponentRef?.location.nativeElement.removeEventListener('mouseleave', this.onMouseLeaveOverlay);
  }
}
