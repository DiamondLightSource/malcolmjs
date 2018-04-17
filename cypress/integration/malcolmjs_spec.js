describe('MalcolmJS', function () {
  it('.should() - load correctly', function () {
    cy.visit('http://localhost:3000')
    cy.title().should('equal', 'MalcolmJS')
  })
});
