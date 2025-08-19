import { urls } from '../config/urls.ts';
import { env } from "../../utils/env_helper/env.ts";

/**
 * Base API client providing common functionality for all API clients.
 * Template implementation - extend for specific API operations.
 */
export class BaseAPIClient {
    protected readonly urls: typeof urls;

    constructor() {
        this.urls = urls;
    }

    /**
     * Get base URL for API requests.
     * Template method - customize based on your environment configuration.
     * Or just remove it
     */
    protected getBaseUrl(): string {
        return env.API_BASE_URL;
    }
}
