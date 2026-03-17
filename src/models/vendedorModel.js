const Vendedor = require('./Vendedor');
const encryption = require('../config/encryption');

const VendedorModel = {

    // Obtener todos los vendedores
    async getAll() {
        const vendedores = await Vendedor.findAll();
        return vendedores.map(v => {
            const data = v.toJSON();
            if (data.telefono) data.telefono = encryption.decrypt(data.telefono);
            delete data.password_hash;
            return data;
        });
    },

    // Obtener un vendedor por ID
    async getById(id) {
        const vendedor = await Vendedor.findByPk(id);
        if (!vendedor) return null;
        const data = vendedor.toJSON();
        if (data.telefono) data.telefono = encryption.decrypt(data.telefono);
        delete data.password_hash;
        return data;
    },

    // Crear un vendedor
    async create(datos) {
        const datosCI = { ...datos };
        if (datosCI.password_hash) 
            datosCI.password_hash = encryption.encrypt(datosCI.password_hash);
        if (datosCI.telefono) 
            datosCI.telefono = encryption.encrypt(datosCI.telefono);
        return await Vendedor.create(datosCI);
    },

    // Actualizar un vendedor
    async update(id, datos) {
        const datosCI = { ...datos };
        if (datosCI.telefono) 
            datosCI.telefono = encryption.encrypt(datosCI.telefono);
        await Vendedor.update(datosCI, {
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