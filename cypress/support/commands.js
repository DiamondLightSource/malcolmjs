// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('moveBlock', (blockName, newLocation) => {
  cy
    .contains(blockName)
    .trigger('mousedown')
    .trigger('mousemove', { clientX: newLocation.x, clientY: newLocation.y })
    .trigger('mouseup', { force: true })
    .click('left');

  cy.wait(1000);
});

Cypress.Commands.add('waitForSnackbarToDisappear', () => {
  // wait for the snackbar to disappear
  cy
    .contains('Connected to WebSocket', { timeout: 15000 })
    .should('have.length', 0);
});

Cypress.Commands.add('waitForDetailsToLoad', () => {
  cy.contains('Health');
});
