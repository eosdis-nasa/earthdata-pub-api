CREATE TABLE IF NOT EXISTS form (
  id UUID DEFAULT UUID_GENERATE_V4(),
  form_name VARCHAR NOT NULL,
  version SMALLINT,
  description VARCHAR,
  text VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (form_name, version)
);

CREATE TABLE IF NOT EXISTS section (
  id UUID DEFAULT UUID_GENERATE_V4(),
  form_id UUID NOT NULL,
  heading VARCHAR NOT NULL,
  list_order SMALLINT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (form_id, list_order),
  FOREIGN KEY (form_id) REFERENCES form (id)
);

CREATE TABLE IF NOT EXISTS question (
  id UUID DEFAULT UUID_GENERATE_V4(),
  question_name VARCHAR NOT NULL,
  version SMALLINT,
  title VARCHAR NOT NULL,
  text VARCHAR NOT NULL,
  help VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (question_name, version)
);

CREATE TABLE IF NOT EXISTS section_question (
  section_id UUID NOT NULL,
  question_id UUID NOT NULL,
  list_order SMALLINT NOT NULL,
  PRIMARY KEY (section_id, question_id, list_order),
  FOREIGN KEY (section_id) REFERENCES section (id),
  FOREIGN KEY (question_id) REFERENCES question (id)
);

CREATE TABLE IF NOT EXISTS input (
  question_id UUID NOT NULL,
  id VARCHAR NOT NULL,
  list_order SMALLINT NOT NULL,
  label VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  enums JSONB DEFAULT '[]'::jsonb,
  attributes JSONB DEFAULT '{}'::jsonb,
  required BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (question_id, list_order),
  FOREIGN KEY (question_id) REFERENCES question (id)
);

CREATE TABLE IF NOT EXISTS action (
  id UUID DEFAULT UUID_GENERATE_V4(),
  action_name VARCHAR NOT NULL,
  version SMALLINT,
  description VARCHAR NOT NULL,
  file_key VARCHAR NOT NULL,
  input_schema JSONB DEFAULT '{}'::jsonb,
  PRIMARY KEY (id),
  UNIQUE (action_name)
);

CREATE TABLE IF NOT EXISTS service (
  id UUID DEFAULT UUID_GENERATE_V4(),
  service_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  endpoint VARCHAR NOT NULL,
  options JSONB DEFAULT '{}'::jsonb,
  headers JSONB DEFAULT '{}'::jsonb,
  method VARCHAR NOT NULL CHECK (method IN ('POST', 'GET')),
  code SMALLINT NOT NULL,
  payload BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (service_name)
);

CREATE TABLE IF NOT EXISTS service_secret (
  id UUID NOT NULL,
  secret UUID NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES service (id)
);

CREATE TABLE IF NOT EXISTS edpuser (
  id UUID NOT NULL,
  full_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  registered TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS edpgroup (
  id UUID DEFAULT UUID_GENERATE_V4(),
  group_name VARCHAR NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (group_name)
);

CREATE TABLE IF NOT EXISTS edpuser_edpgroup (
  edpuser_id UUID NOT NULL,
  edpgroup_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, edpgroup_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (edpgroup_id) REFERENCES edpgroup (id)
);

CREATE TABLE IF NOT EXISTS daac (
  id UUID DEFAULT UUID_GENERATE_V4(),
  short_name VARCHAR NOT NULL,
  long_name VARCHAR NOT NULL,
  url VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  default_edpgroup_id UUID NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (short_name),
  UNIQUE (long_name),
  FOREIGN KEY (default_edpgroup_id) REFERENCES edpgroup (id)
);

CREATE TABLE IF NOT EXISTS conversation (
  id UUID DEFAULT UUID_GENERATE_V4(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS note (
  id UUID DEFAULT UUID_GENERATE_V4(),
  conversation_id UUID NOT NULL,
  sender_edpuser_id UUID NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('submission', 'workflow', 'action', 'external')),
  subcategory VARCHAR,
  subject VARCHAR DEFAULT 'No Subject',
  text VARCHAR NOT NULL,
  sent TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (sender_edpuser_id) REFERENCES edpuser (id),
  UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS note_edpuser (
  note_id UUID NOT NULL,
  edpuser_id UUID NOT NULL,
  note_viewed BOOLEAN DEFAULT False,
  PRIMARY KEY (note_id, edpuser_id),
  FOREIGN KEY (note_id) REFERENCES note (id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id)
);

CREATE TABLE IF NOT EXISTS conversation_edpuser (
  conversation_id UUID NOT NULL,
  edpuser_id UUID NOT NULL,
  PRIMARY KEY (conversation_id, edpuser_id),
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id)
);

CREATE TABLE IF NOT EXISTS workflow (
  id UUID DEFAULT UUID_GENERATE_V4(),
  version SMALLINT NOT NULL,
  workflow_name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (workflow_name, version)
);

CREATE TABLE IF NOT EXISTS step (
  workflow_id UUID NOT NULL,
  step_name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  action_id UUID,
  form_id UUID,
  service_id UUID,
  data JSONB,
  PRIMARY KEY (workflow_id, step_name),
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
  FOREIGN KEY (workflow_id, step_name) REFERENCES step (workflow_id, step_name),
  FOREIGN KEY (workflow_id, next_step_name) REFERENCES step (workflow_id, step_name)
);

CREATE TABLE IF NOT EXISTS submission (
  id UUID DEFAULT UUID_GENERATE_V4(),
  initiator_edpuser_id UUID NOT NULL,
  daac_short_name VARCHAR,
  PRIMARY KEY (id),
  FOREIGN KEY (initiator_edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (daac_short_name) REFERENCES daac (short_name)
);

CREATE TABLE IF NOT EXISTS submission_status (
  id UUID NOT NULL,
  workflow_id UUID,
  step_name VARCHAR,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (workflow_id, step_name) REFERENCES step (workflow_id, step_name)
);

CREATE TABLE IF NOT EXISTS submission_workflow (
  submission_id UUID NOT NULL,
  workflow_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT NOW(),
  complete_time TIMESTAMP,
  PRIMARY KEY (submission_id, workflow_id),
  FOREIGN KEY (submission_id) REFERENCES submission (id),
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
  action_data JSONB DEFAULT '{}'::JSONB,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS submission_form_data (
  id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS submission_secret (
  id UUID NOT NULL,
  secret UUID NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS submission_lock (
  id UUID NOT NULL,
  edpuser_id UUID NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES submission (id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id)
);

CREATE TABLE IF NOT EXISTS edpuser_permission_submission (
  edpuser_id UUID NOT NULL,
  allow VARCHAR NOT NULL CHECK (allow IN ('read', 'write')),
  submission_id UUID NOT NULL,
  PRIMARY KEY (edpuser_id, submission_id),
  FOREIGN KEY (edpuser_id) REFERENCES edpuser (id),
  FOREIGN KEY (submission_id) REFERENCES submission (id)
);

CREATE TABLE IF NOT EXISTS edpgroup_permission_submission (
  edpgroup_id UUID NOT NULL,
  allow VARCHAR NOT NULL CHECK (allow IN ('read', 'write')),
  submission_id UUID NOT NULL,
  PRIMARY KEY (edpgroup_id, submission_id),
  FOREIGN KEY (submission_id) REFERENCES submission (id)
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
  id UUID NOT NULL,
  level VARCHAR,
  event_type VARCHAR,
  sender VARCHAR,
  sender_data VARCHAR,
  message VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
)
