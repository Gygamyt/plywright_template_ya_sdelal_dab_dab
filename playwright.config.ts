import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                viewport: { width: 1280, height: 720 }
            },
        },
        {
            name: 'firefox',
            use: {
                browserName: 'firefox',
                viewport: { width: 1280, height: 720 }
            },
        },
        {
            name: 'webkit',
            use: {
                browserName: 'webkit',
                viewport: { width: 1280, height: 720 }
            },
        },
    ],
});
