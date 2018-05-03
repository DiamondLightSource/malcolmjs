describe('MalcolmJS', () => {
  it('.should() - load correctly', () => {
    cy.visit('/gui/?block=PANDA:TTLIN1');
    cy.title().should('equal', 'MalcolmJS');
  });
});
