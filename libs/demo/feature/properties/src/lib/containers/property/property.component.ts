import { Component } from '@angular/core';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { UsersFacade } from '@demo/demo/data-access/users';
import { PropertyDto } from '@demo/demo/data-model/properties';

@Component({
  selector: 'demo-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent {
  property$ = this.propertyFacade.resource$;
  requestState$ = this.propertyFacade.requestState$;
  users$ = this.usersFacade.resources$;

  constructor(private readonly propertyFacade: PropertyFacade, private readonly usersFacade: UsersFacade) {}

  onSaved(property: PropertyDto): void {
    if (property.id) {
      this.propertyFacade.save({ resource: property });
    } else {
      this.propertyFacade.create({ resource: property });
    }
  }
}
