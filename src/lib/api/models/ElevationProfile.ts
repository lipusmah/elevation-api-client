/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineString } from './LineString';
import type { Polygon } from './Polygon';

export type ElevationProfile = {
    geometry: (LineString | Polygon);
    ms: Array<number>;
    elevations: Array<number>;
    length: number;
    length_3d: number;
    proj: string;
    srid: number;
    min: number;
    max: number;
    gain: number;
    loss: number;
};

