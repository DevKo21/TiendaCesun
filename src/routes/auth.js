const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const AuthController = require('../controllers/authController');

const validarLogin = [
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
];

const verificarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

router.post('/login', validarLogin, verificarErrores, AuthController.login);

module.exports = router;