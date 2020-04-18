const Schema = require('../src/schema.js');
const Db = require('./db_sample.json');

// Suppress console output for running tests
/* eslint-disable no-global-assign */
console = {
  log: () => {}, info: () => {}, warn: () => {}, error: () => {}
};

describe('Schema Validator', () => {
  describe('isTable() function', () => {
    it('should return true for a valid tableName', async () => {
      const isTable = Schema.isTable('form');
      expect(isTable).toBeTruthy();
    });

    it('should return false for an invalid tableName', async () => {
      const isTable = Schema.isTable('cheese');
      expect(isTable).toBeFalsy();
    });
  });

  describe('validate() function', () => {
    it('should validate form', async () => {
      const table = 'form';
      const id = 'f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11';
      const isValid = Schema.validate(table, Db[table][id]);
      expect(isValid).toBeTruthy();
    });
  });

  describe('hasForeignReferences() function', () => {
    it('should return true for tables with foreign references', async () => {
      const table = 'form';
      const hasReferences = Schema.hasForeignReferences(table);
      expect(hasReferences).toBeTruthy();
    });

    it('should return false for tables without foreign references', async () => {
      const table = 'question';
      const hasReferences = Schema.hasForeignReferences(table);
      expect(hasReferences).toBeFalsy();
    });
  });

  describe('getForeignKeys() function', () => {
    it('should return list of enumerated paths', async () => {
      const table = 'form';
      const id = 'foreign_paths';
      const item = Db[table][id];
      const expected = {
        question: [
          {
            path: ['sections', 0, 'questions', 0],
            lastIndex: 0,
            value: item.sections[0].questions
          },
          {
            path: ['sections', 0, 'questions', 1],
            lastIndex: 1,
            value: item.sections[0].questions
          },
          {
            path: ['sections', 1, 'questions', 0],
            lastIndex: 0,
            value: item.sections[1].questions
          },
          {
            path: ['sections', 1, 'questions', 1],
            lastIndex: 1,
            value: item.sections[1].questions
          }
        ]
      };
      const references = Schema.getForeignKeys(table, Db[table][id]);
      expect(references).toEqual(expected);
    });
  });

  describe('toFlat() function', () => {
    it('should return a flattened object', async () => {
      const nested = { a: { b: [{ c: 1 }, { c: 2 }], d: 1 } };
      const expected = { 'a#b#0#c': 1, 'a#b#1#c': 2, 'a#d': 1 };
      const flat = Schema.toFlat(nested);
      expect(flat).toEqual(expected);
    });
  });

  describe('fromFlat() function', () => {
    it('should return a flattened object', async () => {
      const flat = { 'a#b#0#c': 1, 'a#b#1#c': 2, 'a#d': 1 };
      const expected = { a: { b: [{ c: 1 }, { c: 2 }], d: 1 } };
      const nested = Schema.fromFlat(flat);
      expect(nested).toEqual(expected);
    });
  });
});
