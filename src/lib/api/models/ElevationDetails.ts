/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GeoTiffDatasource } from './GeoTiffDatasource';

export type ElevationDetails = {
    elevation: number;
    datasource: GeoTiffDatasource;
    reprojected: Array<any>;
    original: Array<any>;
    in_proj: string;
    in_srid?: number;
};

