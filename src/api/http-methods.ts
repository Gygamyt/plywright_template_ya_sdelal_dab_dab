/**
 * HTTP methods enumeration for API requests.
 */
export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export type HttpMethod = keyof typeof HttpMethods;
