describe('User Authentication Tests', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    if (
      error.message.includes("Cannot read properties of null (reading 'hide')")
    ) {
      return false; // Ignore this error specifically
    }
    return true; // Fail the test for other exceptions
  });

  beforeEach(() => {
    // Navigate home page app
    cy.visit('index.html');

    // Clean up any modals and backdrops before each test
    cy.document().then((document) => {
      const registerModal = document.querySelector('#registerModal');
      const modalBackdrop = document.querySelector('.modal-backdrop');

      if (registerModal) registerModal.remove(); // Remove the registration modal
      if (modalBackdrop) modalBackdrop.remove(); // Remove the modal backdrop
    });

    // Introduce a slight wait for UI stability
    cy.wait(500);

    // Click the login button
    cy.contains('button', 'Login').click({ force: true });

    // Ensure the login modal is visible
    cy.get('#loginModal').should('be.visible');
  });

  it('should successfully log in user with valid credentials', () => {
    // Input valid email and password
    cy.get('#loginEmail')
      .clear()
      .type('validuser@noroff.no', { delay: 100 }) // Type email with delay
      .should('have.value', 'validuser@noroff.no'); // Verify email input

    cy.get('#loginPassword').type('validpassword123', { delay: 100 }); // Type password

    // Submit the login form
    cy.get('#loginForm button[type="submit"]').click();

    // Verify that the logout button appears after logging in
    cy.get('button[data-auth="logout"]', { timeout: 10000 }).should(
      'be.visible'
    );
  });

  it('should display an error for invalid login attempts', () => {
    // Enter invalid email and password
    cy.get('#loginEmail')
      .clear()
      .type('invaliduser@noroff.no', { delay: 100 }) // Input invalid email
      .should('have.value', 'invaliduser@noroff.no');

    cy.get('#loginPassword').type('wrongpassword', { delay: 100 }); // Input wrong password

    // Intercept the login request to check the response
    cy.intercept('POST', '**/auth/login').as('loginRequest');

    // Click the submit button
    cy.get('#loginForm button[type="submit"]').click();

    // Wait for the login request and assert the response status
    cy.wait('@loginRequest').then((response) => {
      expect(response.response.statusCode).to.eq(401); // Expect a 401 Unauthorized response
    });

    // Handle the alert message for incorrect login
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contains(
        'Either your username was not found or your password is incorrect'
      );
    });
  });

  it('should allow users to log out successfully', () => {
    // Log in first with valid credentials
    cy.get('#loginEmail').clear().type('validuser@noroff.no', { delay: 100 });

    cy.get('#loginPassword').type('validpassword123', { delay: 100 });
    cy.get('#loginForm button[type="submit"]').click();

    // Wait for the logout button to be visible
    cy.get('button[data-auth="logout"]', { timeout: 10000 }).should(
      'be.visible'
    );

    // Wait briefly to ensure all transitions are complete
    cy.wait(2000);

    // Click the logout button
    cy.get('button[data-auth="logout"]').click();

    // Confirm that the login button is visible again after logging out
    cy.contains('button', 'Login', { timeout: 10000 }).should('be.visible');
  });
});
