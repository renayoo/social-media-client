Cypress.Commands.add('login', (email, password) => {
  cy.get('#loginEmail').type(email);
  cy.get('#loginPassword').type(password);
  cy.get('#loginForm button[type="submit"]').click();
});
