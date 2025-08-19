import { BaseAPIClient } from "../base.api-client.ts";
import { sendCommonApiRequest } from "../../common-api-requests.ts";
import { HttpMethods } from "../../http-methods.ts";

/**
 * Template API client for demonstration purposes.
 * Replace with your actual API client implementation.
 */
export class TemplateAPIClient extends BaseAPIClient {
    /**
     * Template method to get data.
     * Replace with your actual API method.
     */
    async getData(token?: string): Promise<any> {
        return await sendCommonApiRequest({
            baseUrl: this.getBaseUrl(),
            method: HttpMethods.GET,
            endpoint: this.urls.template.getData,
            token,
        });
    }

    /**
     * Template method to post data.
     * Replace with your actual API method.
     */
    async postData(data: any, token?: string): Promise<any> {
        return await sendCommonApiRequest({
            baseUrl: this.getBaseUrl(),
            method: HttpMethods.POST,
            endpoint: this.urls.template.postData,
            body: data,
            token,
        });
    }

    /**
     * Template authentication method.
     * Replace with your actual login implementation.
     */
    async login(credentials: { email: string; password: string }): Promise<any> {
        return await sendCommonApiRequest({
            baseUrl: this.getBaseUrl(),
            method: HttpMethods.POST,
            endpoint: this.urls.auth.login,
            body: credentials,
        });
    }
}
