import { CreatePropertyDto, PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperty } from '@demo/demo/data-model/properties/test';
import { PropertyFormComponent } from './property-form.component';

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let testProperty: PropertyDto;

  beforeEach(() => {
    testProperty = createPersistentProperty();

    component = new PropertyFormComponent();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('creates the form', () => {
    component.formViewModel = testProperty;
    component.ngOnInit();
    const expectedFormValue = {
      price: testProperty.price,
      size: testProperty.size,
      address: testProperty.address,
      availableFrom: testProperty.availableFrom,
      features: testProperty.features,
      description: testProperty.description,
      contact: testProperty.contact
    };

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });

  it('creates an empty form when the form model is undefined', () => {
    component.ngOnInit();
    const expectedFormValue: Record<keyof CreatePropertyDto, null> = {
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
