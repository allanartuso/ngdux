import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createPersistentProperty } from '@demo/demo/data-model/properties/test';
import { PropertiesTableComponent } from './properties-table.component';

describe('PropertiesListComponent', () => {
  let component: PropertiesTableComponent;
  let fixture: ComponentFixture<PropertiesTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesTableComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('cell selection', () => {
    it('emits propertySelected event when selecting a cell from the name column', () => {
      jest.spyOn(component.cellSelected, 'emit');
      const property = createPersistentProperty();

      component.onCellSelected(property);

      expect(component.cellSelected.emit).toHaveBeenCalledWith(property.id);
    });
  });
});
