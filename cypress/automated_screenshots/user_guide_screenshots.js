describe('User guide screenshots', () => {
  it('example UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/PANDA:CLOCKS');
    cy.waitForDetailsToLoad();
    cy.waitForSnackbarToDisappear();
    cy.screenshot('example-ui');
  });

  it('starting UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/');
    cy.contains('Select a root node').should('be.visible');
    cy
      .get('[data-cy=navmenu]')
      .first()
      .should('not.be.disabled');
    cy.waitForSnackbarToDisappear();
    cy.screenshot('starting-ui');

    cy
      .get('[data-cy=navmenu]')
      .first()
      .click();
    cy.screenshot('block-list');

    cy.contains('PANDA').click();
    cy.waitForDetailsToLoad();
    cy.screenshot('PANDA-block-details');

    cy.screenshot('layout-button', {
      clip: { x: 0, y: 138, width: 360, height: 47 },
    });

    cy.visit('/gui/PANDA/layout');
    cy.waitForDetailsToLoad();
    cy.waitForSnackbarToDisappear();
    cy.screenshot('PANDA-layout');
  });
});
