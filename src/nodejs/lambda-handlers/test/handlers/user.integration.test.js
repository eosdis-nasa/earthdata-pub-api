const db = require('database-util');
const user = require('../../user');

describe('user integration', () => {
  afterAll(async () => {
    await db.pool.end();
  });
  describe('should return detailed user information for requestors with USER_READ privilege', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'getDetailedUsers',
        context: { user_id: requestorId },
        params: { }
      };
      const response = await user.handler(testEvent);
      expect(response.length).toEqual(12);
    });
  });
  describe('should give privilege error for users without USER_READ privilege', () => {
    const testCases = [
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'getDetailedUsers',
        context: { user_id: requestorId }
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });
  it('should return detailed user information filtered by role for requestors with USER_READ privilege', async () => {
    const testEvent = {
      operation: 'getDetailedUsers',
      context: { user_id: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      params: {
        role_id: '19ac227b-e96c-46fa-a378-cf82c461b669'
      }
    };
    const response = await user.handler(testEvent);
    expect(response.length).toEqual(1);
  });
  it('should return detailed user information filtered by group for requestors with USER_READ privilege', async () => {
    const testEvent = {
      operation: 'getDetailedUsers',
      context: { user_id: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      params: {
        group_id: '4daa6b22-f015-4ce2-8dac-8b3510004fca'
      }
    };
    const response = await user.handler(testEvent);
    expect(response.length).toEqual(2);
  });
  it('should return detailed user information filtered by role and group for requestors with USER_READ privilege', async () => {
    const testEvent = {
      operation: 'getDetailedUsers',
      context: { user_id: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      params: {
        role_id: '4be6ca4d-6362-478b-8478-487a668314b1',
        group_id: '4daa6b22-f015-4ce2-8dac-8b3510004fca'
      }
    };
    const response = await user.handler(testEvent);
    expect(response.length).toEqual(1);
  });
  describe('should find all users for requestors with USER_READ privilege ', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'find',
        context: { user_id: requestorId }
      };
      const response = await user.handler(testEvent);
      expect(response.length).toEqual(12);
    });
  });
  describe('should not find any users for requestors with out USER_READ privilege', () => {
    const testCases = [
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'find',
        context: { user_id: requestorId }
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });
  describe('should find users with a specific id for requestors with USER_READ privilege', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17', expected: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1', expected: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', expected: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f', expected: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f', expected: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, expected }) => {
      const testEvent = {
        operation: 'find',
        context: { user_id: requestorId },
        id: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1'
      };
      const response = await user.handler(testEvent);
      expect(response.id).toEqual(expected);
    });
  });
  describe('should not find users with specific id for requestors with out USER_READ privilege', () => {
    const testCases = [
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'find',
        context: { user_id: requestorId },
        id: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1'
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });
  it('should find users by name for requestors with USER_READ privilege', async () => {
    // Testing with ADMIN access. Other roles are covered in previous tests
    const testEvent = {
      operation: 'find',
      context: { user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      name: 'NO_DAAC_DP'
    };
    const response = await user.handler(testEvent);
    expect(response.length).toEqual(1);
    expect(response[0].name).toEqual('NO_DAAC_DP');
  });
  describe('create a user for requestors with ADMIN privileges ', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'create',
        context: { user_id: requestorId },
        email: 'testing@test.test',
        role_ids: ['804b335c-f191-4d26-9b98-1ec1cb62b97d'],
        group_ids: ['5be24b44-d66b-4396-9266-a9d066000d9e'],
        username: 'test',
        name: 'test'
      };
      const response = await user.handler(testEvent);
      expect(response.email).toEqual('testing@test.test');
    });
  });
  describe('should give privilege error for users without ADMIN privileges', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'create',
        context: { user_id: requestorId },
        email: 'test@test.test',
        role_ids: ['804b335c-f191-4d26-9b98-1ec1cb62b97d'],
        group_ids: ['5be24b44-d66b-4396-9266-a9d066000d9e'],
        username: 'test',
        name: 'test'
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });
  it('should update the user name for an id', async () => {
    const testEvent = {
      operation: 'update_username',
      context: { user_id: '12afacf8-fae8-4b13-83c3-7d332732a291' },
      id: '5e711da9-913f-4752-a4de-98d53c206b70',
      name: 'DP_Test_User_Update'
    };
    const response = await user.handler(testEvent);
    expect(response.name).toEqual('DP_Test_User_Update');
  });
  it('should find users by email for requestors with USER_READ privilege', async () => {
    // Testing with ADMIN access. Other roles are covered in previous tests
    const testEvent = {
      operation: 'find',
      context: { user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      email: 'dp@gmail.com'
    };
    const response = await user.handler(testEvent);
    expect(response.length).toEqual(1);
    expect(response[0].email).toEqual('dp@gmail.com');
  });
  describe('should find users by id for requestors with USER_READ privilege or self search', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'findById',
        context: { user_id: requestorId },
        params: { id: '12afacf8-fae8-4b13-83c3-7d332732a291' }
      };
      const response = await user.handler(testEvent);
      expect(response.id).toEqual('12afacf8-fae8-4b13-83c3-7d332732a291');
    });
  });
  describe('should not find users by id for requestors with out USER_READ privilege or self search', () => {
    const testCases = [
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'findById',
        context: { user_id: requestorId },
        params: { id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });
  describe('should add a user to the group for requestors with USER_ADDGROUP privilege', () => {
    const testCases = [
      {
        descriptor: 'ADMIN',
        requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b65',
        groupId: 'bf07c445-8217-4f97-827a-82838cce36fb'
      },
      {
        descriptor: 'DM',
        requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b67',
        groupId: '89816689-5375-4c81-a30c-bf6ed12d30fb'
      }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser, groupId }) => {
      const testEvent = {
        operation: 'add_group',
        context: { user_id: requestorId },
        id: testUser,
        group_id: groupId
      };
      const response = await user.handler(testEvent);
      expect(response.edpgroup_id).toEqual(groupId);
    });
  });
  describe('should give privilege error for users without USER_ADDGROUP privilege or non-matching group', () => {
    const testCases = [
      {
        descriptor: 'DS',
        requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b66',
        groupId: '89816689-5375-4c81-a30c-bf6ed12d30fb'
      },
      {
        descriptor: 'DM',
        requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b67',
        groupId: 'bf07c445-8217-4f97-827a-82838cce36fb'
      }, // wrong daac
      {
        descriptor: 'Observer',
        requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b68',
        groupId: '4daa6b22-f015-4ce2-8dac-8b3510004fca'
      },
      {
        descriptor: 'UWG',
        requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b69',
        groupId: '2385734f-f834-41dc-946c-11e23af6f3d6'
      },
      {
        descriptor: 'DP',
        requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b70',
        groupId: '89816689-5375-4c81-a30c-bf6ed12d30fb'
      }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser, groupId }) => {
      const testEvent = {
        operation: 'add_group',
        context: { user_id: requestorId },
        id: testUser,
        group_id: groupId
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });

  describe('should remove a user from the group for requestors with USER_REMOVEGROUP privilege', () => {
    const testCases = [
      {
        descriptor: 'ADMIN',
        requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b65',
        groupId: 'bf07c445-8217-4f97-827a-82838cce36fb'
      },
      {
        descriptor: 'DM',
        requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b67',
        groupId: '89816689-5375-4c81-a30c-bf6ed12d30fb'
      }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser, groupId }) => {
      const testEvent = {
        operation: 'remove_group',
        context: { user_id: requestorId },
        id: testUser,
        group_id: groupId
      };
      const response = await user.handler(testEvent);
      expect(response.edpgroup_id).toEqual(groupId);
    });
  });
  describe('should give privilege error for users without USER_REMOVEGROUP privilege or non-matching group', () => {
    const testCases = [
      {
        descriptor: 'DS',
        requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b66',
        groupId: '89816689-5375-4c81-a30c-bf6ed12d30fb'
      },
      {
        descriptor: 'DM',
        requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b67',
        groupId: 'bf07c445-8217-4f97-827a-82838cce36fb'
      }, // wrong daac
      {
        descriptor: 'Observer',
        requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b68',
        groupId: '4daa6b22-f015-4ce2-8dac-8b3510004fca'
      },
      {
        descriptor: 'UWG',
        requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b69',
        groupId: '2385734f-f834-41dc-946c-11e23af6f3d6'
      },
      {
        descriptor: 'DP',
        requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291',
        testUser: '5e711da9-913f-4752-a4de-98d53c206b70',
        groupId: '89816689-5375-4c81-a30c-bf6ed12d30fb'
      }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser, groupId }) => {
      const testEvent = {
        operation: 'remove_group',
        context: { user_id: requestorId },
        id: testUser,
        group_id: groupId
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });

  describe('should add a role for a user when the requestor has the USER_ADDROLE privilege', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17', testUser: '5e711da9-913f-4752-a4de-98d53c206b65' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', testUser: '5e711da9-913f-4752-a4de-98d53c206b67' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser }) => {
      const testEvent = {
        operation: 'add_role',
        context: { user_id: requestorId },
        id: testUser,
        role_id: '804b335c-f191-4d26-9b98-1ec1cb62b97d'
      };
      const response = await user.handler(testEvent);
      expect(response.edprole_id).toEqual('804b335c-f191-4d26-9b98-1ec1cb62b97d');
    });
  });
  describe('should give privilege error for users without USER_ADDROLE privilege', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1', testUser: '5e711da9-913f-4752-a4de-98d53c206b66' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f', testUser: '5e711da9-913f-4752-a4de-98d53c206b68' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f', testUser: '5e711da9-913f-4752-a4de-98d53c206b69' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291', testUser: '5e711da9-913f-4752-a4de-98d53c206b70' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser }) => {
      const testEvent = {
        operation: 'add_role',
        context: { user_id: requestorId },
        id: testUser,
        role_id: '804b335c-f191-4d26-9b98-1ec1cb62b97d'
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });
  describe('should remove a role from a user for requestors with USER_REMOVEROLE privilege', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17', testUser: '5e711da9-913f-4752-a4de-98d53c206b65' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc', testUser: '5e711da9-913f-4752-a4de-98d53c206b67' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser }) => {
      const testEvent = {
        operation: 'remove_role',
        context: { user_id: requestorId },
        id: testUser,
        role_id: '804b335c-f191-4d26-9b98-1ec1cb62b97d'
      };
      const response = await user.handler(testEvent);
      expect(response.edprole_id).toEqual('804b335c-f191-4d26-9b98-1ec1cb62b97d');
    });
  });
  describe('should give privilege error for users without USER_REMOVEROLE privilege', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1', testUser: '5e711da9-913f-4752-a4de-98d53c206b66' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f', testUser: '5e711da9-913f-4752-a4de-98d53c206b68' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f', testUser: '5e711da9-913f-4752-a4de-98d53c206b69' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291', testUser: '5e711da9-913f-4752-a4de-98d53c206b70' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId, testUser }) => {
      const testEvent = {
        operation: 'remove_role',
        context: { user_id: requestorId },
        id: testUser,
        role_id: '804b335c-f191-4d26-9b98-1ec1cb62b97d'
      };
      const response = await user.handler(testEvent);
      expect(response.error).toEqual('No privilege');
    });
  });
  it('should get users based on a list of ids', async () => {
    const testEvent = {
      operation: 'get_users',
      context: { user_id: '12afacf8-fae8-4b13-83c3-7d332732a291' },
      ids: ['5e711da9-913f-4752-a4de-98d53c206b65', '5e711da9-913f-4752-a4de-98d53c206b66', '5e711da9-913f-4752-a4de-98d53c206b67']
    };
    const response = await user.handler(testEvent);
    expect(response.length).toEqual(3);
  });
});
