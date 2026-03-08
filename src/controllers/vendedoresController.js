const VendedorModel = require('../models/vendedorModel');

const VendedoresController = {

    // GET - Obtener todos los vendedores
    async getAll(req, res) {
        try {
            const vendedores = await VendedorModel.getAll();
            res.json(vendedores);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET - Obtener un vendedor por ID
    async getById(req, res) {
        try {
            const vendedor = await VendedorModel.getById(req.params.id);
            if (!vendedor)
                return res.status(404).json({ error: 'Vendedor no encontrado' });
            res.json(vendedor);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST - Crear un vendedor
    async create(req, res) {
        try {
            const nuevo = await VendedorModel.create(req.body);
            res.status(201).json({ 
                mensaje: 'Vendedor creado correctamente',
                id_vendedor: nuevo.id_vendedor 
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // PUT - Actualizar un vendedor
    async update(req, res) {
        try {
            await VendedorModel.update(req.params.id, req.body);
            res.json({ mensaje: 'Vendedor actualizado correctamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // DELETE - Desactivar un vendedor
    async remove(req, res) {
        try {
            await VendedorModel.remove(req.params.id);
            res.json({ mensaje: 'Vendedor desactivado correctamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};

module.exports = VendedoresController;