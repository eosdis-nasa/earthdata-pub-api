const workflow = require('../../workflow');
const db = require('database-util');

jest.mock('database-util', () => jest.fn());

const old_workflow  = {steps:{
        init: {
            type: "init",
            step_id: "df110469-a40a-42be-9c7f-da61023d341e",
            step_message: "",
            next_step_name: "data_publication_request_form"
        },
        close: {
            type: "close",
            step_id: "8b428f04-363d-4180-9a3b-991a57c3c12c",
            prev_step_name: "data_publication_request_form_review"
        },
        data_publication_request_form: {
            type: "form",
            form_id: "19025579-99ca-4344-8610-704dae626343",
            step_id: "5ceb67b9-484c-48a6-bbc9-f6bba323d5b7",
            step_message: "",
            next_step_name: "data_publication_request_form_review",
            prev_step_name: "init"
        },
        data_publication_request_form_review: {
            type: "review",
            step_id: "611f9596-efd1-461c-b804-c3e761255696",
            prev_step: {
                type: "form",
                form_id: "19025579-99ca-4344-8610-704dae626343",
                rollback: "data_publication_request_form"
            },
            step_message: "",
            next_step_name: "close",
            prev_step_name: "data_publication_request_form"
        }
    }
};


db.workflow = jest.fn();
db.workflow.initialize = jest.fn();
db.workflow.createStep = jest.fn();
db.workflow.addStep = jest.fn();
db.workflow.addClose = jest.fn();
db.workflow.clearSteps = jest.fn();
db.workflow.deleteWorkflow = jest.fn();
db.workflow.findById = jest.fn();
db.workflow.updateWorkflowMetaData = jest.fn();

db.user = jest.fn();
db.user.findById = jest.fn();
const invalid_workflow = {
    queriedAt: 1699456414390,
    id: "45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8",
    short_name: "ghrc_default_workflow",
    version: 1,
    long_name: "GHRC Default Workflow",
    description: "This is the default workflow for GHRC.",
    created_at: "2022-08-23T00:12:02.158Z",
    steps:{
        init: {
            type: "init",
            step_id: "df110469-a40a-42be-9c7f-da61023d341e",
            step_message: "",
            next_step_name: "data_publication_request_form"
        },
        close: {
            type: "close",
            step_id: "8b428f04-363d-4180-9a3b-991a57c3c12c",
            prev_step_name: "data_publication_request_form_review"
        },
        data_publication_request_form: {
            type: "form",
            form_id: "19025579-99ca-4344-8610-704dae626343",
            step_id: "5ceb67b9-484c-48a6-bbc9-f6bba323d5b7",
            step_message: "",
            next_step_name: "data_publication_request_form",
            prev_step_name: "init"
        },
        data_publication_request_form_review: {
            type: "review",
            step_id: "611f9596-efd1-461c-b804-c3e761255696",
            prev_step: {
                type: "form",
                form_id: "19025579-99ca-4344-8610-704dae626343",
                rollback: "data_publication_request_form"
            },
            step_message: "",
            next_step_name: "close",
            prev_step_name: "data_publication_request_form"
        }
    }
}
const payload = {
    queriedAt: 1699456414390,
    id: "45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8",
    short_name: "ghrc_default_workflow",
    version: 1,
    long_name: "GHRC Default Workflow",
    description: "This is the default workflow for GHRC.",
    created_at: "2022-08-23T00:12:02.158Z",
    steps: {
        init: {
            type: "init",
            step_id: "df110469-a40a-42be-9c7f-da61023d341e",
            step_message: "",
            next_step_name: "data_accession_request_form"
        },
        close: {
            type: "close",
            step_id: "8b428f04-363d-4180-9a3b-991a57c3c12c",
            prev_step_name: "push_collection_metadata_to_cmr_via_mmt"
        },
        data_accession_request_form: {
            type: "form",
            form_id: "6c544723-241c-4896-a38c-adbc0a364293",
            step_id: "b860d03a-baee-4ba8-80f2-f522dd8dbf11",
            step_message: "",
            next_step_name: "data_accession_request_form_review",
            prev_step_name: "init"
        },
        data_publication_request_form: {
            type: "form",
            form_id: "19025579-99ca-4344-8610-704dae626343",
            step_id: "5ceb67b9-484c-48a6-bbc9-f6bba323d5b7",
            step_message: "",
            next_step_name: "data_publication_request_form_review",
            prev_step_name: "data_accession_request_form_review"
        },
        map_question_response_to_ummc: {
            type: "action",
            step_id: "d6dc6c6a-7c58-4916-a571-f5fa429681ef",
            action_id: "f812eb99-7c4a-46a8-8d8f-30ae509fe21c",
            prev_step: {
                type: "action",
                rollback: "confirmation_form"
            },
            step_message: "",
            next_step_name: "create_skeleton_dataset_record_in_mmt",
            prev_step_name: "data_publication_request_form_review"
        },
        data_accession_request_form_review: {
            type: "review",
            step_id: "11f3e4c9-ba94-4516-8bde-ddd701f84474",
            prev_step: {
                type: "form",
                form_id: "6c544723-241c-4896-a38c-adbc0a364293",
                rollback: "data_accession_request_form"
            },
            step_message: "",
            next_step_name: "data_publication_request_form",
            prev_step_name: "data_accession_request_form"
        },
        data_publication_request_form_review: {
            type: "review",
            step_id: "611f9596-efd1-461c-b804-c3e761255696",
            prev_step: {
                type: "form",
                form_id: "19025579-99ca-4344-8610-704dae626343",
                rollback: "data_publication_request_form"
            },
            step_message: "",
            next_step_name: "map_question_response_to_ummc",
            prev_step_name: "data_publication_request_form"
        },
        create_skeleton_dataset_record_in_mmt: {
            type: "action",
            step_id: "d278f01e-1ef7-4677-a350-73ccadeddc22",
            prev_step: {
                type: "action",
                rollback: "assign_los_short_name_doi"
            },
            step_message: "",
            next_step_name: "push_collection_metadata_to_cmr_via_mmt",
            prev_step_name: "map_question_response_to_ummc"
        },
        push_collection_metadata_to_cmr_via_mmt: {
            type: "action",
            step_id: "9549666c-94ff-4ff5-accc-1df834fde963",
            prev_step: {
                type: "action",
                rollback: "final_data_producer_review_and_approval"
            },
            step_message: "",
            next_step_name: "close",
            prev_step_name: "create_skeleton_dataset_record_in_mmt"
        }
    }
};

describe('workflow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should create a new workflow', async () => {
        const createPayload = {
            params:payload,
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            operation: 'createWorkflow'
        };
        db.user.findById.mockReturnValue({user_privileges: ['WORKFLOW_CREATE']});
        db.workflow.initialize.mockReturnValue({id: '45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8'});
        db.workflow.createStep.mockImplementation((params) => {return payload.steps[params.step_name]});
        db.workflow.findById.mockReturnValue(payload);
        const response = await workflow.handler(createPayload);
        expect(response).toEqual(payload);
    });
    it('should update a workflow', async () => {
        const updatePayload = {
            params:payload,
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            operation: 'editWorkflow'
        };
        db.user.findById.mockReturnValue({user_privileges: ['WORKFLOW_UPDATE']});
        db.workflow.createStep.mockImplementation((params) => {return payload.steps[params.step_name]});
        db.workflow.findById.mockReturnValue(old_workflow)
        db.workflow.updateWorkflowMetaData.mockReturnValue(payload);
        const response = await workflow.handler(updatePayload);
        expect(response).toEqual(payload);
    })
    it('should reject an invalid update', async () => {
        const updatePayload = {
            params:invalid_workflow,
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            operation: 'editWorkflow'
        };
        db.user.findById.mockReturnValue({user_privileges: ['WORKFLOW_UPDATE']});
        db.workflow.createStep.mockImplementation((params) => {return payload.steps[params.step_name]});
        db.workflow.findById.mockReturnValue(old_workflow)
        db.workflow.updateWorkflowMetaData.mockReturnValue(payload);
        db.workflow.findById.mockReturnValue(old_workflow);
        const response = await workflow.handler(updatePayload);
        expect(response).toEqual(old_workflow);
    })
    it('should reject an invalid create', async () => {
        const createPayload = {
            params:invalid_workflow,
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            operation: 'createWorkflow'
        };
        db.user.findById.mockReturnValue({user_privileges: ['WORKFLOW_CREATE']});
        db.workflow.initialize.mockReturnValue({id: '45e8d0e8-d8c9-47e1-85a2-5b5db6e34dd8'});
        db.workflow.createStep.mockImplementation((params) => {return payload.steps[params.step_name]});
        const response = await workflow.handler(createPayload);
        expect(response).toEqual({status: 'Invalid Workflow'});
    })
    it('should reject an invalid user', async () => {
        const createPayload = {
            params:payload,
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            operation: 'createWorkflow'
        };
        db.user.findById.mockReturnValue({user_privileges: ['INVALID']});
        const response = await workflow.handler(createPayload);
        expect(response).toEqual({status: 'Invalid Permissions'});
    })
    it('should reject an invalid user update', async () => {
        const createPayload = {
            params:payload,
            context:{user_id: '958fab13-ae06-470b-80e0-c9ba4e60f1bc'},
            operation: 'editWorkflow'
        };
        db.user.findById.mockReturnValue({user_privileges: ['INVALID']});
        const response = await workflow.handler(createPayload);
        expect(response).toEqual({status: 'Invalid Permissions'});
    })
})