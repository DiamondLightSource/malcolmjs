describe('User guide screenshots', () => {
  it('example UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/CLOCKS');
    cy.waitForDetailsToLoad();
    cy.waitForSnackbarToDisappear();
    cy.screenshot('example-ui');
  });

  it('quick start', () => {
    cy.request('/reset');
    cy.viewport(1200, 675);
    cy.visit('/gui/');
    cy.contains('Select a root block').should('be.visible');
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

    cy.moveBlock('Position adder 2', { x: 450, y: 480 });
    cy.moveBlock('TTL output 1', { x: 750, y: 280 });
    cy.moveBlock('Input encoder 1', { x: 450, y: 280 });

    cy.contains('Input encoder 1').click();

    cy.screenshot('PANDA-layout-spread-out');

    cy
      .contains('conn')
      .parent()
      .find('.port')
      .trigger('mousedown', { force: true })
      .trigger('mousemove', { clientX: 700, clientY: 150, force: true });

    cy.wait(1000);
    cy.screenshot('PANDA-new-link');
  });

  it('attribute viewer', () => {
    cy.visit('/gui/PANDA:INENC1/val');
    cy.waitForDetailsToLoad();
    cy.waitForSnackbarToDisappear();
    cy.wait(30000); // wait for attribute plot to collect enough data
    cy.screenshot('Attribute-Table');

    cy.get('[data-cy=plotTab]').click();
    cy.waitForComponentToLoad();
    cy.screenshot('Attribute-Plot');
  });
});
