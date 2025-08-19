import { test } from '../../src/fixtures/fixture.ts';
import { env } from "../../src/utils/env_helper/env.ts";
import { expect } from "playwright/test";

/**
 * Template E2E test suite.
 * Replace with your actual application test scenarios.
 */
test.describe('Template E2E Tests', () => {
    /**
     * Template test for basic page navigation.
     * Replace with your actual test logic.
     */
    test('should navigate to home page - template test', async ({ templatePageManager }) => {
        // Template: Verify page title
        await expect(templatePageManager.loginPage.messages.successMessage).toHaveText(/Template/);

        // Template: Verify page is loaded
        await expect(templatePageManager.page.locator('body')).toBeVisible();
    });

    /**
     * Template test for login functionality.
     * Replace selectors and logic with your actual login flow.
     */
    test('should login with valid credentials - template test', async ({ templatePageManager }) => {
        // Template: Navigate to login page
        await templatePageManager.loginPage.buttons.login.click();

        // Template: Fill login form
        await templatePageManager.loginPage.inputs.email.fill(env.MAIN_USER_LOGIN);
        await templatePageManager.loginPage.inputs.password.fill(env.MAIN_USER_PASSWORD);

        // Template: Verify successful login (replace with actual success indicator)
        await expect(templatePageManager.page.locator('[data-testid="qa-success-message"]')).toBeVisible();
    });
});
