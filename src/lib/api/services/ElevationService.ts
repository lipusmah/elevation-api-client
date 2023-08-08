/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ElevationDetails } from '../models/ElevationDetails';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ElevationService {

    /**
     * Elevation
     * @param x
     * @param y
     * @param srid
     * @param proj
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getElevation(
        x: number,
        y: number,
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/elevation/{x}/{y}',
            path: {
                'x': x,
                'y': y,
            },
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
     * Elevation Details
     * @param x
     * @param y
     * @param srid
     * @param proj
     * @returns ElevationDetails Successful Response
     * @throws ApiError
     */
    public static getElevationDetails(
        x: number,
        y: number,
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<ElevationDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/elevation/{x}/{y}/details',
            path: {
                'x': x,
                'y': y,
            },
            query: {
                'srid': srid,
                'proj': proj,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
