const sql = require('mssql');
require('dotenv').config();

const config = {
    server: 'localhost',
    port: 56675,
    database: 'TiendaCesunDB',
    user: 'tiendauser',
    password: 'Tienda123!',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

let pool = null;

async function getPool() {
    if (!pool) {
        pool = await sql.connect(config);
        console.log('✅ Conectado a SQL Server');
    }
    return pool;
}

module.exports = { sql, getPool };