describe('SMG screenshots', () => {
  it('example UI', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/PANDA:CLOCKS');
    cy.wait(4000);
    cy.screenshot('example-ui');
  });

  it('block details', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA');
    cy.wait(2000);

    cy.screenshot('block-details', {
      clip: { x: 0, y: 0, width: 360, height: 675 },
    });

    cy.screenshot('attribute-details', {
      clip: { x: 0, y: 70, width: 360, height: 50 },
    });

    cy.screenshot('methods', {
      clip: { x: 0, y: 500, width: 360, height: 145 },
    });
  });

  it('navbar', () => {
    cy.viewport(1200, 675);
    cy.visit('/gui/PANDA/layout/PANDA:CLOCKS');
    cy.wait(2000);

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
    cy.screenshot('navcontrol children', {
      clip: { x: 360, y: 0, width: 450, height: 300 },
    });
  });
});
