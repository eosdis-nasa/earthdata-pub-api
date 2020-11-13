CREATE TRIGGER insert_submission AFTER INSERT ON submission
FOR EACH ROW EXECUTE PROCEDURE init_submission();

CREATE TRIGGER update_submission_status AFTER UPDATE ON submission_status
FOR EACH ROW EXECUTE PROCEDURE check_workflow_state();
