import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@demo/shared/util-configuration';
import {
  FilteringField,
  FilteringOptions,
  PagingOptions,
  RequestOptions,
  SortingDirection,
  SortingField
} from '@ngdux/data-model-common';
import { Observable } from 'rxjs';
import { AbstractRestService } from './abstract-rest.service';

@Injectable({ providedIn: 'root' })
export class RestService extends AbstractRestService {
  constructor(http: HttpClient, configurationService: ConfigurationService) {
    const configuration = configurationService.getConfiguration();
    super(http, configuration?.apiBaseUrl);
  }

  public override loadResource<T>(resourcePath: string): Observable<T> {
    return super.loadResource<T>(resourcePath);
  }

  public override loadResources<T>(resourcePath: string, options: Partial<RequestOptions> = {}): Observable<T[]> {
    return super.loadResources<T>(resourcePath, options);
  }

  protected createRequestParameters(options: Partial<RequestOptions>): Record<string, string> {
    return {
      ...(options.requestParameters || {}),
      ...this.getPagingParameters(options.pagingOptions),
      ...this.getSortingParameters(options.sortingOptions),
      ...this.getFilteringParameters(options.filteringOptions)
    };
  }

  private getPagingParameters(options: PagingOptions | undefined): Record<string, string> {
    const pagingParameters: Record<string, string> = {};

    if (options) {
      pagingParameters['page'] = options.page.toString();
      pagingParameters['pageSize'] = options.pageSize.toString();
    }

    return pagingParameters;
  }

  private getSortingParameters(options: SortingField[] | undefined): Record<string, string> {
    const fieldNames: string[] = [];
    const orders: string[] = [];

    if (options) {
      options.forEach(option => {
        if (option.direction !== SortingDirection.NONE) {
          fieldNames.push(option.field);
          orders.push(option.direction);
        }
      });
    }

    if (!fieldNames.length) {
      return {};
    }

    return {
      _sort: fieldNames.join(','),
      _order: orders.join(',')
    };
  }

  private getFilteringParameters(options: FilteringOptions | undefined): Record<string, string> {
    const filteringParameters: Record<string, string> = {};

    if (options) {
      (options.filters as FilteringField[]).forEach((filter: FilteringField) => {
        filteringParameters[filter.field] = filter.value;
      });
    }

    return filteringParameters;
  }

  public override queryResources<T>(resourcePath = '', options: Partial<RequestOptions> = {}): Observable<T[]> {
    return super.queryResources<T>(`${resourcePath}/query`, options);
  }

  protected createRequestQuery(options: Partial<RequestOptions>) {
    return {
      ...(options.requestParameters || {}),
      ...(options.pagingOptions || {}),
      ...this.getSortingQuery(options.sortingOptions),
      ...this.getFilteringQuery(options.filteringOptions)
    };
  }

  private getSortingQuery(options: SortingField[] | undefined) {
    if (!options || options.length === 0) {
      return {};
    }

    return {
      sort: options
        .filter(option => option.direction !== SortingDirection.NONE)
        .map(option => {
          return {
            field: option.field,
            direction: option.direction === SortingDirection.ASCENDING ? 'asc' : 'desc'
          };
        })
    };
  }

  private getFilteringQuery(options: FilteringOptions | undefined) {
    if (!options || options.filters.length === 0) {
      return {};
    }

    return { filter: options };
  }

  public override createResource<T, C = T>(resourcePath: string, dto: C): Observable<T> {
    return super.createResource<T, C>(resourcePath, dto);
  }

  public override createResources<T, C = T>(resourcePath: string, dtos: C[]): Observable<T[]> {
    return super.createResources<T, C>(`${resourcePath}/bulk`, dtos);
  }

  public override updateResource<T, U = T>(resourcePath: string, dto: U): Observable<T> {
    return super.updateResource<T, U>(resourcePath, dto);
  }

  public override updateResources<T, U = T>(resourcePath: string, dtos: U[]): Observable<T[]> {
    return super.updateResources<T, U>(`${resourcePath}/bulk`, dtos);
  }

  public override patchResource<T, P>(resourcePath: string, dto: P): Observable<T> {
    return super.patchResource<T, P>(resourcePath, dto);
  }

  public override patchResources<T, P>(resourcePath: string, dtos: P[]): Observable<T[]> {
    return super.patchResources<T, P>(`${resourcePath}/bulk`, dtos);
  }

  public override deleteResource<T>(resourcePath: string): Observable<T> {
    return super.deleteResource<T>(resourcePath);
  }

  public override deleteResources<T>(resourcePath: string, resourceIds: string[]): Observable<T[]> {
    return super.deleteResources<T>(`${resourcePath}/bulk`, resourceIds);
  }
}
