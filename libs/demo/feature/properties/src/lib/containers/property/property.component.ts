import { Component } from '@angular/core';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { UsersFacade } from '@demo/demo/data-access/users';
import { CreatePropertyDto, PropertyDto, isPropertyDto } from '@demo/demo/data-model/properties';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'demo-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent {
  model$ = combineLatest({
    property: this.propertyFacade.resource$,
    requestState: this.propertyFacade.requestState$,
    users: this.usersFacade.resources$
  });

  constructor(private readonly propertyFacade: PropertyFacade, private readonly usersFacade: UsersFacade) {}

  onSaved(property: PropertyDto | CreatePropertyDto): void {
    if (isPropertyDto(property)) {
      this.propertyFacade.save({ resource: property });
    } else {
      this.propertyFacade.create({ resource: property });
    }
  }
}
