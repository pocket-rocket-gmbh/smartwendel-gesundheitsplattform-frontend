const dotenv = require("dotenv");
const { defineConfig } = require("cypress");

// Load environment variables from .env.test file
dotenv.config({ path: "./.env.test" });

console.log(process.env.CYPRESS_USER);

module.exports = defineConfig({
  env: process.env,
  e2e: {
    baseUrl: "http://localhost:8084",
    setupNodeEvents(on, config) {},
  },
});
