describe('Home', () => {
  it('route loads the correct view', () => {
    cy.fixture('news').as('newsData');

    cy.server();

    cy.route({
      url: '*/articles?type=headlines',
      status: 200,
      delay: 0,
      response: '@newsData',
      method: 'POST'
    }).as('getArticles');

    cy.visit('/');

    cy.get('[data-testid=\'search-title\']')
      .should('have.length', 1);

    cy.get('[data-testid=\'search-input\']')
      .should('have.length', 1);

    cy.wait('@getArticles')
      .its('request.body')
      .should('deep.equal', {
        country: 'gb'
      });
    
    cy.get('[data-testid=\'article-list\']')
      .children()
      .should('to.be.length.gt', 0);
  });

  it('return filtered results when BBC News filter is clicked', () => {
    cy.fixture('bbc-news').as('newsData');

    cy.server();

    cy.route({
      url: '*/articles?type=headlines',
      status: 200,
      delay: 0,
      response: '@newsData',
      method: 'POST'
    }).as('getArticles');

    cy.get('[data-testid=\'filterby-bbc-news\']')
      .click();

    cy.wait('@getArticles')
      .its('request.body')
      .should('deep.equal', {
        sources: 'bbc-news'
      });

    cy.get('[data-testid=\'article-item\']')
      .first()
      .find('[data-testid=\'article-item-info\']')
      .contains('BBC News');
  });

  it('return search results and changed search title based on input text', () => {
    const input = 'TikTok';

    cy.fixture('tiktok-news').as('newsData');

    cy.server();

    cy.route({
      url: '*/articles?type=search',
      status: 200,
      delay: 0,
      response: '@newsData',
      method: 'POST'
    }).as('getArticles');

    cy.get('[data-testid=\'search-input\']')
      .type(input)
      .should('have.value', input);

    cy.wait('@getArticles')
      .its('request.body')
      .should('deep.equal', {
        q: input
      });

    cy.get('[data-testid=\'search-title\']')
      .should('have.contain', input);

    cy.get('[data-testid=\'article-item\']')
      .first()
      .find('[data-testid=\'article-item-title\']')
      .contains(input);
  });
});
