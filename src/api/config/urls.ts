import { z } from 'zod';

/**
 * Validation schema for API URLs configuration.
 * Template implementation - customize endpoints for your application.
 */
const urlsSchema = z.object({
    /**
     * Authentication endpoints
     */
    auth: z.object({
        login: z.string().default('auth/login'),
        logout: z.string().default('auth/logout'),
        refresh: z.string().default('auth/refresh'),
    }),

    /**
     * User management endpoints
     */
    users: z.object({
        profile: z.string().default('users/profile'),
        create: z.string().default('users'),
        update: z.string().default('users'),
        delete: z.string().default('users'),
    }),

    /**
     * Template endpoints - replace with your application endpoints
     */
    template: z.object({
        getData: z.string().default('template/data'),
        postData: z.string().default('template/data'),
        updateData: z.string().default('template/data'),
        deleteData: z.string().default('template/data'),
    }),
});

/**
 * Template URLs configuration.
 * Replace with your actual API endpoints.
 */
const urlsConfig = {
    auth: {
        login: 'auth/login',
        logout: 'auth/logout',
        refresh: 'auth/refresh',
    },
    users: {
        profile: 'users/profile',
        create: 'users',
        update: 'users',
        delete: 'users',
    },
    template: {
        getData: 'template/data',
        postData: 'template/data',
        updateData: 'template/data',
        deleteData: 'template/data',
    },
};

/**
 * Parsed and validated URLs configuration.
 */
export const urls = urlsSchema.parse(urlsConfig);
export type UrlsConfig = z.infer<typeof urlsSchema>;
