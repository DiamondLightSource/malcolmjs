describe('SMG screenshots', () => {
  it('example UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/CLOCKS');
    cy.waitForDetailsToLoad();
    cy.waitForSnackbarToDisappear();
    cy.screenshot('example-ui');
  });

  it('block details', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA');
    cy.waitForDetailsToLoad();

    cy.screenshot('block-details', {
      clip: { x: 0, y: 0, width: 360, height: 675 },
    });

    cy.screenshot('attribute-details', {
      clip: { x: 0, y: 70, width: 360, height: 50 },
    });

    cy.screenshot('methods', {
      clip: { x: 0, y: 340, width: 360, height: 110 },
    });
  });

  it('navbar', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/CLOCKS');
    cy.waitForDetailsToLoad();

    cy.screenshot('navbar', {
      clip: { x: 360, y: 0, width: 450, height: 65 },
    });

    cy.screenshot('navcontrol', {
      clip: { x: 380, y: 0, width: 100, height: 65 },
    });

    cy
      .get('[data-cy=navmenu]')
      .first()
      .click();
    cy.screenshot('navcontrol-children', {
      clip: { x: 360, y: 0, width: 450, height: 300 },
    });
  });

  it('layout', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/CLOCKS');
    cy.waitForDetailsToLoad();
    cy.waitForSnackbarToDisappear();

    // cy.moveBlock('Soft inputs and constant bits', { x: 450, y: 280 });
    // cy.moveBlock('Configurable clocks', { x: 450, y: 460 });
    // cy.moveBlock('Up/Down pulse counter', { x: 850, y: 460 });
    // cy.moveBlock('LVDS output', { x: 850, y: 280 });

    cy.contains('Auto layout').click();

    cy
      .get('[data-cy=closedrawer]')
      .eq(1)
      .click();

    cy.screenshot('layout', {
      clip: { x: 360, y: 65, width: 650, height: 700 },
    });
  });
});
