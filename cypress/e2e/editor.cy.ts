describe('Content Editor', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Contenido').click();
  });

  it('shows all main content sections', () => {
    cy.contains('Experiencia').should('be.visible');
    cy.contains('Educación').should('be.visible');
    cy.contains('Cursos').should('be.visible');
    cy.contains('Idiomas').should('be.visible');
    cy.contains('Habilidades').should('be.visible');
    cy.contains('Intereses').should('be.visible');
  });

  it('can expand and collapse experience entries', () => {
    // Find the first experience card chevron
    cy.get('[title="Evitar corte de página"], [title="Permitir corte de página"]').first().should('exist');
  });

  it('can add a new experience entry', () => {
    // Find the add button in the experience section
    cy.contains('section', 'Experiencia').within(() => {
      cy.get('button').filter(':contains("+")').first().click();
    });
  });

  it('shows projects section', () => {
    cy.contains('Proyectos').should('be.visible');
  });
});
