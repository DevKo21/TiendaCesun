const InventarioModel = require('../models/inventarioModel');

const InventarioController = {

    // GET - Consultar todo el inventario
    async getAll(req, res) {
        try {
            const inventario = await InventarioModel.getAll();
            res.json(inventario);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET - Consultar inventario de un producto
    async getById(req, res) {
        try {
            const producto = await InventarioModel.getById(req.params.id);
            if (!producto)
                return res.status(404).json({ error: 'Producto no encontrado' });
            res.json(producto);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // PUT - Agregar stock a un producto
    async agregarStock(req, res) {
        try {
            const { cantidad } = req.body;
            if (!cantidad || cantidad <= 0)
                return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });

            await InventarioModel.agregarStock(req.params.id, cantidad);
            const actualizado = await InventarioModel.getById(req.params.id);
            res.json({
                mensaje: 'Stock agregado correctamente',
                producto: actualizado
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // PUT - Actualizar stock de un producto
    async actualizarStock(req, res) {
        try {
            const { stock } = req.body;
            if (stock === undefined || stock < 0)
                return res.status(400).json({ error: 'El stock debe ser mayor o igual a 0' });

            await InventarioModel.actualizarStock(req.params.id, stock);
            const actualizado = await InventarioModel.getById(req.params.id);
            res.json({
                mensaje: 'Stock actualizado correctamente',
                producto: actualizado
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};

module.exports = InventarioController;