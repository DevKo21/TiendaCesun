const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const VendedoresController = require('../controllers/vendedoresController');

// Validación para crear
const validarCrear = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('password_hash')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
    body('id_rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isInt().withMessage('El rol debe ser un número entero'),
];

// Validación para actualizar
const validarActualizar = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
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
router.post('/',      validarCrear, verificarErrores, VendedoresController.create);
router.put('/:id',    validarActualizar, verificarErrores, VendedoresController.update);
router.delete('/:id', VendedoresController.remove);

module.exports = router;