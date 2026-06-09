import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    chromeWebSecurity: false,

    env: {
      apiUrl: 'http://127.0.0.1:3000'
    },
    setupNodeEvents(on, config) {
      on('file:preprocessor', vitePreprocessor())
    },
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
  viewportWidth: 460,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
});
