const { sql, getPool } = require('../config/database');

const InventarioModel = {

    // Consultar inventario de todos los productos
    async getAll() {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT p.id_producto, p.nombre, p.stock, 
                    p.precio, c.nombre AS categoria
                    FROM Productos p
                    LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                    WHERE p.activo = 1
                    ORDER BY p.stock ASC`);
        return result.recordset;
    },

    // Consultar inventario de un producto
    async getById(id) {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT p.id_producto, p.nombre, p.stock,
                    p.precio, c.nombre AS categoria
                    FROM Productos p
                    LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                    WHERE p.id_producto = @id`);
        return result.recordset[0];
    },

    // Agregar stock
    async agregarStock(id, cantidad) {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('cantidad', sql.Int, cantidad)
            .query(`UPDATE Productos 
                    SET stock = stock + @cantidad 
                    WHERE id_producto = @id`);
    },

    // Actualizar stock directo
    async actualizarStock(id, stock) {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('stock', sql.Int, stock)
            .query(`UPDATE Productos 
                    SET stock = @stock 
                    WHERE id_producto = @id`);
    }

};

module.exports = InventarioModel;