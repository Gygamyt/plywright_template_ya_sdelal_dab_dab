import { Page } from '@playwright/test';

/**
 * BasePageManager serves as an abstract foundation for all page managers in the application.
 *
 * **Template Note:**
 * This is a template implementation. Customize for your specific application pages.
 *
 * **Purpose:**
 * - Provides a unified structure and shared functionality for derived page managers.
 * - Establishes a consistent approach to managing Playwright `Page` instances.
 * - Improves maintainability by centralizing common logic across all page managers.
 *
 * **Usage:**
 * - This class is not intended to be used directly.
 * - Extend this class to create specialized page managers for specific pages or functionalities.
 */
export class BasePageManager {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}
