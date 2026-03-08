const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/productosController');

router.get('/',       ProductosController.getAll);
router.get('/:id',    ProductosController.getById);
router.post('/',      ProductosController.create);
router.put('/:id',    ProductosController.update);
router.delete('/:id', ProductosController.remove);

module.exports = router;
