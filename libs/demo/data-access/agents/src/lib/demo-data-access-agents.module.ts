import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIST_FEATURE_KEYS, NgduxListStateModule } from '@ngdux/list';
import { AGENTS_DEFAULT_FEATURE_KEY, AGENTS_LIST_FEATURE_KEY, DataAccessAgentsModuleConfig } from './models/list.model';
import { AgentsListFacade } from './services/list-facade';
import { AgentsListService } from './services/list.service';

@NgModule({
  imports: [NgduxListStateModule.config({ service: AgentsListService })],
  providers: [AgentsListFacade]
})
export class DemoDataAccessAgentsModule {
  static config(config?: DataAccessAgentsModuleConfig): ModuleWithProviders<DemoDataAccessAgentsModule> {
    const featureKey = config?.listFeatureKey || AGENTS_DEFAULT_FEATURE_KEY;
    return {
      ngModule: DemoDataAccessAgentsModule,
      providers: [
        { provide: AGENTS_LIST_FEATURE_KEY, useValue: featureKey },
        { provide: LIST_FEATURE_KEYS, multi: true, useValue: featureKey }
      ]
    };
  }
}
