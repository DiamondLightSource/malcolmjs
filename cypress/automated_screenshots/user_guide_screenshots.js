describe('User guide screenshots', () => {
  it('example UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/PANDA:CLOCKS');
    cy.waitForDetailsToLoad();
    cy.waitForSnackbarToDisappear();
    cy.screenshot('example-ui');
  });

  it('quick start', () => {
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

    cy.moveBlock('Soft inputs and constant bits', { x: 450, y: 280 });
    cy.moveBlock('Configurable clocks', { x: 450, y: 460 });
    cy.moveBlock('Up/Down pulse counter', { x: 850, y: 460 });
    cy.moveBlock('LVDS output', { x: 850, y: 280 });

    cy.contains('Configurable clocks').click();

    cy.screenshot('PANDA-layout-spread-out');

    cy
      .get('.port')
      .last()
      .trigger('mousedown', { force: true })
      .trigger('mousemove', { clientX: 700, clientY: 150, force: true });

    cy
      .get('.srd-default-link')
      .last()
      .highlightLink({ x: 695, y: 150 });

    cy.wait(1000);
    cy.screenshot('PANDA-new-link');

    cy
      .get('.port')
      .last()
      .trigger('mouseup', { force: true });
  });
});
