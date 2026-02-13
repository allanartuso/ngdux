import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { DemoFeatureSidebarModule } from '@demo/demo/feature/sidebar';
import { APP_CONFIGURATION, SharedUtilConfigurationModule } from '@demo/shared/util-configuration';
import { SharedUtilStoreModule } from '@demo/shared/util-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { getAppConfiguration } from './environment-configuration.model';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@demo/demo/feature/dashboard').then(module => module.DemoFeatureDashboardModule)
  },
  {
    path: 'users',
    loadChildren: () => import('@demo/demo/feature/users').then(module => module.DemoFeatureUsersModule)
  },
  {
    path: 'properties',
    loadChildren: () => import('@demo/demo/feature/properties').then(module => module.DemoFeaturePropertiesModule)
  },
  {
    path: 'cars',
    loadChildren: () => import('@demo/demo/feature/cars').then(module => module.DemoFeatureCarsModule)
  },
  {
    path: 'agents',
    loadChildren: () => import('@demo/demo/feature/agents').then(module => module.DemoFeatureAgentsModule)
  },
  {
    path: 'smartphones',
    loadChildren: () => import('@demo/demo/feature/smartphones').then(module => module.DemoFeatureSmartphonesModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, {
      scrollPositionRestoration: 'enabled'
    }),
    SharedUtilStoreModule,
    SharedUtilConfigurationModule,
    BrowserAnimationsModule,
    DemoFeatureSidebarModule
  ],
  providers: [
    {
      provide: APP_CONFIGURATION,
      useFactory: getAppConfiguration
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(),
    provideStoreDevtools({})
  ]
})
export class AppModule {}
