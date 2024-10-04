// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//
Cypress.Commands.add("login", () => {
  const userName = Cypress.env("CYPRESS_USER");
  const password = Cypress.env("CYPRESS_PASSWORD");

  cy.visit("/login");
  cy.get('[data-test-id="login-email"]').type(userName);
  cy.get('[data-test-id="login-password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.location("pathname").should("contain", "/admin");

  cy.window().then((win) => {
    const authToken = win.localStorage.getItem("auth._token.jwt");
    expect(authToken).to.exist;
  });
});
