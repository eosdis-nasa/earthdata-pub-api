const action_consumer = require('../action-consumer.js');
const api_proxy = require('../api-proxy.js');
const auth = require('../auth.js');
const data = require('../data.js');
const file_upload = require('../file-upload.js');
const inbound_consumer = require('../inbound-consumer.js');
const invoke = require('../invoke.js');
const metrics_consumer = require('../metrics-consumer.js');
const metrics  = require('../metrics.js');
const model = require('../model.js');
const notification_consumer = require('../notification-consumer.js');
const notification = require('../notification.js');
const questions = require('../questions.js');
const rds_backup = require('../rds-backup.js');
const register = require('../register.js');
const remap_statics = require('../remap-statics.js');
const service_authorizer = require('../service-authorizer.js');
const submission = require('../submission.js');
const subscribe = require('../subscribe.js');
const user = require('../user.js');
const version = require('../version.js');
const workflow = require('../workflow.js');
const workflow_consumer = require('../workflow-consumer.js');

describe('Action Consumer', () => {
    it('should import without error', () => {
    expect(action_consumer).toBeTruthy();
    });
});

describe('API Proxy', () => {
    it('should import without error', () => {
    expect(api_proxy).toBeTruthy();
    });
});

describe('Auth', () => {
    it('should import without error', () => {
    expect(auth).toBeTruthy();
    });
});

describe('Data', () => {
    it('should import without error', () => {
    expect(data).toBeTruthy();
    });
});

describe('File Upload', () => {
    it('should import without error', () => {
    expect(file_upload).toBeTruthy();
    });
});

describe('Inbound Consumer', () => {
    it('should import without error', () => {
    expect(inbound_consumer).toBeTruthy();
    });
});

describe('Invoke', () => {
    it('should import without error', () => {
    expect(invoke).toBeTruthy();
    });
});

describe('Metrics Consumer', () => {
    it('should import without error', () => {
    expect(metrics_consumer).toBeTruthy();
    });
});

describe('Metrics', () => {
    it('should import without error', () => {
    expect(metrics).toBeTruthy();
    });
});

describe('Model', () => {
    it('should import without error', () => {
    expect(model).toBeTruthy();
    });
});

describe('Notification Consumer', () => {
    it('should import without error', () => {
    expect(notification_consumer).toBeTruthy();
    });
});

describe('Notification', () => {
    it('should import without error', () => {
    expect(notification).toBeTruthy();
    });
});

describe('Questions', () => {
    it('should import without error', () => {
    expect(questions).toBeTruthy();
    });
});

describe('RDS Backup', () => {
    it('should import without error', () => {
    expect(rds_backup).toBeTruthy();
    });
});

describe('Register', () => {
    it('should import without error', () => {
    expect(register).toBeTruthy();
    });
});

describe('Remap Statics', () => {
    it('should import without error', () => {
    expect(remap_statics).toBeTruthy();
    });
});

describe('Service Authorizer', () => {
    it('should import without error', () => {
    expect(service_authorizer).toBeTruthy();
    });
});

describe('Submission', () => {
    it('should import without error', () => {
    expect(submission).toBeTruthy();
    });
});

describe('Subscribe', () => {
    it('should import without error', () => {
    expect(subscribe).toBeTruthy();
    });
});

describe('User', () => {
    it('should import without error', () => {
    expect(user).toBeTruthy();
    });
});

describe('Version', () => {
    it('should import without error', () => {
    expect(version).toBeTruthy();
    });
});

describe('Workflow', () => {
    it('should import without error', () => {
    expect(workflow).toBeTruthy();
    });
});

describe('Workflow Consumer', () => {
    it('should import without error', () => {
    expect(workflow_consumer).toBeTruthy();
    });
});
