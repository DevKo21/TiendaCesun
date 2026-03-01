const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/database');

// GET - Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT p.*, c.nombre AS categoria 
                    FROM Productos p 
                    LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                    WHERE p.activo = 1`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`SELECT p.*, c.nombre AS categoria 
                    FROM Productos p 
                    LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                    WHERE p.id_producto = @id`);
        if (!result.recordset[0])
            return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear un producto
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, id_categoria } = req.body;
        const pool = await getPool();
        const result = await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('precio', sql.Decimal, precio)
            .input('stock', sql.Int, stock)
            .input('id_categoria', sql.Int, id_categoria)
            .query(`INSERT INTO Productos (nombre, descripcion, precio, stock, id_categoria)
                    OUTPUT INSERTED.id_producto
                    VALUES (@nombre, @descripcion, @precio, @stock, @id_categoria)`);
        res.status(201).json({ id_producto: result.recordset[0].id_producto });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, activo } = req.body;
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('nombre', sql.NVarChar, nombre)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('precio', sql.Decimal, precio)
            .input('stock', sql.Int, stock)
            .input('activo', sql.Bit, activo)
            .query(`UPDATE Productos 
                    SET nombre=@nombre, descripcion=@descripcion, 
                    precio=@precio, stock=@stock, activo=@activo 
                    WHERE id_producto=@id`);
        res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('UPDATE Productos SET activo=0 WHERE id_producto=@id');
        res.json({ mensaje: 'Producto desactivado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;