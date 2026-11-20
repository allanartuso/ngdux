import { InjectionToken } from '@angular/core';
import { SmartphoneDto } from '@demo/demo/data-model/smartphones';
import { ErrorDto } from '@ngdux/data-model-common';
import { ListFacade } from '@ngdux/list';

export type SmartphonesListFacade = ListFacade<SmartphoneDto, ErrorDto>;
export const SmartphonesListFacade = new InjectionToken<SmartphonesListFacade>('SmartphonesListFacade');
