DROP TRIGGER IF EXISTS insert_submission ON submission;
DROP TRIGGER IF EXISTS before_insert_submission ON submission;
DROP TRIGGER IF EXISTS update_submission_status ON submission_status;

CREATE TRIGGER insert_submission AFTER INSERT ON submission
FOR EACH ROW EXECUTE PROCEDURE init_submission();

CREATE TRIGGER before_insert_submission BEFORE INSERT ON submission
FOR EACH ROW EXECUTE PROCEDURE before_init_submission();

CREATE TRIGGER update_submission_status AFTER UPDATE ON submission_status
FOR EACH ROW EXECUTE PROCEDURE check_workflow_state();
