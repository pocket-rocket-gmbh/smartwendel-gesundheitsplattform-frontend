describe("public pages", () => {
  it("shows the home page", () => {
    cy.visit("/");
  });

  it("shows the event page", () => {
    cy.visit("/public/search/events");
  });

  it("shows the coures page", () => {
    cy.visit("/public/search/courses");
  });

  it("shows the facilities page", () => {
    cy.visit("/public/search/facilities");
  });

  it("shows a public category page", () => {
    const categoryId = "1a347b2a-a7b8-4dfb-82b3-ab7cd57f44fe";
    cy.visit(`/public/categories/${categoryId}`);
  });

  it("shows another public category page", () => {
    const categoryId = "d586e289-be57-4654-ac1f-3d64bf50c508";
    cy.visit(`/public/categories/${categoryId}`);
  });

  it("shows the rules of conduct page", () => {
    cy.visit("/rules_of_conduct");
  });

  it("shows the privacy policy page", () => {
    cy.visit("/privacy_policy");
  });

  it("shows the imprint page", () => {
    cy.visit("/imprint");
  });
});
