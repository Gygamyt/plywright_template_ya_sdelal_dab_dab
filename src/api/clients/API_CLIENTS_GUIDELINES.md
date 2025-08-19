# API Clients & Test Automation Strategy

## Overview

This document outlines the strategic approach for writing API clients and automated API tests using Playwright with TypeScript. Our architecture promotes consistency, reusability, and clear API test organization.

## API Client Architecture

### 1. API Client Design Principles

API clients should follow clear patterns with organized method structure and reusable components.

    export class TemplateAPIClient extends BaseAPIClient {
      // Group related endpoints logically
      async authenticate(credentials: LoginCredentials): Promise<AuthResponse> {
        return await sendCommonApiRequest({
          method: HttpMethods.POST,
          endpoint: this.urls.auth.login,
          body: credentials,
        });
      }

      async getUserData(userId: string, token?: string): Promise<UserData> {
        return await sendCommonApiRequest({
          method: HttpMethods.GET,
          endpoint: `${this.urls.users.profile}/${userId}`,
          token,
        });
      }

      async updateUserData(userId: string, data: UserUpdateData, token?: string): Promise<UserData> {
        return await sendCommonApiRequest({
          method: HttpMethods.PUT,
          endpoint: `${this.urls.users.update}/${userId}`,
          body: data,
          token,
        });
      }
    }

### 2. Base API Client Structure

All API clients should extend BaseAPIClient for consistency:

    export class BaseAPIClient {
      protected readonly urls: typeof urls;

      constructor() {
        this.urls = urls;
      }

      protected getBaseUrl(): string {
        return process.env.API_BASE_URL || 'http://localhost:3000/api';
      }
    }

### 3. URL Configuration with Validation

Use Zod for URL validation and type safety:

    const urlsSchema = z.object({
      auth: z.object({
        login: z.string().default('auth/login'),
        logout: z.string().default('auth/logout'),
        refresh: z.string().default('auth/refresh'),
      }),
      users: z.object({
        profile: z.string().default('users/profile'),
        create: z.string().default('users'),
        update: z.string().default('users'),
      }),
      // Add more endpoint groups as needed
    });

## API Client Usage in Tests

### 1. Fixture-Based API Clients

Use fixtures for API clients just like page managers:

    // In fixtures
    templateAPIClient: async ({}, use) => {
      await use(new TemplateAPIClient());
    },

    authenticatedTemplateAPIClient: async ({}, use) => {
      const client = new TemplateAPIClient();
      const authResponse = await client.authenticate({
        email: env.MAIN_USER_LOGIN,
        password: env.MAIN_USER_PASSWORD,
      });
      // Store token for subsequent requests if needed
      await use(client);
    },

### 2. API Test Organization

Structure API tests similar to E2E tests with clear describe blocks:

    test.describe('Template API Tests', () => {
      test.describe('Authentication', () => {
        test('should login with valid credentials', async ({ templateAPIClient }) => {
          const response = await templateAPIClient.authenticate({
            email: 'user@template.com',
            password: 'password123',
          });

          expect(response).toHaveProperty('token');
          expect(response.user.email).toBe('user@template.com');
        });

        test('should reject invalid credentials', async ({ templateAPIClient }) => {
          const response = await sendCommonApiRequest(
            {
              method: HttpMethods.POST,
              endpoint: 'auth/login',
              body: { email: 'invalid@email.com', password: 'wrong' },
            },
            { allowBadRequest: true }
          );

          expect(response.error.status).toBe(401);
        });
      });

      test.describe('User Management', () => {
        test('should get user data', async ({ authenticatedTemplateAPIClient }) => {
          const userData = await authenticatedTemplateAPIClient.getUserData('123');
          
          expect(userData).toHaveProperty('id', '123');
          expect(userData.email).toBeDefined();
        });

        test('should update user data', async ({ authenticatedTemplateAPIClient }) => {
          const updateData = { name: 'Updated Name' };
          const response = await authenticatedTemplateAPIClient.updateUserData('123', updateData);
          
          expect(response.name).toBe('Updated Name');
        });
      });
    });

### 3. API Error Handling Strategy

Use allowBadRequest parameter strategically based on test expectations:

#### Positive Tests (Expect Success)

    test('should create user successfully', async ({ templateAPIClient }) => {
      const userData = {
        email: 'newuser@template.com',
        name: 'New User',
        password: 'securePassword123'
      };

      const response = await templateAPIClient.createUser(userData);
      // allowBadRequest defaults to false - will throw on error
      expect(response.id).toBeDefined();
      expect(response.email).toBe(userData.email);
    });

#### Negative Tests (Expect and Handle Errors)

    test('should reject invalid user data', async ({ templateAPIClient }) => {
      const response = await sendCommonApiRequest(
        {
          method: HttpMethods.POST,
          endpoint: 'users',
          body: { invalid: 'data', email: 'not-an-email' },
        },
        { allowBadRequest: true } // Handle errors gracefully
      );

      expect(response.error.status).toBe(400);
      expect(response.error.message).toContain('validation');
    });

#### Authorization Tests

    test('should deny access without token', async ({ templateAPIClient }) => {
      // This should throw error because allowBadRequest defaults to false
      await expect(async () => {
        await sendCommonApiRequest({
          method: HttpMethods.GET,
          endpoint: 'users/profile/123',
          // No token provided
        });
      }).rejects.toThrow(); // Should throw error for unauthorized access
    });

## Common API Request Patterns

### 1. CRUD Operations Template

    export class TemplateResourceAPIClient extends BaseAPIClient {
      // Create
      async createResource(data: CreateResourceData, token?: string): Promise<ResourceData> {
        return await sendCommonApiRequest({
          method: HttpMethods.POST,
          endpoint: this.urls.resources.create,
          body: data,
          token,
        });
      }

      // Read
      async getResource(id: string, token?: string): Promise<ResourceData> {
        return await sendCommonApiRequest({
          method: HttpMethods.GET,
          endpoint: `${this.urls.resources.get}/${id}`,
          token,
        });
      }

      // Update
      async updateResource(id: string, data: UpdateResourceData, token?: string): Promise<ResourceData> {
        return await sendCommonApiRequest({
          method: HttpMethods.PUT,
          endpoint: `${this.urls.resources.update}/${id}`,
          body: data,
          token,
        });
      }

      // Delete
      async deleteResource(id: string, token?: string): Promise<void> {
        return await sendCommonApiRequest({
          method: HttpMethods.DELETE,
          endpoint: `${this.urls.resources.delete}/${id}`,
          token,
        });
      }

      // List with pagination
      async listResources(params?: { page?: number; limit?: number }, token?: string): Promise<ResourceListData> {
        const queryParams = params ? `?page=${params.page || 1}&limit=${params.limit || 10}` : '';
        return await sendCommonApiRequest({
          method: HttpMethods.GET,
          endpoint: `${this.urls.resources.list}${queryParams}`,
          token,
        });
      }
    }

### 2. Test Data Management

Create helper functions for API test data:

    // In test helpers
    export const templateAPITestData = {
      validUser: {
        email: 'test@template.com',
        name: 'Test User',
        password: 'securePassword123',
      },

      invalidUser: {
        email: 'invalid-email',
        name: '',
        password: '123', // Too short
      },

      resourceData: {
        title: 'Template Resource',
        description: 'Template resource description',
        status: 'active',
      },
    };

    export function generateRandomUser() {
      const timestamp = Date.now();
      return {
        email: `user${timestamp}@template.com`,
        name: `User ${timestamp}`,
        password: 'testPassword123',
      };
    }

## API Test Best Practices

### 1. Test Structure Organization

    test.describe('Template Resource API', () => {
      let resourceId: string;

      test.describe('Resource Creation', () => {
        test('should create resource with valid data', async ({ authenticatedTemplateAPIClient }) => {
          const response = await authenticatedTemplateAPIClient.createResource(
            templateAPITestData.resourceData
          );

          resourceId = response.id; // Store for cleanup
          expect(response.title).toBe(templateAPITestData.resourceData.title);
        });

        test('should reject invalid resource data', async ({ authenticatedTemplateAPIClient }) => {
          const response = await sendCommonApiRequest(
            {
              method: HttpMethods.POST,
              endpoint: 'resources',
              body: { invalid: 'data' },
            },
            { allowBadRequest: true }
          );

          expect(response.error.status).toBe(400);
        });
      });

      test.describe('Resource Management', () => {
        test.beforeEach(async ({ authenticatedTemplateAPIClient }) => {
          // Setup: Create resource for each test
          const response = await authenticatedTemplateAPIClient.createResource(
            templateAPITestData.resourceData
          );
          resourceId = response.id;
        });

        test.afterEach(async ({ authenticatedTemplateAPIClient }) => {
          // Cleanup: Delete resource after each test
          if (resourceId) {
            await authenticatedTemplateAPIClient.deleteResource(resourceId);
          }
        });

        test('should update resource', async ({ authenticatedTemplateAPIClient }) => {
          const updateData = { title: 'Updated Title' };
          const response = await authenticatedTemplateAPIClient.updateResource(resourceId, updateData);
          
          expect(response.title).toBe('Updated Title');
        });
      });
    });

### 2. Authentication Patterns

    // For tests requiring specific user roles
    test.describe('Admin API Tests', () => {
      let adminClient: TemplateAPIClient;
      let adminToken: string;

      test.beforeAll(async () => {
        adminClient = new TemplateAPIClient();
        const response = await adminClient.authenticate({
          email: 'admin@template.com',
          password: 'adminPassword',
        });
        adminToken = response.token;
      });

      test('should access admin endpoints', async () => {
        const response = await sendCommonApiRequest({
          method: HttpMethods.GET,
          endpoint: 'admin/users',
          token: adminToken,
        });

        expect(Array.isArray(response.users)).toBe(true);
      });
    });

### 3. Error Response Validation

    test('should return proper error structure', async ({ templateAPIClient }) => {
      const response = await sendCommonApiRequest(
        {
          method: HttpMethods.POST,
          endpoint: 'users',
          body: { email: 'invalid' },
        },
        { allowBadRequest: true }
      );

      // Validate error response structure
      expect(response).toMatchObject({
        error: {
          status: 400,
          message: expect.any(String),
          details: expect.any(Object),
        },
      });
    });

## Integration with Playwright Request Context

Consider using Playwright's built-in request context for better integration:

    // Alternative to axios - using Playwright's request
    export async function sendPlaywrightApiRequest(
      page: Page, 
      options: { method: string; url: string; data?: any; headers?: Record<string, string> }
    ) {
      return await page.request.fetch(options.url, {
        method: options.method,
        data: options.data,
        headers: options.headers,
      });
    }

**Note:** Replace all template implementations with your actual API endpoints, data structures, and business logic. This framework provides the foundation for scalable API test automation architecture.
