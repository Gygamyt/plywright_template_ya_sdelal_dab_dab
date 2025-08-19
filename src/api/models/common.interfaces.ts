import { HttpMethod } from '../http-methods.ts';

/**
 * Common API request data structure.
 */
export interface CommonApiData {
    baseUrl?: string;
    method: HttpMethod;
    endpoint: string;
    body?: unknown;
    token?: string;
}

/**
 * Common API request options.
 */
export interface CommonApiOptions {
    allowBadRequest?: boolean;
    expectedResponseCode?: number | null;
    returnType?: 'data' | 'both' | 'full';
}
