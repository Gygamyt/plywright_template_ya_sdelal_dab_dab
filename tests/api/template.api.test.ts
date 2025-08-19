import { test } from '../../src/fixtures/fixture.ts';
import { env } from "../../src/utils/env_helper/env.ts";
import { expect } from "playwright/test";

/**
 * Template API test suite using API client fixtures.
 * Replace with your actual API test scenarios.
 */
test.describe('Template API Tests with Fixtures', () => {

    /**
     * Template test for API authentication using API client fixture.
     * Replace with your actual login API endpoint and response structure.
     */
    test('should authenticate user via API client fixture - template test', async ({ templateAPIClient }) => {
        // Template: Login API call using fixture
        const response = await templateAPIClient.login({
            email: env.MAIN_USER_LOGIN,
            password: env.MAIN_USER_PASSWORD,
        });

        // Template: Verify response structure (replace with actual response fields)
        expect(response).toHaveProperty('token');
        expect(response).toHaveProperty('user');
        expect(response.user.email).toBe(env.MAIN_USER_LOGIN);
    });

    /**
     * Template test for GET API endpoint using API client fixture.
     * Replace with your actual GET endpoint and response validation.
     */
    test('should get data from API using client fixture - template test', async ({ templateAPIClient }) => {
        // Template: Get data API call using fixture
        const response = await templateAPIClient.getData();

        // Template: Verify response (replace with actual validation)
        expect(response).toBeDefined();
        expect(Array.isArray(response.data)).toBe(true);
    });

    /**
     * Template test for POST API endpoint using API client fixture.
     * Replace with your actual POST endpoint and data structure.
     */
    test('should post data to API using client fixture - template test', async ({ templateAPIClient }) => {
        const testData = {
            name: 'Template Test',
            description: 'Template test description',
        };

        // Template: Post data API call using fixture
        const response = await templateAPIClient.postData(testData);

        // Template: Verify response (replace with actual validation)
        expect(response).toHaveProperty('id');
        expect(response.name).toBe(testData.name);
        expect(response.description).toBe(testData.description);
    });

    /**
     * Template test for authenticated API endpoint using authenticated client fixture.
     * Replace with your actual protected endpoint logic.
     */
    test('should access protected API endpoint with authenticated client - template test', async ({ authenticatedTemplateAPIClient }) => {
        // Template: Call protected endpoint using authenticated fixture
        const response = await authenticatedTemplateAPIClient.getData();

        // Template: Verify protected data access (replace with actual validation)
        expect(response).toHaveProperty('protectedData');
        expect(response.user).toBeDefined();
    });
});
