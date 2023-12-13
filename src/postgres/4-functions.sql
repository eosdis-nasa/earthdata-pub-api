CREATE OR REPLACE FUNCTION init_workflow_id()
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
workflow_id UUID;
BEGIN
  SELECT workflow.id INTO workflow_id
  FROM workflow
  WHERE workflow.short_name = 'init_workflow'
  ORDER BY workflow.version DESC
  LIMIT 1;
RETURN workflow_id;
END;
$$;

CREATE OR REPLACE FUNCTION daac_workflow_id(daac_id UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
workflow_id UUID;
BEGIN
  SELECT daac.workflow_id INTO workflow_id
  FROM daac
  WHERE daac.id = daac_id;
RETURN workflow_id;
END;
$$;

CREATE OR REPLACE FUNCTION init_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
INSERT INTO submission_metadata(id)
  VALUES(NEW.id);
INSERT INTO submission_status(id, workflow_id, step_name)
  VALUES(NEW.id, COALESCE(daac_workflow_id(NEW.daac_id), init_workflow_id()), 'init');
INSERT INTO submission_workflow(id, workflow_id)
  VALUES(NEW.id, COALESCE(daac_workflow_id(NEW.daac_id), init_workflow_id()));
RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION before_init_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
conv_id UUID;
BEGIN
SELECT UUID_GENERATE_V4() INTO conv_id;
INSERT INTO conversation(id, subject)
  VALUES(conv_id, 'Request ID ' || NEW.id);
INSERT INTO conversation_edpuser(edpuser_id, conversation_id)
  VALUES(NEW.initiator_edpuser_id, conv_id);
NEW.conversation_id := conv_id;
RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION check_workflow_state()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.step_name = 'close' THEN
    UPDATE submission_workflow SET
    complete_time = NOW()
    WHERE submission_workflow.id = NEW.id
    AND submission_workflow.workflow_id = NEW.workflow_id;
  END IF;
  RETURN NEW;
END;
$$;
