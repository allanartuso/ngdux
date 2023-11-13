import { TestBed } from '@angular/core/testing';
import { SMARTPHONES_RESOURCE_BASE_PATH } from '@demo/demo/data-model/smartphones';
import { createPersistentSmartphone, createPersistentSmartphones } from '@demo/demo/data-model/smartphones/test';
import { RestService } from '@demo/shared/data-access/rest-service';
import { restServiceFixture } from '@demo/shared/data-access/rest-service/test';
import { FilteringLogic, RequestOptions } from '@ngdux/data-model-common';
import { cold } from 'jest-marbles';
import { SmartphonesListService } from './list.service';

describe('SmartphonesListService', () => {
  const smartphone = createPersistentSmartphone();
  const smartphones = createPersistentSmartphones();
  let service: SmartphonesListService;
  let mockRestService: Partial<RestService>;

  beforeEach(() => {
    mockRestService = restServiceFixture.getMockRestService(smartphone, smartphones);

    TestBed.configureTestingModule({
      providers: [SmartphonesListService, { provide: RestService, useValue: mockRestService }]
    });

    service = TestBed.inject(SmartphonesListService);
    mockRestService = TestBed.inject(RestService);
  });

  it('loadResources', () => {
    const options: RequestOptions = {
      pagingOptions: {
        page: 1,
        pageSize: 10
      },
      sortingOptions: {},
      filteringOptions: {
        filters: [],
        logic: FilteringLogic.AND
      }
    };
    const expected = cold('(u|)', { u: smartphones });

    const actual = service.loadResources(options);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.loadResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.loadResources).toHaveBeenCalledWith(SMARTPHONES_RESOURCE_BASE_PATH, options);
  });

  it('deleteResources', () => {
    const expected = cold('(u|)', { u: smartphones });
    const ids: string[] = smartphones.map(smartphone => smartphone.id);

    const actual = service.deleteResources(ids);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.deleteResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.deleteResources).toHaveBeenCalledWith(SMARTPHONES_RESOURCE_BASE_PATH, ids);
  });

  it('patchResources', () => {
    const expected = cold('(u|)', { u: smartphones });
    const ids: string[] = smartphones.map(smartphone => smartphone.id);

    const actual = service.patchResources(ids, smartphone);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.patchResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.patchResources).toHaveBeenCalledWith(
      SMARTPHONES_RESOURCE_BASE_PATH,
      ids.map(id => ({
        id,
        resource: smartphone
      }))
    );
  });
});
