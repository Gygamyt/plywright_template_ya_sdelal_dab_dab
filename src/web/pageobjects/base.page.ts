import { Page } from '@playwright/test';

/**
 * Base page class providing common functionality for all page objects.
 * All page classes should extend this base class.
 */
export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to the specified URL.
     * @param url - The URL to navigate to
     */
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }
}
