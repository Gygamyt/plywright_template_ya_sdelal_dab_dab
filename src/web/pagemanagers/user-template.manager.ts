import { BasePageManager } from "./base.manager.ts";
import { LoginPage } from "../pageobjects/login/login.page.ts";
import { Page } from "@playwright/test";

/**
 * `TemplatePageManager` is a template page manager for managing page objects in the application.
 *
 * **Template Note:**
 * This is a template implementation. Add your specific page objects and customize as needed.
 *
 * **Purpose:**
 * - Encapsulates page objects and provides centralized access to them.
 * - Provides a structured and organized way to manage interactions with application pages.
 * - Extends `BasePageManager` to inherit shared functionality and establish a consistent interface for page management.
 *
 * **Key Features:**
 * - **Template Pages:** Includes basic template pages that can be replaced with actual application pages.
 * - Enables clear separation of concerns by organizing page objects in a single manager.
 *
 * **Usage:**
 * - Use this manager in tests to access page objects (e.g., `templatePageManager.loginPage`).
 * - Replace template pages with your actual application page objects.
 */
export class TemplatePageManager extends BasePageManager {
    readonly loginPage: LoginPage;

    constructor(page: Page) {
        super(page);
        this.loginPage = new LoginPage(page);
    }
}
