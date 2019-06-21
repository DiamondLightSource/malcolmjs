describe('MalcolmJS', () => {
  it('.should() - load correctly', () => {
    cy.request('/reset');
    cy.visit('/gui/');
    cy.title().should('equal', 'MalcolmJS DEV');
    cy.request('/reset');
  });

  it('combobox should work', () => {
    cy.visit('/details/PANDA:TTLOUT1');
    cy.waitForDetailsToLoad();
    cy.contains('Val Current').should('be.visible'); // wait for details to load

    // click to open combo
    cy.get('[data-cy=combobox]').click();
    // now click an option
    cy.get('[data-cy=choice-1]').click();
    cy.get('[data-cy=combobox]').within(() => {
      cy.get('input').should('have.value', 'ONE');
    });
    // check the dropdown closed
    cy.get('[data-cy=choice-1]').should('not.exist');
  });
});
