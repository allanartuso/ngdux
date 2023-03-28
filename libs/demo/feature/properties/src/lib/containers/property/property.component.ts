import { Component } from '@angular/core';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { RequestState } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent {
  property$: Observable<PropertyDto> = this.propertyFacade.resource$;
  requestState$: Observable<RequestState> = this.propertyFacade.requestState$;

  constructor(private readonly propertyFacade: PropertyFacade) {}

  onSaved(property: PropertyDto): void {
    if (property.id) {
      this.propertyFacade.save({ resource: property });
    } else {
      this.propertyFacade.create({ resource: property });
    }
  }
}
