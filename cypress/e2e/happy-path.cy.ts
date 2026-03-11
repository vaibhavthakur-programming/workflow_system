describe('Workflow dashboard happy path', () => {
  it('logs in and views workflows dashboard', () => {
    cy.visit('/');

    cy.get('input#email').type('admin@test.com');
    cy.get('input#password').type('password');
    cy.get('button.btn-login').click();

    cy.contains('Dashboard').should('be.visible');
    cy.contains('Total Workflows').should('be.visible');

    cy.contains('Workflows').click();
    cy.contains('Create Workflow').should('be.visible');
    cy.get('table.workflow-table').should('exist');
  });
});

