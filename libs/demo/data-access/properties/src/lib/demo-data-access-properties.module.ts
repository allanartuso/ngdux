import { NgModule } from '@angular/core';
import { SharedUtilNotificationModule } from '@demo/shared/common/util-notification';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PropertiesEffects } from './+state/properties/properties.effects';
import { PropertiesFacade } from './+state/properties/properties.facade';
import { propertiesReducer, PROPERTIES_FEATURE_KEY } from './+state/properties/properties.state';
import { PropertyEffects } from './+state/property/property.effects';
import { PropertyFacade } from './+state/property/property.facade';
import { propertyReducer, PROPERTY_FEATURE_KEY } from './+state/property/property.state';

@NgModule({
  imports: [
    StoreModule.forFeature(PROPERTY_FEATURE_KEY, propertyReducer),
    StoreModule.forFeature(PROPERTIES_FEATURE_KEY, propertiesReducer),
    EffectsModule.forFeature([PropertyEffects, PropertiesEffects]),
    SharedUtilNotificationModule
  ],
  providers: [PropertyFacade, PropertiesFacade]
})
export class DemoDataAccessPropertiesModule {}
