# Page Object Model & Test Automation Strategy

## Overview

This document outlines the strategic approach for writing Page Objects and automated tests using Playwright with TypeScript. Our architecture follows a "Lego constructor" pattern that promotes maintainability, reusability, and clear test readability.

## Core Architecture

### 1. Page Manager Pattern

The PageManager serves as a centralized hub for accessing all page objects, initialized through fixtures and passed to tests. This creates a clear, chainable interface for test actions.

    export class TemplatePageManager {
      public page: Page;
      public loginPage: LoginPage;
      public dashboardPage: DashboardPage;
      public settingsPage: SettingsPage;
      // ... other page objects

      constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        // ... initialize other page objects
      }
    }

### 2. Fixture-Based Initialization

Page Manager is initialized through Playwright fixtures, providing authenticated pages and consistent test setup:

    export const test = base.extend({
      authenticatedPage: async ({ browser }, use) => {
        const page = await browser.newPage();
        // Template authentication logic - replace with actual implementation
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'user@template.com');
        await page.fill('[data-testid="password"]', 'password123');
        await page.click('[data-testid="login-btn"]');
        await use(page);
      },
      templatePageManager: async ({ authenticatedPage }, use) => {
        await use(new TemplatePageManager(authenticatedPage));
      },
    });

## Page Object Design Principles

### 1. Locator Encapsulation Strategy

Locators are encapsulated in JSON objects with descriptive names. This eliminates the need for verbose naming like acceptButton when it's already within a buttons object.

#### Basic Structure

    class LoginPage {
      private buttons = {
        login: this.page.locator('[data-testid="qa-btn-login"]'),
        cancel: this.page.locator('[data-testid="qa-btn-cancel"]'),
        forgotPassword: this.page.locator('[data-testid="qa-btn-forgot-password"]'),
      };

      private inputs = {
        email: this.page.locator('[data-testid="qa-input-email"]'),
        password: this.page.locator('[data-testid="qa-input-password"]'),
      };
    }

#### Hierarchical Organization for Complex Pages

When locator groups become large, create more descriptive nested objects:

    class TemplateSettingsPage {
      private navigation = {
        tabs: {
          general: this.page.locator('[data-testid="qa-tab-general"]'),
          advanced: this.page.locator('[data-testid="qa-tab-advanced"]'),
          notifications: this.page.locator('[data-testid="qa-tab-notifications"]'),
        },
        breadcrumbs: {
          home: this.page.locator('[data-testid="qa-breadcrumb-home"]'),
          settings: this.page.locator('[data-testid="qa-breadcrumb-settings"]'),
        },
      };

      private controls = {
        toggles: {
          mainFeature: this.page.locator('[data-testid="qa-toggle-main"]'),
          advancedMode: this.page.locator('[data-testid="qa-toggle-advanced"]'),
        },
        buttons: {
          save: this.page.locator('[data-testid="qa-btn-save"]'),
          reset: this.page.locator('[data-testid="qa-btn-reset"]'),
        },
      };
    }

### 2. Parameterized Locators

Utilize parameterized locators for dynamic elements to reduce code duplication:

    class TemplateListPage {
      private checkboxes = {
        // Parameterized locator method
        item: (category: string, itemId: string) =>
          this.page.locator(
            `[data-testid="qa-checkbox-${category.toLowerCase()}-${itemId}"]`
          ),

        // Static locators for fixed elements
        selectAll: this.page.locator('[data-testid="qa-checkbox-select-all"]'),
        selectNone: this.page.locator('[data-testid="qa-checkbox-select-none"]'),
      };

      // Usage in methods
      async toggleItem(category: string, itemId: string) {
        await this.checkboxes.item(category, itemId).click();
      }
    }

### 3. Method Design Philosophy

**Avoid creating individual methods for every element.** Only create specific methods when actions are truly unique or complex.

#### ❌ Avoid This Pattern

    // Don't create methods for every simple action
    async function clickLoginButton() {
      await this.buttons.login.click();
    }
    async function clickCancelButton() {
      await this.buttons.cancel.click();
    }
    async function clickSaveButton() {
      await this.buttons.save.click();
    }

#### ✅ Preferred Pattern

    // Direct access through the page manager
    await templatePageManager.loginPage.buttons.login.click();
    await templatePageManager.loginPage.buttons.cancel.click();

    // Or create methods for complex, specific actions
    async function loginWithCredentials(email: string, password: string) {
      await this.inputs.email.fill(email);
      await this.inputs.password.fill(password);
      await this.buttons.login.click();
      await this.waitForSuccessMessage();
    }

## Test Structure & Organization

### 1. Mandatory Main Describe Block

Every test file **must** have a main describe block. Never write standalone tests.

    // ✅ Correct Structure
    test.describe("Template Feature Tests", () => {
      test.beforeEach(async ({ templatePageManager }) => {
        await templatePageManager.dashboardPage.navigateTo();
      });

      test("should perform template action", async ({ templatePageManager }) => {
        // test implementation
      });
    });

    // ❌ Incorrect - No main describe
    test("standalone test", async ({ templatePageManager }) => {
      // This violates our strategy
    });

### 2. Nested Describe Blocks for Organization

Use nested describe blocks to create logical groupings and improve test organization:

    test.describe("Template Dashboard Tests", () => {
      test.describe("User Actions", () => {
        test.describe("Form Submission", () => {
          // Form-specific tests
        });

        test.describe("Data Validation", () => {
          // Validation-specific tests
        });
      });

      test.describe("Navigation", () => {
        // Navigation tests
      });
    });

### 3. Parameterized Testing

Leverage parameterized tests to reduce code duplication and improve coverage:

    const templateTestData = [
      {
        input: "valid@email.com",
        expected: "success",
        description: "valid email",
      },
      {
        input: "invalid-email",
        expected: "error",
        description: "invalid email format",
      },
    ] as const;

    templateTestData.forEach(({ input, expected, description }) => {
      test(`Should handle ${description}`, async ({ templatePageManager }) => {
        await templatePageManager.loginPage.inputs.email.fill(input);
        await templatePageManager.loginPage.buttons.login.click();
        
        if (expected === "success") {
          await expect(templatePageManager.loginPage.messages.success).toBeVisible();
        } else {
          await expect(templatePageManager.loginPage.messages.error).toBeVisible();
        }
      });
    });

### 4. "Lego Constructor" Test Flow

Tests should read like a clear sequence of actions, leveraging the page manager's chainable interface:

    test("Complete template workflow", async ({ templatePageManager }) => {
      // Clear, readable sequence of actions
      await templatePageManager.dashboardPage.navigateTo();
      await templatePageManager.dashboardPage.cards.userProfile.click();
      await templatePageManager.settingsPage.tabs.general.click();
      await templatePageManager.settingsPage.toggles.mainFeature.click();
      await templatePageManager.settingsPage.buttons.save.click();

      // Verification
      await expect(templatePageManager.settingsPage.messages.success).toBeVisible();
    });

## Best Practices

### Data Management

- Use constants for test data and states
- Implement data factories for complex objects
- Separate test data from test logic
- Store template test data in dedicated helpers

### Error Handling

- Implement proper wait strategies in page objects
- Use explicit waits over implicit timeouts
- Handle dynamic content gracefully

### Maintenance

- Regular locator review and updates
- Consistent naming conventions across page objects
- Documentation of complex business logic
- Keep templates updated and well-documented

### Performance

- Minimize page object instantiation overhead
- Reuse authenticated sessions through fixtures
- Implement efficient element waiting strategies

## Template Implementation Examples

### Page Object Example

    class TemplatePage {
      private buttons = {
        submit: this.page.locator('[data-testid="qa-btn-submit"]'),
        cancel: this.page.locator('[data-testid="qa-btn-cancel"]'),
      };

      private forms = {
        main: this.page.locator('[data-testid="qa-form-main"]'),
      };

      private inputs = {
        title: this.page.locator('[data-testid="qa-input-title"]'),
        description: this.page.locator('[data-testid="qa-input-description"]'),
      };

      async fillForm(data: TemplateFormData) {
        await this.inputs.title.fill(data.title);
        await this.inputs.description.fill(data.description);
      }
    }

### Test Implementation Example

    test.describe("Template Feature Tests", () => {
      test.beforeEach(async ({ templatePageManager }) => {
        await templatePageManager.templatePage.navigateTo();
      });

      test.describe("Form Operations", () => {
        test("should submit form successfully", async ({ templatePageManager }) => {
          const testData = {
            title: "Template Title",
            description: "Template Description",
          };

          await templatePageManager.templatePage.fillForm(testData);
          await templatePageManager.templatePage.buttons.submit.click();

          await expect(templatePageManager.templatePage.messages.success).toBeVisible();
        });
      });
    });

**Note:** Replace all template implementations with your actual application logic, selectors, and page structures. This framework provides the foundation for scalable E2E test automation architecture.
