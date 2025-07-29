// cypress/support/commands.js

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');

  // Corrección para el campo de EMAIL (usando el ID)
  cy.get('#email', { timeout: 10000 }).should('be.visible');
  cy.get('#email').type(email);

  // Corrección para el campo de CONTRASEÑA (usando el ID)
  cy.get('#password', { timeout: 10000 }).should('be.visible'); // Añadimos también should('be.visible') para mayor robustez
  cy.get('#password').type(password);

  cy.get('button[type="submit"]').contains('Ingresar').click();
});