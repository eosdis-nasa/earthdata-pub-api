const Driver = require('../src/index.js').DynamodbDriver;
const Stub = require('./dynamo-client-stub.js');
const ErrorResponse = require('../src/error-response.js');
const Db = require('./db_sample.json');

// Suppress console output for running tests
console = {log: () => {},info: () => {},warn: () => {},error: () => {}}

describe('Dynamodb Driver', () => {
  describe('getItems() function', () => {

    it("should return a single item for id query", async () => {
      let client = Stub.client();
      let driver = new Driver(client);
      let getItemsByIdSpy = spyOn(driver, 'getItemById');
      let table = "form";
      let id = "f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11";
      let uniqueName;
      let version;
      let response = await driver.getItems(table, id, uniqueName, version);
      expect(getItemsByIdSpy).toBeCalled();
      expect(Array.isArray(response.data)).toBeFalsy();
    });

    it("should return a single item for unique_name and version query", async () => {
      let client = Stub.client();
      let driver = new Driver(client);
      let getItemByNameAndVersionSpy = spyOn(driver, 'getItemByNameAndVersion');
      let table = "form";
      let id;
      let uniqueName = "VALID_FORM";
      let version = 1;
      let response = await driver.getItems(table, id, uniqueName, version);
      expect(getItemByNameAndVersionSpy).toBeCalled();
      expect(Array.isArray(response.data)).toBeFalsy();
    });

    it("should return an array for unique_name query", async () => {
      let client = Stub.client();
      let driver = new Driver(client);
      let getItemsByNameSpy = spyOn(driver, 'getItemsByName');
      let table = "question";
      let id;
      let uniqueName = "poc_info";
      let version;
      let response = await driver.getItems(table, id, uniqueName, version);
      expect(getItemsByNameSpy).toBeCalled();
      expect(Array.isArray(response.data)).toBeFalsy();
    });

    it("should expand foreign key references on single item queries", async () => {
      let client = Stub.client();
      let driver = new Driver(client);
      let table = "form";
      let id = "f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff11";
      let uniqueName;
      let version;
      let expected = Db.form.expanded;
      let response = await driver.getItems(table, id, uniqueName, version);
      expect(response.data).toEqual(expected);
    });

    it("should return error for invalid f_ref", async () => {
      let client = Stub.client();
      let driver = new Driver(client);
      let table = "form";
      let id = "f1f11ff1-f1f1-41ff-bfff-1ff1f1f1ff12";
      let uniqueName;
      let version;
      let expected = ErrorResponse.invalidReference;
      let response = await driver.getItems(table, id, uniqueName, version);
      expect(response).toEqual(expected);
    });

    it("should return error for no change", async () => {
      let client = Stub.client();
      let driver = new Driver(client);
      let table = "question";
      let id = "b1b11bb1-b1b1-41bb-bbbb-1bb1b1b1bb11";
      let item = {};
      Object.assign(item, Db.question[id]);
      let expected = ErrorResponse.noChange;
      let response = await driver.putItem(table, item);
      expect(response).toEqual(expected);
    });
  });
});
