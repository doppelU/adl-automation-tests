const { defineConfig } = require('cypress');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://test-adl.leonardojose.dev',
    specPattern: [
      '**/*.feature',
      'cypress/e2e/**/*.cy.js',
    ],
    pageLoadTimeout: 120000, // Podemos dejarlo alto por si acaso, aunque no debería ser el factor decisivo
    defaultCommandTimeout: 10000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    // AQUI AÑADIMOS waitForInitialPageLoad
    waitForInitialPageLoad: false, // ¡Este es el cambio clave!
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config, {
        stepDefinitions: [
          'cypress/e2e/step_definitions/**/*.js',
          'cypress/e2e/step_definitions/**/*.ts'
        ]
      });
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    }
  }
});