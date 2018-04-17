describe('MalcolmJS', function () {
  it('.should() - load correctly', function () {
    cy.visit('/')
    cy.title().should('equal', 'MalcolmJS')
  })
});
