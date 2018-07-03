describe('User guide screenshots', () => {
  it('example UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/PANDA:CLOCKS');
    cy.wait(3000);
    cy.wait(1000);
    cy.screenshot('example-ui');
  });

  it('starting UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/');
    cy.wait(1000);
    cy.screenshot('starting-ui');

    cy
      .get('[data-cy=navmenu]')
      .first()
      .click();
    cy.screenshot('block-list');

    cy.contains('PANDA').click();
    cy.contains('Health'); // wait for details to load
    cy.screenshot('PANDA-block-details');

    cy.screenshot('layout-button', {
      clip: { x: 0, y: 138, width: 360, height: 47 },
    });

    cy.visit('/gui/PANDA/layout');
    cy.wait(3000);
    cy.wait(1000);
    cy.screenshot('PANDA-layout');
  });
});
