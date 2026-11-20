import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgilOverlayComponent } from '@ngil/components';
import { NgilUiFormModule } from './ngil-ui-form.module';

@Component({
  imports: [ReactiveFormsModule, NgilUiFormModule],
  template: `
    <form [formGroup]="form">
      <ngil-input formControlName="text" />
      <ngil-textarea formControlName="notes" />
      <ngil-select formControlName="selection" [items]="['first', 'second']" />
      <ngil-radio formControlName="radio" [items]="['first', 'second']" />
    </form>
  `,
})
class FormHostComponent {
  form = new FormGroup({
    text: new FormControl('first'),
    notes: new FormControl('first'),
    selection: new FormControl('first'),
    radio: new FormControl('first'),
  });
}

describe('form controls with default OnPush', () => {
  let fixture: ComponentFixture<FormHostComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [FormHostComponent] });
    fixture = TestBed.createComponent(FormHostComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  it('renders programmatic value changes without emitting values back to the form', async () => {
    const changes = jest.fn();
    fixture.componentInstance.form.valueChanges.subscribe(changes);
    fixture.componentInstance.form.setValue({ text: 'second', notes: 'second', selection: 'second', radio: 'second' });
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector<HTMLInputElement>('ngil-input input')?.value).toBe('second');
    expect(element.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe('second');
    expect(element.querySelector<HTMLInputElement>('ngil-select input')?.value).toBe('second');
    expect(element.querySelector<HTMLInputElement>('ngil-radio input[data-test$="-second"]')?.checked).toBe(true);
    expect(changes).toHaveBeenCalledTimes(1);
  });

  it('renders disabled and enabled states after the initial render', async () => {
    for (const disabled of [true, false]) {
      if (disabled) {
        fixture.componentInstance.form.disable();
      } else {
        fixture.componentInstance.form.enable();
      }
      await fixture.whenStable();

      const fields: NodeListOf<HTMLInputElement | HTMLTextAreaElement> =
        fixture.nativeElement.querySelectorAll('input, textarea');
      expect(fields.length).toBe(5);
      fields.forEach(field => expect(field.disabled).toBe(disabled));
    }
  });

  it('renders options when an overlay opens and closes programmatically', async () => {
    const overlay = fixture.debugElement.query(By.directive(NgilOverlayComponent))
      .componentInstance as NgilOverlayComponent;
    overlay.open();
    await fixture.whenStable();
    expect(document.querySelectorAll('[role="option"]').length).toBe(2);

    overlay.close();
    await fixture.whenStable();
    expect(document.querySelector('[role="option"]')).toBeNull();
  });
});
