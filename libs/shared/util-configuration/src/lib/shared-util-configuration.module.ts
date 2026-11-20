import { CommonModule } from '@angular/common';
import { NgModule, inject } from '@angular/core';
import { AppConfiguration, APP_CONFIGURATION } from './configuration.model';
import { ConfigurationService } from './configuration.service';

@NgModule({
  imports: [CommonModule],
})
export class SharedUtilConfigurationModule {
  constructor() {
    const configuration = inject<AppConfiguration>(APP_CONFIGURATION);
    const configurationService = inject(ConfigurationService);

    configurationService.setConfiguration(configuration);
  }
}
