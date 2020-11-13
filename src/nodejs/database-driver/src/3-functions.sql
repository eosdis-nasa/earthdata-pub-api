CREATE OR REPLACE FUNCTION init_workflow_id ()
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
workflow_id UUID;
BEGIN
  SELECT workflow.id INTO workflow_id
  FROM workflow
  WHERE workflow.workflow_name = 'init_workflow'
  ORDER BY workflow.version DESC
  LIMIT 1;
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
  VALUES(NEW.id, init_workflow_id(), 'init');
INSERT INTO submission_workflow(id, workflow_id)
  VALUES(NEW.id, init_workflow_id());
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
