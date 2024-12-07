import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        // Add custom tasks here
      });
    },
  },
  env: {
    apiUrl: 'http://localhost:3000/api',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
