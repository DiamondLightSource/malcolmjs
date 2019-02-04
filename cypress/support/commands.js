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
  cy.log(`Moving block ${blockName} to (${newLocation.x},${newLocation.y})`);
  cy
    .contains(blockName, { log: false })
    .trigger('mousedown', { force: true })
    .trigger('mousemove', {
      clientX: newLocation.x,
      clientY: newLocation.y,
      force: true,
    })
    .trigger('mouseup', { force: true })
    .click('left');

  cy.wait(1000, { log: false });
});

Cypress.Commands.add('waitForSnackbarToDisappear', () => {
  // wait for the snackbar to disappear
  cy.log('Waiting for snackbar to disappear');
  cy.wait(1000, { log: false });
  cy
    .contains('Connected to WebSocket', { timeout: 20000, log: false })
    .should('have.length', 0);
});

Cypress.Commands.add('checkFor', (element, state = true) => {
  cy.wait(1000);
  cy.get(element).should(`${state ? '' : 'not.'}be.visible`);
});

Cypress.Commands.add('waitForComponentToLoad', () => {
  cy.log('Waiting for component to load');
  cy.wait(1000, { log: false });
  cy
    .contains('Loading', { timeout: 5000, log: false })
    .should('have.length', 0);
});

Cypress.Commands.add('waitForDetailsToLoad', () => {
  cy.log('waiting for details to load');
  cy.contains('Health', { log: false });
});

Cypress.Commands.add(
  'highlightLink',
  { prevSubject: true },
  (subject, location) => {
    cy.log(`Highlighting link at (${location.x}, ${location.y})`);

    return cy
      .wrap(subject)
      .children()
      .first()
      .children('path')
      .last()
      .trigger('mouseover', {
        clientX: location.x,
        clientY: location.y,
        force: true,
      });
  }
);
