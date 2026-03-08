const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ProductosController = require('../controllers/productosController');

// Reglas de validación
const validarProducto = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 150 }).withMessage('El nombre no puede tener más de 150 caracteres'),
    body('precio')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor a 0'),
    body('stock')
        .notEmpty().withMessage('El stock es obligatorio')
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
    body('id_categoria')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isInt().withMessage('La categoría debe ser un número entero'),
    body('descripcion')
        .optional()
        .isLength({ max: 500 }).withMessage('La descripción no puede tener más de 500 caracteres'),
];

// Middleware para verificar errores
const verificarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

router.get('/',       ProductosController.getAll);
router.get('/:id',    ProductosController.getById);
router.post('/',      validarProducto, verificarErrores, ProductosController.create);
router.put('/:id',    validarProducto, verificarErrores, ProductosController.update);
router.delete('/:id', ProductosController.remove);

module.exports = router;