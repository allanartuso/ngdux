import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from './abstract-input-component';

@Component({
  selector: 'ngil-test-input',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TestInputComponent,
      multi: true
    }
  ]
})
export class TestInputComponent extends AbstractInputComponent<string> {
  value: string;

  writeValue(value: string): void {
    this.value = value;
  }
}

describe('AbstractInputComponent', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();
  let form: FormGroup;
  const formDirective = new FormGroupDirective([], []);

  beforeEach(waitForAsync(() => {
    const control = new FormControl('');
    form = new FormGroup({
      testControl: control
    });
    formDirective.form = form;

    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestInputComponent],
      providers: [
        {
          provide: ControlContainer,
          useValue: formDirective
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);

    fixture.detectChanges();
  });

  it('writes value to the form', () => {
    const newFormValues = 'newTestValue';

    component.writeValue(newFormValues);

    expect(component.value).toStrictEqual(newFormValues);
  });
});
