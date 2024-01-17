const { Pool } = require('pg');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase = process.env.DB_DATABASE;
const dbPort = process.env.DB_PORT;

async function handler(){

    const config = {
        user: dbUser,
        host: dbHost,
        database: dbDatabase,
        password: dbPassword,
        port: dbPort
    };

    const pool = new Pool(config);
    let dbResp;

    const command = `
    INSERT INTO question(id, short_name, version, long_name, text, help, required, daac_ids) VALUES ('d3c4f81e-1954-4b6f-9edf-90f240f525a8', 'acknowledgement', 1, 'Additional Acknowledgments', 'If there are people or groups who are not identified in the Data Citation but whose contributions to the data product should be acknowledged, please name them here.', 'The DAAC will work with you to add this information to an Acknowledgements section of the data product user guide.', False, '{"aec3724f-b30b-4b3f-9b9a-e0907d9d14b3"}');
    INSERT INTO section_question VALUES ('768a6b51-4864-458c-b20d-fb8b4c7dc606', 'd3c4f81e-1954-4b6f-9edf-90f240f525a8', 4, '[]', '[]');
    UPDATE section_question set list_order=5 where question_id = '2dd6c8b1-22a8-4866-91c3-da9b4ce849dc' and section_id='768a6b51-4864-458c-b20d-fb8b4c7dc606';
    INSERT INTO input VALUES ('d3c4f81e-1954-4b6f-9edf-90f240f525a8', 'acknowledgement', 0, 'Acknowledgement', 'text', '{}', '{}', '[]', '[]');

    INSERT INTO edprole_privilege VALUES ('2aa89c57-85f1-4611-812d-b6760bb6295c', 'REQUEST_INITIALIZE');
    `;

    try{
        dbResp = await pool.query(command)
        console.log(dbResp);
    } catch (err) {
        console.error(err);
        return{};
    } finally {
        pool.end();
    }
    return {
        statusCode: 200,
        body: JSON.stringify('Update successful')
    }
    
}

module.exports.handler = handler;