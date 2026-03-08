const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const VendedoresController = require('../controllers/vendedoresController');

// Reglas de validación
const validarVendedor = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no puede tener más de 100 caracteres'),
    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ max: 100 }).withMessage('El apellido no puede tener más de 100 caracteres'),
    body('password_hash')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
    body('telefono')
        .optional()
        .isLength({ max: 20 }).withMessage('El teléfono no puede tener más de 20 caracteres'),
    body('id_rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isInt().withMessage('El rol debe ser un número entero'),
];

// Middleware para verificar errores
const verificarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

router.get('/',       VendedoresController.getAll);
router.get('/:id',    VendedoresController.getById);
router.post('/',      validarVendedor, verificarErrores, VendedoresController.create);
router.put('/:id',    validarVendedor, verificarErrores, VendedoresController.update);
router.delete('/:id', VendedoresController.remove);

module.exports = router;