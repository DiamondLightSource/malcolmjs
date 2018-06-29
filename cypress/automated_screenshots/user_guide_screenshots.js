describe('User guide screenshots', () => {
  it('example UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/PANDA:CLOCKS');
    cy.wait(3000);
    cy.wait(1000);
    cy.screenshot('example-ui');
  });
});
