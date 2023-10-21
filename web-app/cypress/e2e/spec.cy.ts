describe('e2e', () => {
  // basic e2e test to make sure the app loads, one can search and view a business
  it('happy path', () => {
    // load app
    cy.visit('http://localhost:3000/')
    // search for a business
    cy.get('[data-cy="search-input"] input').type('{enter}')
    cy.get('[data-cy="business-card"]').should('have.length', 2)
    cy.get('[data-cy="search-input"] input').type('Ca{enter}')
    cy.get('[data-cy="business-card"]').should('have.length', 2)
    cy.get('[data-cy="search-input"] input').type('s{enter}')
    cy.get('[data-cy="business-card"]').should('have.length', 1)
    cy.get('[data-cy="search-input"] input').type('s{enter}')
    cy.get('[data-cy="search-no-results"]').should('exist')
    // select a business
    cy.get('[data-cy="search-input"] input').clear().type('Ca{enter}')
    cy.get('[data-cy="business-card"]').first().click()
    // check that the business details are displayed
    cy.get('[data-cy="business-card-title"]').should('contain', 'Casa Ferlin')
    // reload and check if the business details are still displayed
    cy.reload()
    cy.get('[data-cy="business-card-title"]').should('contain', 'Casa Ferlin')
    // go back to the search results
    cy.get('[data-cy="detail-back-button"]').click()
    cy.get('[data-cy="search-input"]').should('exist')
  })
})
