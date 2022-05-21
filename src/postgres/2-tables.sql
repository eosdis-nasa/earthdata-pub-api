DROP TABLE IF EXISTS form CASCADE;

DROP TABLE IF EXISTS section CASCADE;

DROP TABLE IF EXISTS question CASCADE;

DROP TABLE IF EXISTS section_question CASCADE;

DROP TABLE IF EXISTS input CASCADE;

DROP TABLE IF EXISTS action CASCADE;

DROP TABLE IF EXISTS module CASCADE;

DROP TABLE IF EXISTS service CASCADE;

DROP TABLE IF EXISTS service_secret CASCADE;

DROP TABLE IF EXISTS edpuser CASCADE;

DROP TABLE IF EXISTS edpgroup CASCADE;

DROP TABLE IF EXISTS edpgroup_parent CASCADE;

DROP TABLE IF EXISTS edprole CASCADE;

DROP TABLE IF EXISTS edpuser_edpgroup CASCADE;

DROP TABLE IF EXISTS edpuser_edprole CASCADE;

DROP TABLE IF EXISTS daac CASCADE;

DROP TABLE IF EXISTS conversation CASCADE;

DROP TABLE IF EXISTS note CASCADE;

DROP TABLE IF EXISTS note_edpuser CASCADE;

DROP TABLE IF EXISTS conversation_edpuser CASCADE;

DROP TABLE IF EXISTS workflow CASCADE;

DROP TABLE IF EXISTS step CASCADE;

DROP TABLE IF EXISTS step_edge CASCADE;

DROP TABLE IF EXISTS submission CASCADE;

DROP TABLE IF EXISTS submission_status CASCADE;

DROP TABLE IF EXISTS submission_workflow CASCADE;

DROP TABLE IF EXISTS submission_metadata CASCADE;

DROP TABLE IF EXISTS submission_action_data CASCADE;

DROP TABLE IF EXISTS submission_form_data CASCADE;

DROP TABLE IF EXISTS submission_lock CASCADE;

DROP TABLE IF EXISTS edpuser_permission_submission CASCADE;

DROP TABLE IF EXISTS edpgroup_permission_submission CASCADE;

DROP TABLE IF EXISTS edpuser_subscription_action CASCADE;

DROP TABLE IF EXISTS edpuser_subscription_form CASCADE;

DROP TABLE IF EXISTS edpuser_subscription_service CASCADE;

DROP TABLE IF EXISTS edpuser_subscription_submission CASCADE;

DROP TABLE IF EXISTS edpuser_subscription_workflow CASCADE;

DROP TABLE IF EXISTS edpgroup_subscription_action CASCADE;

DROP TABLE IF EXISTS edpgroup_subscription_daac CASCADE;

DROP TABLE IF EXISTS edpgroup_subscription_form CASCADE;

DROP TABLE IF EXISTS edpgroup_subscription_service CASCADE;

DROP TABLE IF EXISTS edpgroup_subscription_submission CASCADE;

DROP TABLE IF EXISTS edpgroup_subscription_workflow CASCADE;

DROP TABLE IF EXISTS edprole_privilege CASCADE;

DROP TABLE IF EXISTS privilege CASCADE;

DROP TABLE IF EXISTS metrics CASCADE;

DROP TABLE IF EXISTS page CASCADE;

CREATE TABLE IF NOT EXISTS form (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  version SMALLINT,
  long_name VARCHAR NOT NULL,
  description VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (short_name, version)
);

CREATE TABLE IF NOT EXISTS section (
  id UUID DEFAULT UUID_GENERATE_V4(),
  form_id UUID NOT NULL,
  heading VARCHAR NOT NULL,
  list_order SMALLINT NOT NULL,
  required_if JSONB DEFAULT '[]'::JSONB,
  show_if JSONB DEFAULT '[]'::JSONB,
  daac_id UUID DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE (form_id, list_order),
  FOREIGN KEY (form_id) REFERENCES form (id)
);

CREATE TABLE IF NOT EXISTS question (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  version SMALLINT,
  long_name VARCHAR NOT NULL,
  text VARCHAR NOT NULL,
  help VARCHAR NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (short_name, version)
);

CREATE TABLE IF NOT EXISTS section_question (
  section_id UUID NOT NULL,
  question_id UUID NOT NULL,
  list_order SMALLINT NOT NULL,
  required_if JSONB DEFAULT '[]'::JSONB,
  show_if JSONB DEFAULT '[]'::JSONB,
  PRIMARY KEY (section_id, question_id, list_order),
  FOREIGN KEY (section_id) REFERENCES section (id),
  FOREIGN KEY (question_id) REFERENCES question (id),
  UNIQUE (section_id, question_id)
);

CREATE TABLE IF NOT EXISTS input (
  question_id UUID NOT NULL,
  control_id VARCHAR NOT NULL,
  list_order SMALLINT NOT NULL,
  label VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  enums JSONB DEFAULT '[]'::JSONB,
  attributes JSONB DEFAULT '{}'::JSONB,
  required_if JSONB DEFAULT '[]'::JSONB,
  show_if JSONB DEFAULT '[]'::JSONB,
  required BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (question_id, list_order),
  FOREIGN KEY (question_id) REFERENCES question (id),
  UNIQUE (question_id, control_id)
);

CREATE TABLE IF NOT EXISTS action (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  version SMALLINT,
  long_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  source BYTEA NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (short_name, version)
);

CREATE TABLE IF NOT EXISTS module (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  long_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  arn VARCHAR NOT NULL,
  has_interface BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (short_name)
);

CREATE TABLE IF NOT EXISTS service (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  long_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  endpoint VARCHAR NOT NULL,
  options JSONB DEFAULT '{}'::jsonb,
  headers JSONB DEFAULT '{}'::jsonb,
  method VARCHAR NOT NULL CHECK (method IN ('POST', 'GET')),
  code SMALLINT NOT NULL,
  payload BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (short_name)
);

CREATE TABLE IF NOT EXISTS edpuser (
  id UUID DEFAULT UUID_GENERATE_V4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  refresh_token VARCHAR DEFAULT 'none',
  registered TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS edpgroup (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  long_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (short_name),
  UNIQUE (long_name)
);

CREATE TABLE IF NOT EXISTS edpgroup_parent (
  id UUID NOT NULL,
  parent_id UUID NOT NULL,
  PRIMARY KEY (id, parent_id),
  FOREIGN KEY (id) REFERENCES edpgroup (id),
  FOREIGN KEY (parent_id) REFERENCES edpgroup (id)
);

CREATE TABLE IF NOT EXISTS edprole (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  long_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (short_name),
  UNIQUE (long_name)
);

CREATE TABLE IF NOT EXISTS edpuser_edpgroup (
  edpuser_id UUID NOT NULL,
  edpgroup_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, edpgroup_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (edpgroup_id) REFERENCES edpgroup (id)
);

CREATE TABLE IF NOT EXISTS edpuser_edprole (
  edpuser_id UUID NOT NULL,
  edprole_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, edprole_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (edprole_id) REFERENCES edprole (id)
);

CREATE TABLE IF NOT EXISTS conversation (
  id UUID DEFAULT UUID_GENERATE_V4(),
  subject VARCHAR DEFAULT 'No Subject',
  created_at TIMESTAMP DEFAULT NOW(),
  last_change TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS note (
  id UUID DEFAULT UUID_GENERATE_V4(),
  conversation_id UUID NOT NULL,
  sender_edpuser_id UUID NOT NULL,
  text VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (sender_edpuser_id) REFERENCES edpuser (id),
  UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS conversation_edpuser (
  conversation_id UUID NOT NULL,
  edpuser_id UUID NOT NULL,
  unread BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (conversation_id, edpuser_id),
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id)
);

CREATE TABLE IF NOT EXISTS workflow (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  version SMALLINT NOT NULL,
  long_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (short_name, version)
);

CREATE TABLE IF NOT EXISTS step (
  step_id UUID DEFAULT UUID_GENERATE_V4(),
  step_name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  action_id UUID,
  form_id UUID,
  service_id UUID,
  data JSONB,
  PRIMARY KEY (step_id),
  UNIQUE (step_name),
  FOREIGN KEY (action_id) REFERENCES action (id),
  FOREIGN KEY (form_id) REFERENCES form (id),
  FOREIGN KEY (service_id) REFERENCES service (id),
  CONSTRAINT step_type_check CHECK (type IN ('init', 'action', 'form', 'review', 'service', 'close')),
  CONSTRAINT step_foreign_key_check CHECK (NUM_NONNULLS(action_id, form_id, service_id) <= 1)
);

CREATE TABLE IF NOT EXISTS step_edge (
  workflow_id UUID NOT NULL,
  step_name VARCHAR NOT NULL,
  next_step_name VARCHAR,
  PRIMARY KEY (workflow_id, step_name),
  UNIQUE (workflow_id, next_step_name),
  FOREIGN KEY (step_name) REFERENCES step (step_name),
  FOREIGN KEY (next_step_name) REFERENCES step (step_name)
);

CREATE TABLE IF NOT EXISTS daac (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  long_name VARCHAR NOT NULL,
  url VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  discipline VARCHAR NOT NULL,
  workflow_id UUID NOT NULL,
  edpgroup_id UUID NOT NULL,
  hidden BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE (short_name),
  UNIQUE (long_name),
  FOREIGN KEY (workflow_id) REFERENCES workflow (id),
  FOREIGN KEY (edpgroup_id) REFERENCES edpgroup (id)
);

CREATE TABLE IF NOT EXISTS submission (
  id UUID DEFAULT UUID_GENERATE_V4(),
  name VARCHAR,
  initiator_edpuser_id UUID NOT NULL,
  daac_id UUID,
  conversation_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  hidden BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id),
  FOREIGN KEY (initiator_edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (daac_id) REFERENCES daac (id)
);

CREATE TABLE IF NOT EXISTS submission_status (
  id UUID NOT NULL,
  workflow_id UUID NOT NULL,
  step_name VARCHAR NOT NULL,
  last_change TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (step_name) REFERENCES step (step_name)
);

CREATE TABLE IF NOT EXISTS submission_workflow (
  id UUID NOT NULL,
  workflow_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT NOW(),
  complete_time TIMESTAMP,
  PRIMARY KEY (id, workflow_id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (workflow_id) REFERENCES workflow (id)
);

CREATE TABLE IF NOT EXISTS submission_metadata (
  id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS submission_action_data (
  id UUID NOT NULL,
  action_id UUID NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  PRIMARY KEY (id, action_id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (action_id) REFERENCES action (id)
);

CREATE TABLE IF NOT EXISTS submission_form_data (
  id UUID NOT NULL,
  form_id UUID NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  submitted_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id, form_id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (form_id) REFERENCES form (id)
);

CREATE TABLE IF NOT EXISTS submission_lock (
  id UUID NOT NULL,
  edpuser_id UUID,
  context VARCHAR DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id)
);

CREATE TABLE IF NOT EXISTS service_secret (
  id UUID NOT NULL,
  secret VARCHAR NOT NULL,
  submission_id UUID NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES service (id),
  FOREIGN KEY (submission_id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS edpuser_permission_submission (
  edpuser_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, submission_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (submission_id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_permission_submission (
  edpgroup_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, submission_id),
  FOREIGN KEY (submission_id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS privilege (
  privilege VARCHAR NOT NULL,
  PRIMARY KEY (privilege)
);

CREATE TABLE IF NOT EXISTS edprole_privilege (
  edprole_id UUID NOT NULL,
  privilege VARCHAR NOT NULL,
  PRIMARY KEY (edprole_id, privilege),
  FOREIGN KEY (edprole_id) REFERENCES edprole (id),
  FOREIGN KEY (privilege) REFERENCES privilege (privilege)
);

CREATE TABLE IF NOT EXISTS edpuser_subscription_action (
  edpuser_id UUID NOT NULL,
  action_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, action_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (action_id) REFERENCES action (id)
);

CREATE TABLE IF NOT EXISTS edpuser_subscription_form (
  edpuser_id UUID NOT NULL,
  form_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, form_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (form_id) REFERENCES form (id)
);

CREATE TABLE IF NOT EXISTS edpuser_subscription_service (
  edpuser_id UUID NOT NULL,
  service_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, service_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (service_id) REFERENCES service (id)
);

CREATE TABLE IF NOT EXISTS edpuser_subscription_submission (
  edpuser_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, submission_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (submission_id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS edpuser_subscription_workflow (
  edpuser_id UUID NOT NULL,
  workflow_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, workflow_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser(id),
  FOREIGN KEY (workflow_id) REFERENCES workflow (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_subscription_action (
  edpgroup_id UUID NOT NULL,
  action_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, action_id),
  FOREIGN KEY (edpgroup_id) REFERENCES edpgroup (id),
  FOREIGN KEY (action_id) REFERENCES action (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_subscription_daac (
  edpgroup_id UUID NOT NULL,
  daac_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, daac_id),
  FOREIGN KEY (edpgroup_id) REFERENCES edpgroup (id),
  FOREIGN KEY (daac_id) REFERENCES daac (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_subscription_form (
  edpgroup_id UUID NOT NULL,
  form_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, form_id),
  FOREIGN KEY (edpgroup_id) REFERENCES edpgroup (id),
  FOREIGN KEY (form_id) REFERENCES form (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_subscription_service (
  edpgroup_id UUID NOT NULL,
  service_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, service_id),
  FOREIGN KEY (edpgroup_id) REFERENCES edpgroup (id),
  FOREIGN KEY (service_id) REFERENCES service (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_subscription_submission (
  edpgroup_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, submission_id),
  FOREIGN KEY (submission_id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_subscription_workflow (
  edpgroup_id UUID NOT NULL,
  workflow_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, workflow_id),
  FOREIGN KEY (workflow_id) REFERENCES workflow (id)
);

CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT UUID_GENERATE_V4(),
  event JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page (
  page_key VARCHAR NOT NULL,
  content JSONB NOT NULL,
  PRIMARY KEY (page_key)
);
