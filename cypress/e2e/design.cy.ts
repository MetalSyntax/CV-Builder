describe('Design Tab', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Diseño').click();
  });

  it('shows template selector', () => {
    cy.contains('Plantilla y Página').should('be.visible');
    cy.contains('Plantilla').should('be.visible');
  });

  it('shows page format selector', () => {
    cy.contains('Formato').should('be.visible');
  });

  it('shows margin selector', () => {
    cy.contains('Márgenes').should('be.visible');
  });

  it('shows CV Score', () => {
    cy.contains('CV Score').should('be.visible');
  });

  it('can expand CV Score tips', () => {
    cy.contains('CV Score').closest('button').click();
    cy.contains('Email de contacto').should('be.visible');
  });

  it('shows color configuration', () => {
    cy.contains('Configuración Visual').should('be.visible');
    cy.contains('Encabezado').should('be.visible');
  });

  it('shows theme presets', () => {
    cy.contains('Temas Master').should('be.visible');
    cy.contains('Classic Burgundy').should('be.visible');
  });

  it('shows column manager', () => {
    cy.contains('Gestor de Columnas').should('be.visible');
    cy.contains('Columna Izquierda').should('be.visible');
    cy.contains('Columna Derecha').should('be.visible');
  });
});
