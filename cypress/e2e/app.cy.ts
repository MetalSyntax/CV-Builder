describe('CV Builder App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the app successfully', () => {
    cy.contains('CV BUILDER').should('be.visible');
  });

  it('shows the resume preview', () => {
    cy.get('.resume-page-frame').should('be.visible');
  });

  it('shows the sidebar with tabs', () => {
    cy.contains('button', 'Diseño').should('be.visible');
    cy.contains('button', 'Contenido').should('be.visible');
    cy.contains('button', 'Usuario').should('be.visible');
  });

  it('switches between tabs', () => {
    cy.contains('button', 'Contenido').click();
    cy.contains('Experiencia').should('be.visible');

    cy.contains('button', 'Usuario').click();
    cy.contains('Mis Currículums').should('be.visible');

    cy.contains('button', 'Diseño').click();
    cy.contains('Plantilla y Página').should('be.visible');
  });

  it('shows the print/PDF buttons', () => {
    cy.contains('Guardar PDF').should('be.visible');
    cy.contains('Descargar PDF Directo').should('be.visible');
  });

  it('shows the undo and redo buttons', () => {
    cy.get('button[title="Deshacer"]').should('be.visible');
    cy.get('button[title="Rehacer"]').should('be.visible');
  });

  it('toggles dark mode', () => {
    cy.get('button[title="Modo Oscuro"], button[title="Modo Claro"]').click();
    cy.get('html').should('have.class', 'dark');
    cy.get('button[title="Modo Oscuro"], button[title="Modo Claro"]').click();
    cy.get('html').should('not.have.class', 'dark');
  });
});
