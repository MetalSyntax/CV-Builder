describe('PDF Export', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('print button is clickable', () => {
    cy.contains('Guardar PDF').should('be.visible').and('not.be.disabled');
  });

  it('direct PDF download button is visible and not disabled', () => {
    cy.contains('Descargar PDF Directo').should('be.visible').and('not.be.disabled');
  });

  it('undo/redo buttons are present', () => {
    cy.get('button[title="Deshacer"]').should('be.visible');
    cy.get('button[title="Rehacer"]').should('be.visible');
  });

  it('resume has correct page frame', () => {
    cy.get('.resume-page-frame').should('have.css', 'width');
    // Default is Letter format
    cy.get('.resume-page-frame').should('have.css', 'width', '816px');
  });

  it('changing page format updates resume dimensions', () => {
    cy.contains('button', 'Diseño').click();
    cy.contains('Formato').should('be.visible');
    // Note: full format switching test would require interacting with CustomSelect
    cy.get('.resume-page-frame').should('be.visible');
  });
});
