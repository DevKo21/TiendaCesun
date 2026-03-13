const PedidoModel = require('../models/pedidoModel');

const PedidosController = {

    // GET - Obtener todos los pedidos
    async getAll(req, res) {
        try {
            const pedidos = await PedidoModel.getAll();
            res.json(pedidos);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET - Obtener un pedido por ID
    async getById(req, res) {
        try {
            const pedido = await PedidoModel.getById(req.params.id);
            if (!pedido)
                return res.status(404).json({ error: 'Pedido no encontrado' });
            res.json(pedido);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // POST - Crear un pedido con transacción
    async create(req, res) {
        try {
            const { id_vendedor, notas, productos } = req.body;

            // Validar que vengan productos
            if (!productos || productos.length === 0)
                return res.status(400).json({ error: 'El pedido debe tener al menos un producto' });

            // Validar que cada producto tenga los campos necesarios
            for (const item of productos) {
                if (!item.id_producto || !item.cantidad || !item.precio_unitario)
                    return res.status(400).json({ 
                        error: 'Cada producto debe tener id_producto, cantidad y precio_unitario' 
                    });
            }

            const resultado = await PedidoModel.create(req.body);
            res.status(201).json({
                mensaje: 'Pedido creado correctamente',
                id_pedido: resultado.id_pedido,
                total: resultado.total
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // PUT - Actualizar estado del pedido
    async updateEstado(req, res) {
        try {
            const { estado } = req.body;
            const estadosValidos = ['pendiente', 'procesando', 'completado', 'cancelado'];

            if (!estado || !estadosValidos.includes(estado))
                return res.status(400).json({ 
                    error: `Estado inválido. Use: ${estadosValidos.join(', ')}` 
                });

            await PedidoModel.updateEstado(req.params.id, estado);
            res.json({ mensaje: 'Estado del pedido actualizado correctamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};

module.exports = PedidosController;