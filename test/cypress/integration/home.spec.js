describe('Home Page', () => {
  it('should display Home Page', () => {
    cy.visit(`${Cypress.config('baseUrl')}#/home`);

    cy.get('h1').should(($h1) => {
      expect($h1, 'text content').to.have.text('Aurelia-Slickgrid');
    });

    cy.get('h3')
      .contains('Introduction');

    cy.get('h3')
      .contains('Wiki / Documentation');
  });
});
