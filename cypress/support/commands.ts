// Custom Cypress commands
Cypress.Commands.add('openDesignTab', () => {
  cy.contains('button', 'Diseño').click();
});

Cypress.Commands.add('openContentTab', () => {
  cy.contains('button', 'Contenido').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      openDesignTab(): Chainable<void>;
      openContentTab(): Chainable<void>;
    }
  }
}
