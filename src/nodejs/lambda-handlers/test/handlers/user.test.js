const user = require('../../user');
const db = require('database-util');

jest.mock('database-util', () => jest.fn());
db.user = jest.fn();
db.user.findById = jest.fn();
db.user.find = jest.fn();
db.user.findByEmail = jest.fn();
db.user.loginUser = jest.fn();
db.user.addRole = jest.fn();
db.user.removeRole = jest.fn();
db.user.addGroup = jest.fn();
db.user.removeGroup = jest.fn();
db.user.getUsers = jest.fn();

db.role = jest.fn();
db.role.findByName = jest.fn();

describe('user', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should find user by id', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['USER_READ']})}).mockImplementation((params) => {return params.id})
        
        const testEvent = {
            operation: 'find',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual('958fab13-ae06-470b-80e0-c9ba4e60f1bc');
    });
    it('should find user by name', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['USER_READ']})})
        db.user.find.mockImplementation((params) => {return params.name})
        const testEvent = {
            operation: 'find',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            name: 'test'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual('test');
        
    });
    it('should permissions error on find', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['INVALID']})})
        const testEvent = {
            operation: 'find',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            name: 'test'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual({error: 'No privilege'});
    })
    it('should add a user to the group', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['USER_ADDGROUP']})}).mockImplementation(() => {return {user_groups: [{id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'}]}})
        
        db.user.addGroup.mockImplementation((params) => {return params.group_id})
        const testEvent = {
            operation: 'add_group',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            group_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual('958fab13-ae06-470b-80e0-c9ba4e60f1bc');
    })
    it('should remove a user from the group', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['USER_REMOVEGROUP']})}).mockImplementation(() => {return {user_groups: [{id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'}]}})
        
        db.user.removeGroup.mockImplementation((params) => {return params.group_id})
        const testEvent = {
            operation: 'remove_group',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            group_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual('958fab13-ae06-470b-80e0-c9ba4e60f1bc');
    })
    it('should add a role to the user', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['USER_ADDROLE']})})
        db.role.findByName.mockImplementation(() => {return {id: '1fe623d5-c5ed-47b2-98ce-c40577cf6872'}})
        db.user.addRole.mockImplementation((params) => {return params.role_id})
        const testEvent = {
            operation: 'add_role',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            role_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual('958fab13-ae06-470b-80e0-c9ba4e60f1bc');
    })
    it('should remove a role from the user', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['USER_REMOVEROLE']})})
        db.user.removeRole.mockImplementation((params) => {return params.role_id})
        const testEvent = {
            operation: 'remove_role',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            role_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual('958fab13-ae06-470b-80e0-c9ba4e60f1bc');
    })
    it('should get user names bassed on a list of ids', async () => {
        db.user.getUsers.mockImplementation((params) => {return params.ids})
        const testEvent = {
            operation: 'get_users',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            ids: ['958fab13-ae06-470b-80e0-c9ba4e60f1bc']
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual(['958fab13-ae06-470b-80e0-c9ba4e60f1bc']);
    })
    it('should permissions error on add group', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['INVALID']})})
        const testEvent = {
            operation: 'add_group',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            group_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual({error: 'No privilege'});
    })
    it('should permissions error on remove group', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['INVALID']})})
        const testEvent = {
            operation: 'remove_group',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            group_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual({error: 'No privilege'});
    })
    it('should permissions error on add role', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['INVALID']})})
        const testEvent = {
            operation: 'add_role',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            role_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual({error: 'No privilege'});
    })
    it('should permissions error on remove role', async () => {
        db.user.findById.mockImplementationOnce(
            () => {return ({user_privileges: ['INVALID']})})
        const testEvent = {
            operation: 'remove_role',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            role_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'
        }
        const response = await user.handler(testEvent);
        expect(response).toEqual({error: 'No privilege'});
    })
    it('should create a user', async () => {
        const payload = {
            operation: 'create',
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            email: 'test@test.test',
            role_ids: ['958fab13-ae06-470b-80e0-c9ba4e60f1bc'],
            group_ids: ['958fab13-ae06-470b-80e0-c9ba4e60f1bc'],
            username: 'test',
            name: 'test',
        }
        const mockCreateCognitoUser = jest.fn();
        mockCreateCognitoUser.mockReturnValue({msg: "a new user has been created in cognito"})
        db.user.findById.mockReturnValueOnce({user_privileges: ['USER_CREATE']})
        db.user.findById.mockReturnValueOnce({user_privileges: ['ADMIN']})
        db.user.findById.mockReturnValueOnce({user_privileges: ['NO_PRIVILEGES']})
        db.user.loginUser.mockReturnValue({msg: "a new user has been created"})
        db.user.findByEmail.mockReturnValueOnce({email:''});
        db.user.findByEmail.mockReturnValueOnce({email:'test@test.test'});
        expect(await user.handler(payload)).toEqual({msg: "a new user has been created"})
        expect(await user.handler(payload)).toEqual({error: "Duplicate email"})
        expect(await user.handler(payload)).toEqual({error: "No privilege"})
    });
});