const db = require('database-util');
const questions = require('../../questions.js');

describe('questions integration', () => {
  afterAll(async () => {
    await db.pool.end();
  });

  describe('should find all questions for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'findAll',
        context: { user_id: requestorId }
      };
      const response = await questions.handler(testEvent);
      expect(response.length).toBeGreaterThan(0);
    });
  });
  describe('should not find questions for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'findAll',
        context: { user_id: requestorId }
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should find a question by name for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'findByName',
        context: { user_id: requestorId },
        params: { short_name: 'data_producer_info' }
      };
      const response = await questions.handler(testEvent);
      expect(response.short_name).toEqual('data_producer_info');
    });
  });
  describe('should not find a question by name for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'findByName',
        context: { user_id: requestorId },
        params: { short_name: 'data_producer_info' }
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should find a question by id for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'findById',
        context: { user_id: requestorId },
        params: { id: '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2' }
      };
      const response = await questions.handler(testEvent);
      expect(response.id).toEqual('80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2');
    });
  });
  describe('should not find a question by id for users without ADMIN', () => {
    const testCases = [
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
        params: { id: '80ac5f52-9ed9-4139-b5f9-7b4cebb6a8e2' }
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should update a question for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'update',
        context: { user_id: requestorId },
        params: {
          payload: {
            short_name: 'test_question_1',
            version: 1,
            long_name: 'Updated Test Question 1',
            text: 'New Question',
            help: 'New Help',
            required: true,
            created_at: '2026-03-30',
            daac_ids: ['cdccdd71-cbe2-4220-8569-a6355ea24f3f']
          }
        }
      };
      const response = await questions.handler(testEvent);
      expect(response.short_name).toEqual('test_question_1');
      expect(response.long_name).toEqual('Updated Test Question 1');
      expect(response.text).toEqual('New Question');
      expect(response.help).toEqual('New Help');
      expect(response.required).toEqual(true);
      expect(response.daac_ids).toEqual(['cdccdd71-cbe2-4220-8569-a6355ea24f3f']);
    });
  });
  describe('should not update a question for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'update',
        context: { user_id: requestorId },
        params: {
          payload: {
            short_name: 'test_question_1',
            version: 1,
            long_name: 'Updated Test Question 1',
            text: 'New Question',
            help: 'New Help',
            required: true,
            created_at: '2026-03-30',
            daac_ids: ['cdccdd71-cbe2-4220-8569-a6355ea24f3f']
          }
        }
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should add a question for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'add',
        context: { user_id: requestorId },
        params: {
          payload: {
            short_name: 'added_question',
            version: 1,
            long_name: 'A newly added question',
            text: 'Question text',
            help: 'Help text',
            required: false,
            section_question: {
              section_id: 'b1858733-5f55-44a5-adc2-84a66f6e9585',
              list_order: 0
            }
          }
        }
      };
      const response = await questions.handler(testEvent);
      expect(response.short_name).toEqual('added_question');
      expect(response.long_name).toEqual('A newly added question');
      expect(response.text).toEqual('Question text');
      expect(response.help).toEqual('Help text');
      expect(response.required).toEqual(false);
      expect(response.daac_ids).toEqual([]);
    });
  });
  describe('should not add a question for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'add',
        context: { user_id: requestorId },
        params: {
          payload: {
            short_name: 'not_added_question',
            version: 1,
            long_name: 'A Question',
            text: 'Question text',
            help: 'Help text',
            required: false,
            section_question: {
              section_id: 'b1858733-5f55-44a5-adc2-84a66f6e9585',
              list_order: 1
            }
          }
        }
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should find input by id for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'inputFindById',
        context: { user_id: requestorId },
        params: {
          id: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
          control_id: 'test_input_A'
        }
      };
      const response = await questions.handler(testEvent);
      expect(response.question_id).toEqual('549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e');
      expect(response.control_id).toEqual('test_input_A');
    });
  });
  describe('should not find input by id for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'inputFindById',
        context: { user_id: requestorId },
        params: {
          id: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
          control_id: 'test_input_A'
        }
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should find all inputs for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'inputFindAll',
        context: { user_id: requestorId }
      };
      const response = await questions.handler(testEvent);
      expect(response.length).toBeGreaterThan(0);
    });
  });
  describe('should not find all inputs for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'inputFindAll',
        context: { user_id: requestorId }
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should create an input for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'createInput',
        context: { user_id: requestorId },
        params: {
          question_id: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
          control_id: 'test_input_C',
          list_order: 8,
          label: 'C',
          type: 'checkbox',
          enums: '{}',
          attributes: '{}',
          required_if: '[]',
          show_if: '[]',
          required: false
        }
      };
      const expected = {
        question_id: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
        control_id: 'test_input_C',
        list_order: 8,
        label: 'C',
        type: 'checkbox',
        enums: {},
        attributes: {},
        required_if: [],
        show_if: [],
        required: false
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual(expected);
    });
  });
  describe('should not create an input for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'createInput',
        context: { user_id: requestorId },
        params: {}
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  describe('should update an input for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'ADMIN', requestorId: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'updateInput',
        context: { user_id: requestorId },
        params: {
          question_id: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
          control_id: 'test_input_D',
          list_order: 4,
          label: 'D',
          type: 'checkbox',
          enums: '{}',
          attributes: '{}',
          required_if: '[]',
          show_if: '[]',
          required: true,
          old_question_id: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
          old_control_id: 'test_input_A'
        }
      };
      const expected = {
        question_id: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
        control_id: 'test_input_D',
        list_order: 4,
        label: 'D',
        type: 'checkbox',
        enums: {},
        attributes: {},
        required_if: [],
        show_if: [],
        required: true
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual(expected);
    });
  });
  describe('should not update an input for users with ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'updateInput',
        context: { user_id: requestorId },
        params: {}
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
  it('should update inputs for a question', async () => {
    const testEvent = {
      operation: 'updateInputs',
      context: { user_id: '1b10a09d-d342-4eee-a9eb-c99acd2dde17' },
      params: {
        questionId: '549b4e0c-e2ff-49a6-8f9d-a6e9968ffd7e',
        inputs: [
          {
            control_id: 'test_input_J',
            list_order: 5,
            label: 'J',
            type: 'checkbox',
            enums: '{}',
            attributes: '{}',
            required_if: '[]',
            show_if: '[]',
            required: true
          },
          {
            control_id: 'test_input_K',
            list_order: 6,
            label: 'K',
            type: 'checkbox',
            enums: '{}',
            attributes: '{}',
            required_if: '[]',
            show_if: '[]',
            required: false
          }
        ]
      }
    };
    const expected = [
      {
        control_id: 'test_input_J',
        list_order: 0,
        label: 'J',
        type: 'checkbox',
        enums: {},
        attributes: {},
        required_if: [],
        show_if: [],
        required: true
      },
      {
        control_id: 'test_input_K',
        list_order: 1,
        label: 'K',
        type: 'checkbox',
        enums: {},
        attributes: {},
        required_if: [],
        show_if: [],
        required: false
      }
    ];
    const response = await questions.handler(testEvent);
    expect(response.inputs).toEqual(expected);
  });
  describe('should not update inputs for users without ADMIN', () => {
    const testCases = [
      { descriptor: 'DS', requestorId: 'b753d4f2-52b8-4224-8036-03a8f9dcf9a1' },
      { descriptor: 'DM', requestorId: '8b52fc38-e03c-4c4f-8ef7-94d96002e8fc' },
      { descriptor: 'Observer', requestorId: '229d4527-ac79-4784-969c-2820b28c3f9f' },
      { descriptor: 'UWG', requestorId: 'db85c3fc-9d05-4749-81a2-3f028e11644f' },
      { descriptor: 'DP', requestorId: '12afacf8-fae8-4b13-83c3-7d332732a291' }
    ];

    it.each(testCases)("when the requestor is a $descriptor with id '$requestorId'", async ({ requestorId }) => {
      const testEvent = {
        operation: 'updateInputs',
        context: { user_id: requestorId },
        params: {}
      };
      const response = await questions.handler(testEvent);
      expect(response).toEqual({});
    });
  });
});
