const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mssql',
    host: 'localhost',
    port: 56675,
    database: 'TiendaCesunDB',
    username: 'tiendauser',
    password: 'Tienda123!',
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true,
        }
    },
    logging: false
});

// Verificar conexión
sequelize.authenticate()
    .then(() => console.log('✅ Sequelize conectado a SQL Server'))
    .catch(err => console.error('❌ Error Sequelize:', err));

module.exports = sequelize;