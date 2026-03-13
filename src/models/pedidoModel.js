const { sql, getPool } = require('../config/database');

const PedidoModel = {

    // Obtener todos los pedidos
    async getAll() {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT p.*, v.nombre + ' ' + v.apellido AS vendedor
                    FROM Pedidos p
                    LEFT JOIN Vendedores v ON p.id_vendedor = v.id_vendedor
                    ORDER BY p.fecha_pedido DESC`);
        return result.recordset;
    },

    // Obtener un pedido por ID con detalles
    async getById(id) {
        const pool = await getPool();

        const pedido = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT p.*, v.nombre + ' ' + v.apellido AS vendedor
                    FROM Pedidos p
                    LEFT JOIN Vendedores v ON p.id_vendedor = v.id_vendedor
                    WHERE p.id_pedido = @id`);

        const detalles = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT d.*, pr.nombre AS producto
                    FROM DetallePedidos d
                    LEFT JOIN Productos pr ON d.id_producto = pr.id_producto
                    WHERE d.id_pedido = @id`);

        if (!pedido.recordset[0]) return null;

        return {
            ...pedido.recordset[0],
            detalles: detalles.recordset
        };
    },

    // Crear pedido con transacción
    async create(datos) {
        const { id_vendedor, notas, productos } = datos;
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            // Calcular total
            let total = 0;
            for (const item of productos) {
                total += item.cantidad * item.precio_unitario;
            }

            // Insertar pedido
            const pedidoResult = await transaction.request()
                .input('id_vendedor', sql.Int, id_vendedor)
                .input('total', sql.Decimal, total)
                .input('notas', sql.NVarChar, notas || '')
                .query(`INSERT INTO Pedidos (id_vendedor, total, notas)
                        OUTPUT INSERTED.id_pedido
                        VALUES (@id_vendedor, @total, @notas)`);

            const id_pedido = pedidoResult.recordset[0].id_pedido;

            // Insertar detalles y actualizar stock
            for (const item of productos) {
                // Verificar stock disponible
                const stockResult = await transaction.request()
                    .input('id_producto', sql.Int, item.id_producto)
                    .query('SELECT stock FROM Productos WHERE id_producto = @id_producto');

                const stockActual = stockResult.recordset[0]?.stock;

                if (stockActual < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ${item.id_producto}`);
                }

                // Insertar detalle
                await transaction.request()
                    .input('id_pedido', sql.Int, id_pedido)
                    .input('id_producto', sql.Int, item.id_producto)
                    .input('cantidad', sql.Int, item.cantidad)
                    .input('precio_unitario', sql.Decimal, item.precio_unitario)
                    .query(`INSERT INTO DetallePedidos (id_pedido, id_producto, cantidad, precio_unitario)
                            VALUES (@id_pedido, @id_producto, @cantidad, @precio_unitario)`);

                // Reducir stock
                await transaction.request()
                    .input('id_producto', sql.Int, item.id_producto)
                    .input('cantidad', sql.Int, item.cantidad)
                    .query(`UPDATE Productos 
                            SET stock = stock - @cantidad 
                            WHERE id_producto = @id_producto`);
            }

            await transaction.commit();
            return { id_pedido, total };

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    // Actualizar estado del pedido
    async updateEstado(id, estado) {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado', sql.NVarChar, estado)
            .query('UPDATE Pedidos SET estado = @estado WHERE id_pedido = @id');
    }

};

module.exports = PedidoModel;