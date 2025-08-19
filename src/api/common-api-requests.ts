import axios from 'axios';
import { HttpMethods } from './http-methods.ts';
import { CommonApiData, CommonApiOptions } from './models/common.interfaces.ts';

/**

/**
 * API request function.
 * Template implementation - customize for your application needs.
 *
 * **Template Notes:**
 * - Add logging functionality as needed for your project
 * - This module can be refactored to use Playwright's request context instead of axios
 * - Consider using `page.request` or `request` fixture from Playwright for better integration
 *
 * @param data - API request configuration
 * @param options - Request options and behavior configuration
 * @param options.allowBadRequest - Controls error handling behavior:
 *   - `false` (default): Use for positive tests where you expect only valid results. Throws errors on bad responses.
 *   - `true`: Use for negative tests where you expect and want to handle error responses gracefully.
 * @param options.expectedResponseCode - Expected HTTP status code for validation
 * @param options.returnType - Type of response to return ('data', 'both', 'full')
 *
 * @returns Response data based on returnType configuration
 * @throws Error when allowBadRequest is false and request fails
 */
export async function sendCommonApiRequest(data: CommonApiData, options: CommonApiOptions = {}) {
    const { baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api', method, endpoint, body = null, token } = data;
    const {
        allowBadRequest = false,
        returnType = 'data',
    } = options;

    const requestUrl = `${baseUrl}/${endpoint}`;
    const headers = await generateCommonHeaders(token || 'token'); // Your token here or just remove it
    const validateStatus = (status: number) => allowBadRequest || status < 400;

    let response;

    switch (method) {
        case HttpMethods.GET:
            response = await axios.get(requestUrl, { headers, validateStatus });
            break;
        case HttpMethods.POST:
            response = await axios.post(requestUrl, body, { headers, validateStatus });
            break;
        case HttpMethods.PUT:
            response = await axios.put(requestUrl, body, { headers, validateStatus });
            break;
        case HttpMethods.DELETE:
            response = await axios.delete(requestUrl, { headers, validateStatus });
            break;
        case HttpMethods.PATCH:
            response = await axios.patch(requestUrl, body, { headers, validateStatus });
            break;
        default:
            throw new Error(`Unsupported method: ${method}`);
    }

    const responseData = response.data;

    switch (returnType) {
        case 'data':
            return responseData;
        case 'both':
            return { response, responseData };
        case 'full':
            return response;
        default:
            return responseData;
    }
}

/**
 * Function for headers which can be used in every request.
 * Template implementation - customize authentication headers as needed.
 *
 * @param authToken - Optional authentication token
 * @returns Headers object for API requests
 */
async function generateCommonHeaders(authToken: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
        accept: '*/*',
        'Content-Type': 'application/json',
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
}
