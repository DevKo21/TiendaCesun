const { sql, getPool } = require('../config/database');

const VendedorModel = {

    // Obtener todos los vendedores
    async getAll() {
        const pool = await getPool();
        const result = await pool.request()
            .query('SELECT * FROM Vendedores');
        return result.recordset;
    },

    // Obtener un vendedor por ID
    async getById(id) {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Vendedores WHERE id_vendedor = @id');
        return result.recordset[0];
    },

    // Crear un vendedor
    async create(datos) {
        const { nombre, apellido, password_hash, telefono, id_rol } = datos;
        const pool = await getPool();
        const result = await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .input('password_hash', sql.NVarChar, password_hash)
            .input('telefono', sql.NVarChar, telefono)
            .input('id_rol', sql.Int, id_rol)
            .query(`INSERT INTO Vendedores (nombre, apellido, password_hash, telefono, id_rol)
                    OUTPUT INSERTED.id_vendedor
                    VALUES (@nombre, @apellido, @password_hash, @telefono, @id_rol)`);
        return result.recordset[0];
    },

    // Actualizar un vendedor
    async update(id, datos) {
        const { nombre, apellido, telefono, activo } = datos;
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .input('telefono', sql.NVarChar, telefono)
            .input('activo', sql.Bit, activo)
            .query(`UPDATE Vendedores 
                    SET nombre=@nombre, apellido=@apellido,
                    telefono=@telefono, activo=@activo
                    WHERE id_vendedor=@id`);
    },

    // Desactivar un vendedor
    async remove(id) {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE Vendedores SET activo=0 WHERE id_vendedor=@id');
    }

};

module.exports = VendedorModel;