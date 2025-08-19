import { Page, test as base } from '@playwright/test';
import { env } from "../utils/env_helper/env.ts";
import { BasePageManager } from "../web/pagemanagers/base.manager.ts";
import { TemplatePageManager } from "../web/pagemanagers/user-template.manager.ts";
import { TemplateAPIClient } from "../api/clients/template_api_client/template.api-client.ts";

/**
 * Extends the base test environment with custom fixtures.
 * These fixtures provide pre-configured pages and managers for various test scenarios.
 *
 * **Template Note:**
 * This is a template implementation. Customize fixtures based on your application needs.
 */
export const test = base.extend<Fixtures>({
    //region Pages

    /**
     * Provides a logged-in user's page.
     *
     * **Usage:**
     * Use this fixture for tests that require an authenticated user session.
     *
     * **Template Note:**
     * Replace authentication logic with your actual login implementation.
     */
    loggedUserPage: async ({ browser }, use) => {
        const page = await browser.newPage();
        await page.goto(env.BASE_URL);

        // Template authentication - replace with actual login logic
        // Use cookies or API hooks
        await page.fill('[data-testid="qa-input-email"]', env.MAIN_USER_LOGIN);
        await page.fill('[data-testid="qa-input-password"]', env.MAIN_USER_PASSWORD);
        await page.click('[data-testid="qa-btn-login"]');
        await page.waitForLoadState('networkidle');

        await use(page);
        await page.close();
    },

    //endregion

    //region Page Managers

    /**
     * Provides the base page manager.
     *
     * **Usage:**
     * Use this fixture for shared functionality across all pages.
     */
    basePageManager: async ({ basicPage }, use) => {
        await use(new BasePageManager(basicPage));
    },

    /**
     * Provides the template page manager for basic page interactions.
     *
     * **Usage:**
     * Use this fixture for managing interactions with template pages.
     */
    templatePageManager: async ({ basicPage }, use) => {
        await use(new TemplatePageManager(basicPage));
    },

    /**
     * Provides the template page manager for logged-in user interactions.
     *
     * **Usage:**
     * Use this fixture for managing interactions with authenticated user pages.
     */
    loggedUserTemplatePageManager: async ({ loggedUserPage }, use) => {
        await use(new TemplatePageManager(loggedUserPage));
    },

    //endregion

    //region API Clients

    /**
     * Provides a template API client instance.
     *
     * **Usage:**
     * Use this fixture for API interactions in tests.
     *
     * **Template Note:**
     * Replace with your actual API client implementation.
     */
    templateAPIClient: async ({}, use) => {
        const apiClient = new TemplateAPIClient();
        await use(apiClient);
    },

    /**
     * Provides an authenticated template API client instance.
     *
     * **Usage:**
     * Use this fixture for authenticated API interactions in tests.
     *
     * **Template Note:**
     * Replace authentication logic with your actual token retrieval.
     */
    authenticatedTemplateAPIClient: async ({}, use) => {
        const apiClient = new TemplateAPIClient();

        // Template: Get auth token - replace with actual authentication
        // @ts-ignore
        const authResponse = await apiClient.login({
            email: env.MAIN_USER_LOGIN,
            password: env.MAIN_USER_PASSWORD,
        });

        // Store token for future requests if needed
        // apiClient.setToken(authResponse.token);

        await use(apiClient);
    },

    //endregion
});

/**
 * Represents the set of fixtures used in the project.
 * Fixtures provide pre-configured instances of pages and managers
 * to streamline testing and interaction with the application.
 *
 * todo Move it to another file
 *
 * **Template Note:**
 * Add or remove fixtures based on your application requirements.
 */
type Fixtures = {
    /**
     * The page instance for basic interactions.
     * **Note:** Use this only to initialize page managers, not directly in tests.
     */
    basicPage: Page;

    /**
     * The page instance for a logged-in user.
     * **Note:** Use this only to initialize page managers, not directly in tests.
     */
    loggedUserPage: Page;

    /**
     * The base manager for handling pages and common operations.
     * Provides shared functionality for page interactions across tests.
     */
    basePageManager: BasePageManager;

    /**
     * The template page manager for basic page interactions.
     * Use this fixture for tests involving template pages.
     */
    templatePageManager: TemplatePageManager;

    /**
     * The template page manager for logged-in user interactions.
     * Use this fixture for tests involving authenticated template pages.
     */
    loggedUserTemplatePageManager: TemplatePageManager;

    /**
     * Template API client for API interactions.
     * Use this fixture for basic API testing scenarios.
     */
    templateAPIClient: TemplateAPIClient;

    /**
     * Authenticated template API client for protected API interactions.
     * Use this fixture for API tests requiring authentication.
     */
    authenticatedTemplateAPIClient: TemplateAPIClient;
};
