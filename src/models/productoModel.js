const { sql, getPool } = require('../config/database');

const ProductoModel = {

    // Obtener todos los productos
    async getAll() {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT p.*, c.nombre AS categoria 
                    FROM Productos p 
                    LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                    WHERE p.activo = 1`);
        return result.recordset;
    },

    // Obtener un producto por ID
    async getById(id) {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT p.*, c.nombre AS categoria 
                    FROM Productos p 
                    LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
                    WHERE p.id_producto = @id`);
        return result.recordset[0];
    },

    // Crear un producto
    async create(datos) {
        const { nombre, descripcion, precio, stock, id_categoria } = datos;
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
        return result.recordset[0];
    },

    // Actualizar un producto
    async update(id, datos) {
        const { nombre, descripcion, precio, stock, activo } = datos;
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.NVarChar, nombre)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('precio', sql.Decimal, precio)
            .input('stock', sql.Int, stock)
            .input('activo', sql.Bit, activo)
            .query(`UPDATE Productos 
                    SET nombre=@nombre, descripcion=@descripcion,
                    precio=@precio, stock=@stock, activo=@activo
                    WHERE id_producto=@id`);
    },

    // Desactivar un producto
    async remove(id) {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE Productos SET activo=0 WHERE id_producto=@id');
    }

};

module.exports = ProductoModel;