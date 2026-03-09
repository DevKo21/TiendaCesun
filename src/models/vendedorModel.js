const Vendedor = require('./Vendedor');

const VendedorModel = {

    // Obtener todos los vendedores
    async getAll() {
        return await Vendedor.findAll();
    },

    // Obtener un vendedor por ID
    async getById(id) {
        return await Vendedor.findByPk(id);
    },

    // Crear un vendedor
    async create(datos) {
        return await Vendedor.create(datos);
    },

    // Actualizar un vendedor
    async update(id, datos) {
        await Vendedor.update(datos, {
            where: { id_vendedor: id }
        });
    },

    // Desactivar un vendedor
    async remove(id) {
        await Vendedor.update(
            { activo: false },
            { where: { id_vendedor: id } }
        );
    }

};

module.exports = VendedorModel;