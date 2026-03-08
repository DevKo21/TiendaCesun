const express = require('express');
const router = express.Router();
const VendedoresController = require('../controllers/vendedoresController');

router.get('/',     VendedoresController.getAll);
router.get('/:id',  VendedoresController.getById);
router.post('/',    VendedoresController.create);
router.put('/:id',  VendedoresController.update);
router.delete('/:id', VendedoresController.remove);

module.exports = router;