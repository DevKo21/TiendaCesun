const express = require('express');
const router = express.Router();
const PedidosController = require('../controllers/pedidosController');

router.get('/',           PedidosController.getAll);
router.get('/:id',        PedidosController.getById);
router.post('/',          PedidosController.create);
router.put('/:id/estado', PedidosController.updateEstado);

module.exports = router;