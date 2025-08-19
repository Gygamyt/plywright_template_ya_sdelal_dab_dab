# Template Playwright Framework

A comprehensive template for Playwright test automation framework with TypeScript, designed for scalable E2E and API testing.

**Built following SOSAL methodology** ([Socially-Oriented Software Architecture & Logic](https://habr.com/ru/articles/916930/)) - a social approach to programming that emphasizes team collaboration, learning, and maintainable code architecture.

## 📋 Table of Contents

- Overview
- Features
- Project Structure
- Getting Started
- Configuration
- Writing Tests
- Guidelines
- Best Practices
- Contributing

## 🎯 Overview

This template provides a production-ready Playwright framework with:
- **Page Object Model (POM)** pattern for maintainable UI tests
- **API Client architecture** for robust API testing
- **TypeScript** for type safety and better developer experience
- **Fixture-based** test organization
- **Environment validation** with Zod
- **Comprehensive guidelines** for consistent development

## ✨ Features

- 🏗️ **Modular Architecture**: Clean separation between page objects, API clients, and test logic
- 🔒 **Type Safety**: Full TypeScript support with Zod validation
- 🧪 **Dual Testing**: Both E2E and API test capabilities
- 📦 **Fixture Management**: Reusable fixtures for pages and API clients
- 🌍 **Environment Management**: Validated environment configuration
- 📖 **Documentation**: Comprehensive guidelines and examples
- 🔧 **Ready to Use**: Pre-configured with best practices

## 📁 Project Structure

    template_playwright_framework/
    ├── src/
    │   ├── api/                          # API testing components
    │   │   ├── clients/                  # API client implementations
    │   │   │   ├── template_api_client/
    │   │   │   │   └── template.api-client.ts
    │   │   │   ├── API_CLIENTS_GUIDELINES.md
    │   │   │   └── base.api-client.ts
    │   │   ├── config/
    │   │   │   └── urls.ts              # API endpoints with validation
    │   │   ├── models/
    │   │   │   └── common.interfaces.ts # API interfaces
    │   │   ├── common-api-requests.ts   # Common API request utilities
    │   │   └── http-methods.ts          # HTTP methods enumeration
    │   ├── fixtures/
    │   │   └── fixture.ts              # Playwright fixtures
    │   ├── utils/
    │   │   └── env_helper/
    │   │       └── env.ts              # Environment validation
    │   └── web/                        # Web UI testing components
    │       ├── pagemanagers/           # Page manager classes
    │       │   ├── base.manager.ts
    │       │   └── user-template.manager.ts
    │       └── pageobjects/            # Page object classes
    │           ├── login/
    │           │   └── login.page.ts
    │           ├── base.page.ts
    │           └── POM_GUIDELINES.md
    ├── tests/                          # Test files
    │   ├── api/
    │   │   └── template.api.test.ts   # API tests
    │   └── web/
    │       └── template.web.test.ts   # E2E tests
    ├── .env.example                   # Environment variables template
    ├── package.json                   # Dependencies and scripts
    ├── playwright.config.ts           # Playwright configuration
    └── tsconfig.json                 # TypeScript configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

1. **Clone or download this template**

2. **Install dependencies:**

   npm install

3. **Install Playwright browsers:**

   npx playwright install

4. **Setup environment:**

   cp .env.example .env
   # Edit .env with your application settings

### Quick Start

1. **Update environment variables** in .env:

   BASE_URL=https://your-app.com
   MAIN_USER_LOGIN=user@example.com
   MAIN_USER_PASSWORD=your-password

2. **Replace template code** with your application logic:
    - Update page objects in src/web/pageobjects/
    - Update API clients in src/api/clients/
    - Update URLs in src/api/config/urls.ts

3. **Run template tests:**

   npm run test        # Run all tests
   npm run test:ui     # Run with UI mode
   npm run test:debug  # Run in debug mode

## ⚙️ Configuration

### Environment Variables

The framework uses Zod for environment validation. Configure in src/utils/env_helper/env.ts:

    const schema = z.object({
      BASE_URL: z.string().url(),
      MAIN_USER_LOGIN: z.string().min(1),
      MAIN_USER_PASSWORD: z.string().min(1),
      // Add your variables here
    });

### Playwright Configuration

Update playwright.config.ts for your needs:
- Browser selection
- Test directory paths
- Reporter configuration
- Viewport settings

### API URLs Configuration

Configure API endpoints in src/api/config/urls.ts:

    const urlsConfig = {
      auth: {
        login: 'auth/login',
        logout: 'auth/logout',
      },
      users: {
        profile: 'users/profile',
        create: 'users',
      },
      // Add your endpoints here
    };

## 🧪 Writing Tests

### E2E Tests

    import { test } from '../src/fixtures/fixture.ts';
    import { expect } from '@playwright/test';

    test.describe('Template Feature Tests', () => {
      test('should login successfully', async ({ templatePageManager }) => {
        await templatePageManager.loginPage.navigateToLogin();
        await templatePageManager.loginPage.login('user@test.com', 'password');
        await expect(templatePageManager.loginPage.messages.success).toBeVisible();
      });
    });

### API Tests

    import { test } from '../src/fixtures/fixture.ts';
    import { expect } from '@playwright/test';

    test.describe('Template API Tests', () => {
      test('should authenticate user', async ({ templateAPIClient }) => {
        const response = await templateAPIClient.login({
          email: 'user@test.com',
          password: 'password'
        });
        
        expect(response.token).toBeDefined();
      });
    });

## 📚 Guidelines

This framework includes comprehensive guidelines:

### Page Object Model Guidelines
- **Location**: src/web/pageobjects/POM_GUIDELINES.md
- **Covers**: Page Object patterns, locator organization, test structure
- **Key concepts**: Locator encapsulation, method design, "Lego constructor" pattern

### API Clients Guidelines
- **Location**: src/api/clients/API_CLIENTS_GUIDELINES.md
- **Covers**: API client architecture, error handling, test organization
- **Key concepts**: CRUD operations, authentication patterns, request strategies

## 🔧 Available Scripts

    npm run test              # Run all tests
    npm run test:ui           # Run tests in UI mode
    npm run test:debug        # Run tests in debug mode
    npm run codegen           # Generate test code
    npm run report            # Show HTML report
    npm run lint              # Run linting
    npm run lint:fix          # Fix linting issues
    npm run prettier:write    # Format code

## 🛠️ Customization

### Adding New Page Objects

1. Create page class in src/web/pageobjects/:

   export class NewPage extends BasePage {
   private buttons = {
   submit: this.page.locator('[data-testid="qa-btn-submit"]'),
   };

   private inputs = {
   title: this.page.locator('[data-testid="qa-input-title"]'),
   };
   }

2. Add to page manager:

   export class TemplatePageManager extends BasePageManager {
   readonly newPage: NewPage;

   constructor(page: Page) {
   super(page);
   this.newPage = new NewPage(page);
   }
   }

### Adding New API Clients

1. Create API client in src/api/clients/:

   export class NewAPIClient extends BaseAPIClient {
   async getData(id: string, token?: string): Promise<Data> {
   return await sendCommonApiRequest({
   method: HttpMethods.GET,
   endpoint: `${this.urls.newEndpoint.get}/${id}`,
   token,
   });
   }
   }

2. Add fixture in src/fixtures/fixture.ts:

   newAPIClient: async ({}, use) => {
   await use(new NewAPIClient());
   },

### Adding Environment Variables

1. Update src/utils/env_helper/env.ts:

   const schema = z.object({
   // existing variables...
   NEW_VARIABLE: z.string().min(1),
   });

2. Update .env.example:

   NEW_VARIABLE=your_value

## 🏗️ Architecture Principles

### Page Object Model
- **Encapsulated locators** in JSON objects
- **Minimal methods** - only for complex actions
- **Hierarchical organization** for complex pages
- **Parameterized locators** for dynamic elements

### API Clients
- **Grouped endpoints** by functionality
- **Consistent error handling** with allowBadRequest
- **Token management** for authentication
- **Type-safe requests** and responses

### Test Organization
- **Mandatory describe blocks** - no standalone tests
- **Nested organization** for logical grouping
- **Parameterized testing** for coverage
- **Fixture-based setup** for reusability

## 🔍 Key Files to Customize

When adapting this template for your project:

1. **Environment**: Update .env and src/utils/env_helper/env.ts
2. **URLs**: Configure src/api/config/urls.ts
3. **Page Objects**: Replace templates in src/web/pageobjects/
4. **API Clients**: Replace templates in src/api/clients/
5. **Tests**: Update test files in tests/
6. **Config**: Adjust playwright.config.ts and tsconfig.json

## 📝 Notes

- **Template Code**: All code is marked as template - replace with your application logic
- **Selectors**: Update data-testid selectors to match your application
- **URLs**: Replace template URLs with actual API endpoints
- **Authentication**: Implement your actual authentication flow
- **Validation**: Adjust Zod schemas for your data structures

## 🤝 Contributing

1. Follow the established patterns and guidelines
2. Update documentation when adding new features
3. Use consistent naming conventions
4. Add JSDoc comments for complex logic

## 📄 License

This template is provided as-is for educational and development purposes. Adapt and modify according to your project needs.

---

**Ready to start testing!** 🚀

Replace the template code with your application logic and start building robust, maintainable test automation.
