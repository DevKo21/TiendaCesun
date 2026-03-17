require('dotenv').config();
const { sql, getPool } = require('../config/database');
const encryption = require('../config/encryption');

async function cifrarPasswords() {
    try {
        const pool = await getPool();
        
        // Obtener todos los vendedores
        const result = await pool.request()
            .query('SELECT id_vendedor, password_hash, telefono FROM Vendedores');

        for (const vendedor of result.recordset) {
            const passwordCifrado = encryption.encrypt(vendedor.password_hash);
            const telefonoCifrado = vendedor.telefono ? 
                encryption.encrypt(vendedor.telefono) : vendedor.telefono;

            await pool.request()
                .input('id', sql.Int, vendedor.id_vendedor)
                .input('password', sql.NVarChar, passwordCifrado)
                .input('telefono', sql.NVarChar, telefonoCifrado)
                .query(`UPDATE Vendedores 
                        SET password_hash = @password, telefono = @telefono 
                        WHERE id_vendedor = @id`);

            console.log(`✅ Vendedor ${vendedor.id_vendedor} cifrado correctamente`);
        }

        console.log('✅ Todos los passwords cifrados correctamente');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

cifrarPasswords();