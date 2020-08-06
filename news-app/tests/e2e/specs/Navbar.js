describe('Navbar', () => {
  it('is mounted on page load', () => {
    cy.fixture('news').as('newsData');

    cy.visit('/', {
      onBeforeLoad(window) {
        cy.stub(window, 'fetch')
          .resolves({
            status: 200,
            json: () => this.newsData,
          });
      }
    });

    cy.wait(200);

    cy.get('[data-testid=\'news-api-navlink\']')
      .contains('News Api')
      .should('have.class', 'active');

    cy.get('[data-testid=\'about-navlink\']')
      .contains('About')
      .should('not.have.class', 'active');
  });

  it('news api link button directs to the home page', () => {
    cy.get('[data-testid=\'news-api-navlink\']')
      .click();

    cy.url()
      .should('include', '/');
  });

  it('about link button directs to the about page', () => {
    cy.get('[data-testid=\'about-navlink\']')
      .click();

    cy.url()
      .should('include', '/about');
  });
});
