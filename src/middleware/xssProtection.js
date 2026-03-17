const sanitizeHtml = require('sanitize-html');

// Función para limpiar un valor
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return sanitizeHtml(value, {
            allowedTags: [],        // No permitir ningún tag HTML
            allowedAttributes: {}   // No permitir ningún atributo
        });
    }
    return value;
};

// Función recursiva para limpiar objetos
const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return sanitizeValue(obj);
    
    const sanitized = {};
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object') {
            sanitized[key] = sanitizeObject(obj[key]);
        } else {
            sanitized[key] = sanitizeValue(obj[key]);
        }
    }
    return sanitized;
};

// Middleware XSS
const xssProtection = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    next();
};

module.exports = xssProtection;