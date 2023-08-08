/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GeoTiffDatasource } from '../models/GeoTiffDatasource';
import type { Projection } from '../models/Projection';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MetadataService {

    /**
     * Datasources
     * @param srid
     * @param proj
     * @returns GeoTiffDatasource Successful Response
     * @throws ApiError
     */
    public static datasourcesMetadataDatasourcesGet(
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<Array<GeoTiffDatasource>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metadata/datasources',
            query: {
                'srid': srid,
                'proj': proj,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Spatial Refs
     * @param srid
     * @returns Projection Successful Response
     * @throws ApiError
     */
    public static spatialRefsMetadataSrsSridGet(
        srid: number,
    ): CancelablePromise<Projection> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metadata/srs/{srid}',
            path: {
                'srid': srid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
