# TiendaCesun — Sistema de Gestión de Ventas

API REST para la gestión de vendedores, productos, inventario y pedidos. Desarrollada con Node.js, Express y SQL Server Express.

---

## Stack Tecnológico

- **Runtime:** Node.js v22.14.0
- **Framework:** Express 4
- **Base de Datos:** Microsoft SQL Server Express
- **ORM:** Sequelize
- **Autenticación:** JSON Web Tokens (JWT)
- **Cifrado:** AES (crypto-js)
- **Validación:** express-validator
- **Seguridad:** Helmet, CORS, sanitize-html

---

## Requisitos Previos

- Node.js v18 o superior
- SQL Server Express instalado y en ejecución
- TCP/IP habilitado en SQL Server Configuration Manager
- Autenticación mixta habilitada en SQL Server

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DevKo21/TiendaCesun.git
cd TiendaCesun

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar el servidor
node src/app.js
```

---

## Variables de Entorno (.env)

```env
DB_USER=tiendauser
DB_PASSWORD=TuPassword
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=TiendaCesunDB
PORT=3000
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=24h
AES_SECRET=tu_clave_secreta_aes
```

---

## Estructura del Proyecto

```
TiendaCesun/
├── src/
│   ├── config/
│   │   ├── database.js         # Conexión mssql con getPool()
│   │   ├── sequelize.js        # Configuración Sequelize ORM
│   │   └── encryption.js       # Funciones cifrado/descifrado AES
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vendedoresController.js
│   │   ├── productosController.js
│   │   ├── pedidosController.js
│   │   └── inventarioController.js
│   ├── models/
│   │   ├── Vendedor.js         # Modelo Sequelize
│   │   ├── Producto.js         # Modelo Sequelize
│   │   ├── vendedorModel.js    # Lógica de negocio
│   │   ├── productoModel.js    # Lógica de negocio
│   │   ├── pedidoModel.js      # Lógica de negocio
│   │   └── inventarioModel.js  # Lógica de negocio
│   ├── middleware/
│   │   └── xssProtection.js    # Middleware protección XSS
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vendedores.js
│   │   ├── productos.js
│   │   ├── pedidos.js
│   │   └── inventario.js
│   ├── scripts/
│   │   └── cifrarPasswords.js  # Script para cifrar datos existentes
│   └── app.js                  # Punto de entrada
├── .env
├── .gitignore
└── package.json
```

---

## Funcionalidades Implementadas

### 1. CRUD de Vendedores
Gestión completa de vendedores con baja lógica (campo `activo`).

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/vendedores` | Obtener todos los vendedores |
| GET | `/api/vendedores/:id` | Obtener vendedor por ID |
| POST | `/api/vendedores` | Crear nuevo vendedor |
| PUT | `/api/vendedores/:id` | Actualizar vendedor |
| DELETE | `/api/vendedores/:id` | Desactivar vendedor |

**Body para POST:**
```json
{
  "nombre": "Juan",
  "apellido": "García",
  "password_hash": "123456",
  "telefono": "664-100-1111",
  "id_rol": 2
}
```

---

### 2. CRUD de Productos
Gestión completa de productos con baja lógica y relación a categorías.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos activos |
| GET | `/api/productos/:id` | Obtener producto por ID |
| POST | `/api/productos` | Crear nuevo producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Desactivar producto |

**Body para POST:**
```json
{
  "nombre": "Audífonos Bluetooth",
  "descripcion": "Audífonos inalámbricos",
  "precio": 350,
  "stock": 20,
  "id_categoria": 1
}
```

---

### 3. Gestión de Inventario
Endpoints dedicados para consultar y actualizar el stock de productos.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/inventario` | Consultar inventario completo |
| GET | `/api/inventario/:id` | Consultar stock de un producto |
| PUT | `/api/inventario/:id/agregar` | Agregar unidades al stock |
| PUT | `/api/inventario/:id/actualizar` | Establecer stock directo |

**Body para agregar stock:**
```json
{
  "cantidad": 10
}
```

---

### 4. Pedidos con Transacciones SQL
Creación de pedidos que actualiza automáticamente el inventario usando transacciones para garantizar consistencia de datos. Si alguna operación falla, se ejecuta un rollback completo.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Obtener todos los pedidos |
| GET | `/api/pedidos/:id` | Obtener pedido con detalles |
| POST | `/api/pedidos` | Crear pedido (con transacción) |
| PUT | `/api/pedidos/:id/estado` | Actualizar estado del pedido |

**Body para crear pedido:**
```json
{
  "id_vendedor": 1,
  "notas": "Pedido urgente",
  "productos": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_unitario": 350
    }
  ]
}
```

**Estados válidos:** `pendiente`, `procesando`, `completado`, `cancelado`

---

### 5. Autenticación JWT
Sistema de login que genera tokens JWT para autenticar usuarios.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión y obtener token |

**Body para login:**
```json
{
  "email": "juan@tienda.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "vendedor": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "García",
    "email": "juan@tienda.com"
  }
}
```

---

### 6. Cifrado AES
Los datos sensibles como `password_hash` y `telefono` se almacenan cifrados en la base de datos usando AES. Las claves de cifrado se configuran en el archivo `.env`.

Para cifrar datos existentes en la base de datos ejecutar:
```bash
node src/scripts/cifrarPasswords.js
```

---

### 7. Seguridad

#### SQL Injection
Todas las consultas usan parámetros con `.input()` de mssql y Sequelize, previniendo inyección SQL.

#### Protección XSS
Middleware personalizado con `sanitize-html` que limpia automáticamente todos los inputs del request eliminando etiquetas HTML maliciosas.

#### Headers de Seguridad
`Helmet.js` agrega headers HTTP de seguridad en todas las respuestas de la API.

#### Validación de Datos
`express-validator` valida todos los campos antes de procesar las peticiones, retornando errores descriptivos con código `400 Bad Request`.

---

### 8. ORM con Sequelize
Integración de Sequelize como ORM para las operaciones CRUD, reemplazando queries SQL manuales por métodos de JavaScript como `findAll()`, `findByPk()`, `create()`, `update()`.

---

## Base de Datos

**Motor:** SQL Server Express  
**Puerto:** 56675  
**Base de Datos:** TiendaCesunDB

### Tablas
- `Roles` — Roles de los vendedores
- `Vendedores` — Usuarios del sistema
- `Categorias` — Categorías de productos
- `Productos` — Catálogo de productos
- `Pedidos` — Órdenes de compra
- `DetallePedidos` — Líneas de cada pedido

---

## Repositorio

[https://github.com/DevKo21/TiendaCesun](https://github.com/DevKo21/TiendaCesun)
