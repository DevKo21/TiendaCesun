const Producto = require('./Producto');

const ProductoModel = {

    // Obtener todos los productos
    async getAll() {
        return await Producto.findAll({
            where: { activo: true }
        });
    },

    // Obtener un producto por ID
    async getById(id) {
        return await Producto.findByPk(id);
    },

    // Crear un producto
    async create(datos) {
        return await Producto.create(datos);
    },

    // Actualizar un producto
    async update(id, datos) {
        await Producto.update(datos, {
            where: { id_producto: id }
        });
    },

    // Desactivar un producto
    async remove(id) {
        await Producto.update(
            { activo: false },
            { where: { id_producto: id } }
        );
    }

};

module.exports = ProductoModel;