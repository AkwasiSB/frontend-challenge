describe('About', () => {
  it('route loads the correct view', () => {
    cy.visit('/about');

    cy.get('[data-testid=\'about-title\']')
      .should('have.length', 1);

    cy.get('[data-testid=\'about-button\']')
      .should('have.length', 1);
  });
});
