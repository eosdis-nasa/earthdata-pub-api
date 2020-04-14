const Validator = require("../src/schema.js");
const Db = require("./db_sample.json");

describe("Schema Validator", () => {

  describe("isTable() function", () => {
    it("should return true for a valid tableName", async () => {
      let isTable = Validator.isTable("form");
      expect(isTable).toBeTruthy();
    });
    it("should return false for an invalid tableName", async () => {
      let isTable = Validator.isTable("cheese");
      expect(isTable).toBeFalsy();
    })
  });

  describe("validate() function", () => {
    it("should validate form", async () => {
      let table = "form";
      let id = "f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11";
      let isValid = Validator.validate(table, Db[table][id]);
      expect(isValid).toBeTruthy();
    });
  });

});
