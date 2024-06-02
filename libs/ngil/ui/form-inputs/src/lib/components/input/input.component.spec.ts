import { TestBed } from '@angular/core/testing';
import { NgilInputComponent } from './input.component';

describe('NgilInputComponent', () => {
  let component: NgilInputComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgilInputComponent]
    });

    component = TestBed.inject(NgilInputComponent);
    component.ngAfterViewInit();
  });

  it('should emit changed event when input value changes', () => {
    const changedSpy = jest.spyOn(component.changed, 'emit');
    component.onChangeInput('new value');
    expect(changedSpy).toHaveBeenCalledWith('new value');
  });

  it('should call onChange when input value changes', () => {
    const onChangeMock = jest.fn();
    component.registerOnChange(onChangeMock);
    component.onChangeInput('new value');
    expect(onChangeMock).toHaveBeenCalledWith('new value');
  });

  it('should convert input value to number when type is number', () => {
    const changedSpy = jest.spyOn(component.changed, 'emit');
    component.type = 'number';
    component.onChangeInput('123');
    expect(changedSpy).toHaveBeenCalledWith(123);
  });
});
