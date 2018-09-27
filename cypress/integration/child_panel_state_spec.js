describe('Child panel', () => {
  describe('layout interactions', () => {
    beforeEach(() => {
      cy.request('/reset');
      cy.visit('/gui/PANDA/layout');
      cy.waitForDetailsToLoad();

      cy.get('[data-cy=childpanel]').should('not.be.visible');
    });

    it('should open when a block is clicked in the layout', () => {
      // click on the block to open the child panel
      cy.contains('TTL output 1').click('left');
      cy.get('[data-cy=childpanel]').should('be.visible');

      // check that a property of TTL output 1 is visible in the details panel
      cy.contains('Val Current').should('be.visible');
    });

    it('should update child panel if already open', () => {
      // first make sure the child panel is open
      cy.contains('TTL output 1').click('left');
      cy.get('[data-cy=childpanel]').should('be.visible');

      // click on another block and make sure the details update
      cy.contains('Input encoder 1').click('left');
      cy.get('[data-cy=childpanel]').should('be.visible');
      cy.contains('Clk Period').should('be.visible');
    });

    it('should not open the child panel if a block was dragged', () => {
      cy.moveBlock('TTL output 1', { x: 450, y: 280 });
      cy.get('[data-cy=childpanel]').should('not.be.visible');
    });

    it('should close the palette when a block is dropped on to the layout', () => {
      cy.contains('TTL output 1').should('be.visible');

      cy.get('[data-cy=palettebutton]').click('left');
      cy.get('[data-cy=childpanel]').should('be.visible');
      cy
        .get('[data-cy=childpanel]')
        .parent()
        .scrollTo('bottom');

      // simulate dropping a chip on to the layout
      cy.get('#LayoutDiv').trigger('drop', {
        dataTransfer: {
          getData: () => 'PANDA:PCOMP4',
        },
        clientX: 450,
        clientY: 180,
      });

      cy.get('[data-cy=childpanel]').should('not.be.visible');
    });
  });
});
