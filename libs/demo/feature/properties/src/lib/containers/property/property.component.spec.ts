import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperty, createTransientProperty } from '@demo/demo/data-model/properties/test';
import { RequestState } from '@ngdux/data-model-common';
import { of } from 'rxjs';
import { PropertyComponent } from './property.component';

describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;
  let property: PropertyDto;
  let facade: Partial<PropertyFacade>;

  beforeEach(waitForAsync(() => {
    property = createPersistentProperty();
    facade = {
      resource$: of(property),
      requestState$: of(RequestState.IDLE),
      save: jest.fn(),
      create: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [PropertyComponent],
      providers: [{ provide: PropertyFacade, useValue: facade }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a property', () => {
    component.onSaved(property);

    expect(facade.save).toHaveBeenCalledTimes(1);
    expect(facade.save).toHaveBeenCalledWith({ resource: property });
  });

  it('saves the property', () => {
    const newProperty = createTransientProperty();

    component.onSaved(newProperty);

    expect(facade.create).toHaveBeenCalledTimes(1);
    expect(facade.create).toHaveBeenCalledWith({ resource: newProperty });
  });
});
