import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoDataAccessSmartphonesModule } from '@demo/demo/data-access/smartphones';
import { DemoUiSmartphonesModule } from '@demo/demo/ui/smartphones';
import { SmartphonesComponent } from './containers/smartphones/smartphones.component';
import { SmartphonesResolver } from './resolvers/smartphones.resolver';

export const smartphonesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        resolve: [SmartphonesResolver],
        component: SmartphonesComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(smartphonesRoutes),
    DemoDataAccessSmartphonesModule.config(),
    DemoUiSmartphonesModule
  ],
  declarations: [SmartphonesComponent],
  providers: [SmartphonesResolver]
})
export class DemoFeatureSmartphonesModule {}
