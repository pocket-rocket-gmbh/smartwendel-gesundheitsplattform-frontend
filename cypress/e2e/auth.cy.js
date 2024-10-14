describe("authentication", () => {
  it("should login", () => {
    cy.login();
  });

  it("should logout", () => {
    cy.login();
    cy.contains("Logout").click();
    cy.location("pathname").should("eq", "/");

    cy.window().then((win) => {
      const authToken = win.localStorage.getItem("auth._token.jwt");
      expect(authToken).not.to.exist;
    });
  });
});
