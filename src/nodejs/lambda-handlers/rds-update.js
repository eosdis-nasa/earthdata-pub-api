const { Pool } = require('pg');

const dbHost = process.env.PG_HOST;
const dbUser = process.env.PG_USER;
const dbPassword = process.env.PG_PASS;
const dbDatabase = process.env.PG_DB;
const dbPort = process.env.PG_PORT;

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
    SELECT * FROM users LIMIT 1;
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