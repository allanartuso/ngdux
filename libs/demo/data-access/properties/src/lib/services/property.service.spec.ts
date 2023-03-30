import { TestBed } from '@angular/core/testing';
import { PROPERTIES_RESOURCE_BASE_PATH } from '@demo/demo/data-model/properties';
import {
  createPersistentProperties,
  createPersistentProperty,
  createTransientProperty
} from '@demo/demo/data-model/properties/test';
import { RestService } from '@demo/shared/data-access';
import { restServiceFixture } from '@demo/shared/data-access/test';
import { RequestOptions } from '@ngdux/data-model-common';
import { cold } from 'jest-marbles';
import { PropertyService } from './property.service';

describe('PropertiesService', () => {
  const property = createPersistentProperty();
  const properties = createPersistentProperties();
  let service: PropertyService;
  let mockRestService: Partial<RestService>;

  beforeEach(() => {
    mockRestService = restServiceFixture.getMockRestService(property, properties);

    TestBed.configureTestingModule({
      providers: [PropertyService, { provide: RestService, useValue: mockRestService }]
    });

    service = TestBed.inject(PropertyService);
    mockRestService = TestBed.inject(RestService);
  });

  it('loadResource', () => {
    const expected = cold('(u|)', { u: property });

    const actual = service.loadResource(property.id);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.loadResource).toHaveBeenCalledTimes(1);
    expect(mockRestService.loadResource).toHaveBeenCalledWith(`${PROPERTIES_RESOURCE_BASE_PATH}/${property.id}`);
  });

  describe('createResource', () => {
    it('creates property when a transient property is given', () => {
      const transientResource = createTransientProperty();
      const expected = cold('(u|)', { u: property });

      const actual = service.createResource(transientResource);

      expect(actual).toBeObservable(expected);
      expect(mockRestService.createResource).toHaveBeenCalledTimes(1);
      expect(mockRestService.createResource).toHaveBeenCalledWith(PROPERTIES_RESOURCE_BASE_PATH, transientResource);
    });
  });

  describe('saveResource', () => {
    it('updates property when a persistent property is given', () => {
      const expected = cold('(u|)', { u: property });

      const actual = service.saveResource(property);

      expect(actual).toBeObservable(expected);
      expect(mockRestService.updateResource).toHaveBeenCalledTimes(1);
      expect(mockRestService.updateResource).toHaveBeenCalledWith(
        `${PROPERTIES_RESOURCE_BASE_PATH}/${property.id}`,
        property
      );
    });
  });

  it('deleteResource', () => {
    const expected = cold('(|)');

    const actual = service.deleteResource(property.id);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.deleteResource).toHaveBeenCalledTimes(1);
    expect(mockRestService.deleteResource).toHaveBeenCalledWith(`${PROPERTIES_RESOURCE_BASE_PATH}/${property.id}`);
  });

  it('queryResources', () => {
    const options: RequestOptions = {
      pagingOptions: {
        page: 1,
        pageSize: 10
      }
    };
    const expected = cold('(u|)', { u: properties });

    const actual = service.loadResources(options);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.queryResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.queryResources).toHaveBeenCalledWith(PROPERTIES_RESOURCE_BASE_PATH, options);
  });

  it('deleteResources', () => {
    const expected = cold('(u|)', { u: properties });
    const ids: string[] = properties.map(property => property.id);

    const actual = service.deleteResources(ids);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.deleteResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.deleteResources).toHaveBeenCalledWith(PROPERTIES_RESOURCE_BASE_PATH, ids);
  });

  it('patchResources', () => {
    const expected = cold('(u|)', { u: properties });
    const ids: string[] = properties.map(property => property.id);

    const actual = service.patchResources(ids, property);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.patchResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.patchResources).toHaveBeenCalledWith(
      PROPERTIES_RESOURCE_BASE_PATH,
      ids.map(id => ({
        id,
        resource: property
      }))
    );
  });
});
