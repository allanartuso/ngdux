import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { UsersFacade } from '@demo/demo/data-access/users';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperty, createTransientProperty } from '@demo/demo/data-model/properties/test';
import { RequestState } from '@ngdux/data-model-common';
import { of } from 'rxjs';
import { PropertyComponent } from './property.component';

describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;
  let property: PropertyDto;
  let propertyFacade: Partial<PropertyFacade>;
  let usersFacade: Partial<UsersFacade>;

  beforeEach(waitForAsync(() => {
    property = createPersistentProperty();
    propertyFacade = {
      resource$: of(property),
      requestState$: of(RequestState.IDLE),
      save: jest.fn(),
      create: jest.fn()
    };

    usersFacade = {
      resources$: of([])
    };

    TestBed.configureTestingModule({
      declarations: [PropertyComponent],
      providers: [
        { provide: PropertyFacade, useValue: propertyFacade },
        { provide: UsersFacade, useValue: usersFacade }
      ],
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

    expect(propertyFacade.save).toHaveBeenCalledTimes(1);
    expect(propertyFacade.save).toHaveBeenCalledWith({ resource: property });
  });

  it('saves the property', () => {
    const newProperty = createTransientProperty();

    component.onSaved(newProperty);

    expect(propertyFacade.create).toHaveBeenCalledTimes(1);
    expect(propertyFacade.create).toHaveBeenCalledWith({ resource: newProperty });
  });
});
