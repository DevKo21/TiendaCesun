const jwt = require('jsonwebtoken');
const { sql, getPool } = require('../config/database');
const encryption = require('../config/encryption');

const AuthController = {

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar vendedor por email
            const pool = await getPool();
            const result = await pool.request()
                .input('email', sql.NVarChar, email)
                .query('SELECT * FROM Vendedores WHERE email = @email');

            const vendedor = result.recordset[0];

            // Verificar si existe el vendedor
            if (!vendedor) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Descifrar password y comparar
            const passwordDescifrado = encryption.decrypt(vendedor.password_hash);
            if (passwordDescifrado !== password) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: vendedor.id_vendedor,
                    nombre: vendedor.nombre,
                    email: vendedor.email
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json({
                mensaje: 'Login exitoso',
                token,
                vendedor: {
                    id: vendedor.id_vendedor,
                    nombre: vendedor.nombre,
                    apellido: vendedor.apellido,
                    email: vendedor.email
                }
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};

module.exports = AuthController;