import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I am logged in as a registered user', () => {
  cy.login('tester@adl.com', 'testerEngineer');
  cy.wait(1000);
});

When('I navigate to the product list', () => {
  cy.get('span.flex-1.ml-4').contains('Entidades').parent().click();
  cy.get('a[href="/articulos"]').contains('Artículos').click();
  cy.contains('Listado de Artículos', { timeout: 20000 }).should('be.visible');
  cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos');
});

Then('I should see the list of products', () => {
  cy.get('table', { timeout: 20000 }).should('be.visible');
});

When('I create a new product named {string}', (productName) => {
  cy.contains('Crear Artículo').click();
  cy.url().should('include', '/articulos/nuevo');

  cy.get('#sku').type('IPHONE-16');
  cy.get('input#name').type(productName);
  cy.get('#stock_quantity').type('100');
  cy.get('#cost_price').clear().type('1200');
  cy.get('#sale_price').clear().type('1500');
  cy.get('#unit').select('Unidad');
  cy.wait(200);

  cy.get('button[type="submit"]').contains('Guardar Cambios').click();
});

Then('the product {string} should appear in the list', (productName) => {
  cy.contains('tr', productName, { timeout: 10000 }).should('be.visible');
});

When('I update the product {string} to {string}', (oldName, newName) => {
  cy.contains('tr', oldName).within(() => {
    cy.get('button.text-indigo-600').click();
  });

  cy.url().should('match', /\/articulos\/\d+\/editar/);
  cy.get('input#name').clear().type(newName);
  cy.get('#stock_quantity').clear().type('120');
  cy.get('#cost_price').clear().type('1350');
  cy.get('#sale_price').clear().type('1800');
  cy.get('#unit').select('Caja');
  cy.wait(200);

  cy.get('button[type="submit"]').contains('Guardar Cambios').click();
});

Then('the product {string} should not be in the list', (productName) => {
  cy.contains('tr', productName).should('not.exist');
});

When('I delete the product {string}', (productName) => {
  cy.contains('tr', productName).within(() => {
    cy.get('button.text-red-600').click();
  });
});

Given('I am not logged in', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

When('I visit the dashboard', () => {
  cy.visit('/dashboard');
});

Then('I should be redirected to the login page', () => {
  cy.url().should('include', '/login');
  cy.get('button[type="submit"]').contains('Ingresar').should('be.visible');
});
