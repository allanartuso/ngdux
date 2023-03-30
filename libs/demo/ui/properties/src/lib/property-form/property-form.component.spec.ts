import { PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperty } from '@demo/demo/data-model/properties/test';
import { PropertyFormComponent } from './property-form.component';

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let testProperty: PropertyDto;
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();

  beforeEach(() => {
    testProperty = createPersistentProperty();

    component = new PropertyFormComponent();
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('creates the form', () => {
    component.formViewModel = testProperty;
    component.ngOnInit();
    component.ngAfterViewInit();
    const expectedFormValue = { ...testProperty };
    delete expectedFormValue.id;

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });

  it('creates an empty form when the form model is undefined', () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    const expectedFormValue: PropertyDto = {
      price: null,
      size: null,
      address: null,
      availableFrom: null,
      features: null,
      description: null,
      contact: null
    };

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });
});
