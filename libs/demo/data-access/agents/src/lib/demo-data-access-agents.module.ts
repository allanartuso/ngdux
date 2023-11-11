import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIST_FEATURE_KEY, NgduxListStateModule } from '@ngdux/list';
import { AGENTS_DEFAULT_FEATURE_KEY, DataAccessAgentsModuleConfig } from './models/list.model';
import { AgentsListService } from './services/list.service';

@NgModule({
  imports: [NgduxListStateModule.config({ listFeatureKey: AGENTS_DEFAULT_FEATURE_KEY, service: AgentsListService })]
})
export class DemoDataAccessAgentsModule {
  static config(config: DataAccessAgentsModuleConfig): ModuleWithProviders<DemoDataAccessAgentsModule> {
    return {
      ngModule: DemoDataAccessAgentsModule,
      providers: [{ provide: LIST_FEATURE_KEY, useValue: config.listFeatureKey || AGENTS_DEFAULT_FEATURE_KEY }]
    };
  }
}
