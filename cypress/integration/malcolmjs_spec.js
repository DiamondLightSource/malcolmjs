describe('MalcolmJS', () => {
  it('.should() - load correctly', () => {
    cy.request('/reset');
    cy.visit('/gui/');
    cy.title().should('equal', 'MalcolmJS DEV');
    cy.request('/reset');
  });
});
