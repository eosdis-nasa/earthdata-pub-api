const Schema = require("../src/schema.js");
const Db = require("./db_sample.json");

// Suppress console output for running tests
//console = {log: () => {},info: () => {},warn: () => {},error: () => {}}

describe("Schema Validator", () => {


  describe("isTable() function", () => {
    it("should return true for a valid tableName", async () => {
      let isTable = Schema.isTable("form");
      expect(isTable).toBeTruthy();
    });

    it("should return false for an invalid tableName", async () => {
      let isTable = Schema.isTable("cheese");
      expect(isTable).toBeFalsy();
    });
  });

  describe("validate() function", () => {
    it("should validate form", async () => {
      let table = "form";
      let id = "f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11";
      let isValid = Schema.validate(table, Db[table][id]);
      expect(isValid).toBeTruthy();
    });
  });

  describe("hasForeignReferences() function", () => {
    it("should return true for tables with foreign references", async () => {
      let table = "form";
      let hasReferences = Schema.hasForeignReferences(table);
      expect(hasReferences).toBeTruthy();
    });

    it("should return false for tables without foreign references", async () => {
      let table = "question";
      let hasReferences = Schema.hasForeignReferences(table);
      expect(hasReferences).toBeFalsy();
    });
  });

  describe("getForeignKeys() function", () => {
    it("should return list of enumerated paths", async () => {
      let table = "form";
      let id = "foreign_paths";
      let item = Db[table][id];
      let expected = {
          question: [
          {
            path: ["sections", 0, "questions", 0],
            lastIndex: 0,
            value: item["sections"][0]["questions"]
          },
          {
            path: ["sections", 0, "questions", 1],
            lastIndex: 1,
            value: item["sections"][0]["questions"]
          },
          {
            path: ["sections", 1, "questions", 0],
            lastIndex: 0,
            value: item["sections"][1]["questions"]
          },
          {
            path: ["sections", 1, "questions", 1],
            lastIndex: 1,
            value: item["sections"][1]["questions"]
          },
        ]
      };
      let references = Schema.getForeignKeys(table, Db[table][id]);
      expect(references).toEqual(expected);
    });
  });

  describe("toFlat() function", () => {
    it("should return a flattened object", async () => {
      let nested = {"a": {"b": [{"c": 1},{"c": 2}], "d": 1}}
      let expected = {"a#b#0#c": 1, "a#b#1#c": 2, "a#d": 1}
      let flat = Schema.toFlat(nested);
      expect(flat).toEqual(expected);
    });
  });

  describe("fromFlat() function", () => {
    it("should return a flattened object", async () => {
      let flat = {"a#b#0#c": 1, "a#b#1#c": 2, "a#d": 1}
      let expected = {"a": {"b": [{"c": 1},{"c": 2}], "d": 1}}
      let nested = Schema.fromFlat(flat);
      expect(nested).toEqual(expected);
    });
  });
});
