/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ElevationProfile } from '../models/ElevationProfile';
import type { LineString } from '../models/LineString';
import type { MultiLineString } from '../models/MultiLineString';
import type { MultiPoint } from '../models/MultiPoint';
import type { MultiPolygon } from '../models/MultiPolygon';
import type { Point } from '../models/Point';
import type { Polygon } from '../models/Polygon';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GeometryService {

    /**
     * Get Z
     * @param requestBody
     * @param interpolate
     * @param srid
     * @param proj
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getZList(
        requestBody: (LineString | Polygon),
        interpolate?: number,
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/geometry/get_z',
            query: {
                'interpolate': interpolate,
                'srid': srid,
                'proj': proj,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get M
     * @param requestBody
     * @param interpolate
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getMListDetails(
        requestBody: (LineString | Polygon),
        interpolate?: number,
    ): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/geometry/get_m',
            query: {
                'interpolate': interpolate,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Zm
     * @param requestBody
     * @param interpolate
     * @param srid
     * @param proj
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getZmList(
        requestBody: (LineString | Polygon),
        interpolate?: number,
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<Array<Array<any>>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/geometry/get_zm',
            query: {
                'interpolate': interpolate,
                'srid': srid,
                'proj': proj,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Append Z
     * @param requestBody
     * @param interpolate
     * @param srid
     * @param proj
     * @returns any Successful Response
     * @throws ApiError
     */
    public static appendZ(
        requestBody: (Point | LineString | Polygon),
        interpolate?: number,
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/geometry/append_z',
            query: {
                'interpolate': interpolate,
                'srid': srid,
                'proj': proj,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Append M
     * @param requestBody
     * @param interpolate
     * @param srid
     * @param proj
     * @returns any Successful Response
     * @throws ApiError
     */
    public static appendZ1(
        requestBody: (Point | LineString | Polygon),
        interpolate?: number,
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/geometry/append_m',
            query: {
                'interpolate': interpolate,
                'srid': srid,
                'proj': proj,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Elevation Profile
     * @param requestBody
     * @param interpolate
     * @param srid
     * @param proj
     * @returns ElevationProfile Successful Response
     * @throws ApiError
     */
    public static elevationProfile(
        requestBody: (LineString | Polygon),
        interpolate?: number,
        srid: number = 3857,
        proj?: string,
    ): CancelablePromise<ElevationProfile> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/geometry/profile',
            query: {
                'interpolate': interpolate,
                'srid': srid,
                'proj': proj,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reproject
     * @param requestBody
     * @param interpolate
     * @param inSrid
     * @param outSrid
     * @param inProj
     * @param outProj
     * @returns any Successful Response
     * @throws ApiError
     */
    public static reproject(
        requestBody: (Point | LineString | Polygon),
        interpolate?: number,
        inSrid: number = 3857,
        outSrid: number = 3857,
        inProj?: string,
        outProj?: string,
    ): CancelablePromise<(Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/geometry/reproject',
            query: {
                'interpolate': interpolate,
                'in_srid': inSrid,
                'out_srid': outSrid,
                'in_proj': inProj,
                'out_proj': outProj,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
