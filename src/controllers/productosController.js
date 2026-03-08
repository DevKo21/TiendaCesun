const ProductoModel = require('../models/productoModel');

const ProductosController = {

    // GET - Obtener todos los productos
    async getAll(req, res) {
        try {
            const productos = await ProductoModel.getAll();
            res.json(productos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET - Obtener un producto por ID
    async getById(req, res) {
        try {
            const producto = await ProductoModel.getById(req.params.id);
            if (!producto)
                return res.status(404).json({ error: 'Producto no encontrado' });
            res.json(producto);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST - Crear un producto
    async create(req, res) {
        try {
            const nuevo = await ProductoModel.create(req.body);
            res.status(201).json({ 
                mensaje: 'Producto creado correctamente',
                id_producto: nuevo.id_producto 
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // PUT - Actualizar un producto
    async update(req, res) {
        try {
            await ProductoModel.update(req.params.id, req.body);
            res.json({ mensaje: 'Producto actualizado correctamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // DELETE - Desactivar un producto
    async remove(req, res) {
        try {
            await ProductoModel.remove(req.params.id);
            res.json({ mensaje: 'Producto desactivado correctamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};

module.exports = ProductosController;