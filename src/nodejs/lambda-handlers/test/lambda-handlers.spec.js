const actionConsumer = require('../action-consumer.js');
const apiProxy = require('../api-proxy.js');
const auth = require('../auth.js');
const data = require('../data.js');
const fileUpload = require('../file-upload.js');
const inboundConsumer = require('../inbound-consumer.js');
const invoke = require('../invoke.js');
const metricsConsumer = require('../metrics-consumer.js');
const metrics = require('../metrics.js');
const model = require('../model.js');
const notificationConsumer = require('../notification-consumer.js');
const notification = require('../notification.js');
const oidcAuthorizer = require('../oidc-authorizer.js');
const questions = require('../questions.js');
const rdsBackup = require('../rds-backup.js');
const register = require('../register.js');
const remapStatics = require('../remap-statics.js');
const serviceAuthorizer = require('../service-authorizer.js');
const submission = require('../submission.js');
const subscribe = require('../subscribe.js');
const user = require('../user.js');
const version = require('../version.js');
const workflow = require('../workflow.js');
const workflowConsumer = require('../workflow-consumer.js');

describe('Action Consumer', () => {
  it('should import without error', () => {
    expect(actionConsumer).toBeTruthy();
  });
});

describe('API Proxy', () => {
  it('should import without error', () => {
    expect(apiProxy).toBeTruthy();
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
    expect(fileUpload).toBeTruthy();
  });
});

describe('Inbound Consumer', () => {
  it('should import without error', () => {
    expect(inboundConsumer).toBeTruthy();
  });
});

describe('Invoke', () => {
  it('should import without error', () => {
    expect(invoke).toBeTruthy();
  });
});

describe('Metrics Consumer', () => {
  it('should import without error', () => {
    expect(metricsConsumer).toBeTruthy();
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
    expect(notificationConsumer).toBeTruthy();
  });
});

describe('Notification', () => {
  it('should import without error', () => {
    expect(notification).toBeTruthy();
  });
});

describe('OIDC Authorizer', () => {
  it('should import without error', () => {
    expect(oidcAuthorizer).toBeTruthy();
  });
});

describe('Questions', () => {
  it('should import without error', () => {
    expect(questions).toBeTruthy();
  });
});

describe('RDS Backup', () => {
  it('should import without error', () => {
    expect(rdsBackup).toBeTruthy();
  });
});

describe('Register', () => {
  it('should import without error', () => {
    expect(register).toBeTruthy();
  });
});

describe('Remap Statics', () => {
  it('should import without error', () => {
    expect(remapStatics).toBeTruthy();
  });
});

describe('Service Authorizer', () => {
  it('should import without error', () => {
    expect(serviceAuthorizer).toBeTruthy();
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
    expect(workflowConsumer).toBeTruthy();
  });
});
