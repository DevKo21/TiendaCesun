const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/database');

// GET - Obtener todos los vendedores
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query('SELECT * FROM Vendedores');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener un vendedor por ID
router.get('/:id', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Vendedores WHERE id_vendedor = @id');
        if (!result.recordset[0])
            return res.status(404).json({ error: 'Vendedor no encontrado' });
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear un vendedor
router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, password_hash, telefono, id_rol } = req.body;
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
        res.status(201).json({ id_vendedor: result.recordset[0].id_vendedor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar un vendedor
router.put('/:id', async (req, res) => {
    try {
        const { nombre, apellido, telefono, activo } = req.body;
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellido', sql.NVarChar, apellido)
            .input('telefono', sql.NVarChar, telefono)
            .input('activo', sql.Bit, activo)
            .query(`UPDATE Vendedores 
                    SET nombre=@nombre, apellido=@apellido, 
                    telefono=@telefono, activo=@activo 
                    WHERE id_vendedor=@id`);
        res.json({ mensaje: 'Vendedor actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar un vendedor
router.delete('/:id', async (req, res) => {
    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('UPDATE Vendedores SET activo=0 WHERE id_vendedor=@id');
        res.json({ mensaje: 'Vendedor desactivado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;