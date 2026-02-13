import { Component } from '@angular/core';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { CreatePropertyDto, PropertyDto, isPropertyDto } from '@demo/demo/data-model/properties';
import { combineLatest } from 'rxjs';
import { PropertyUsersListFacade } from '../../demo-feature-properties.module';

@Component({
  selector: 'demo-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  standalone: false
})
export class PropertyComponent {
  model$ = combineLatest({
    property: this.propertyFacade.resource$,
    requestState: this.propertyFacade.requestState$,
    users: this.usersFacade.resources$
  });

  constructor(
    private readonly propertyFacade: PropertyFacade,
    private readonly usersFacade: PropertyUsersListFacade
  ) {}

  onSaved(property: PropertyDto | CreatePropertyDto): void {
    if (isPropertyDto(property)) {
      this.propertyFacade.save({ resource: property });
    } else {
      this.propertyFacade.create({ resource: property });
    }
  }
}
