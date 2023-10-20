describe('e2e', () => {
  // very basic e2e test to make sure the app loads, one can search and view a business
  it('happy path', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy="search-input"] input').type('Ca{enter}')
    cy.get('[data-cy="business-card"]').first().click()
    cy.get('[data-cy="business-card-title"]').should('contain', 'Casa Ferlin')
    cy.reload()
    cy.get('[data-cy="business-card-title"]').should('contain', 'Casa Ferlin')
  })
})
