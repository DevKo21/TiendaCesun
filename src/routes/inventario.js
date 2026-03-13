const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');

// Consultar inventario
router.get('/',      InventarioController.getAll);
router.get('/:id',   InventarioController.getById);

// Actualizar stock
router.put('/:id/agregar',    InventarioController.agregarStock);
router.put('/:id/actualizar', InventarioController.actualizarStock);

module.exports = router;