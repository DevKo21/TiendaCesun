const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/database');

// GET - Obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT p.*, 
                    v.nombre + ' ' + v.apellido AS vendedor
                    FROM Pedidos p
                    JOIN Vendedores v ON p.id_vendedor = v.id_vendedor
                    ORDER BY p.fecha_pedido DESC`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener un pedido por ID con su detalle
router.get('/:id', async (req, res) => {
    try {
        const pool = await getPool();
        const pedido = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`SELECT p.*, 
                    v.nombre + ' ' + v.apellido AS vendedor
                    FROM Pedidos p
                    JOIN Vendedores v ON p.id_vendedor = v.id_vendedor
                    WHERE p.id_pedido = @id`);
        if (!pedido.recordset[0])
            return res.status(404).json({ error: 'Pedido no encontrado' });
        const detalles = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`SELECT dp.*, pr.nombre AS producto
                    FROM DetallePedidos dp
                    JOIN Productos pr ON dp.id_producto = pr.id_producto
                    WHERE dp.id_pedido = @id`);
        res.json({
            pedido: pedido.recordset[0],
            detalles: detalles.recordset
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear un pedido
router.post('/', async (req, res) => {
    try {
        const { id_vendedor, notas, detalles } = req.body;
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        try {
            const pedidoResult = await transaction.request()
                .input('id_vendedor', sql.Int, id_vendedor)
                .input('notas', sql.NVarChar, notas)
                .query(`INSERT INTO Pedidos (id_vendedor, notas)
                        OUTPUT INSERTED.id_pedido 
                        VALUES (@id_vendedor, @notas)`);
            const id_pedido = pedidoResult.recordset[0].id_pedido;
            let total = 0;
            for (const d of detalles) {
                await transaction.request()
                    .input('id_pedido', sql.Int, id_pedido)
                    .input('id_producto', sql.Int, d.id_producto)
                    .input('cantidad', sql.Int, d.cantidad)
                    .input('precio_unitario', sql.Decimal, d.precio_unitario)
                    .query(`INSERT INTO DetallePedidos 
                            (id_pedido, id_producto, cantidad, precio_unitario)
                            VALUES (@id_pedido, @id_producto, @cantidad, @precio_unitario)`);
                total += d.cantidad * d.precio_unitario;
            }
            await transaction.request()
                .input('id', sql.Int, id_pedido)
                .input('total', sql.Decimal, total)
                .query('UPDATE Pedidos SET total=@total WHERE id_pedido=@id');
            await transaction.commit();
            res.status(201).json({ id_pedido, total });
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar estado del pedido
router.put('/:id/estado', async (req, res) => {
    try {
        const { estado } = req.body;
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('estado', sql.NVarChar, estado)
            .query('UPDATE Pedidos SET estado=@estado WHERE id_pedido=@id');
        res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;