# Backend API - Sistema de Gestión de Productos

Este proyecto implementa un sistema completo de gestión de productos con precios especiales. La API permite gestionar productos y configurar precios especiales para usuarios específicos, ideal para sistemas de e-commerce con múltiples tipos de clientes.

## 🚀 Características

- **API RESTful** completa para gestión de productos y precios especiales
- **Base de datos MongoDB** con el clúster proporcionado
- **Validación robusta** de datos de entrada
- **Manejo de errores** centralizado
- **Paginación** y filtros avanzados
- **Optimización de consultas** con índices MongoDB
- **Documentación completa** de endpoints
- **Middleware de seguridad** incluido

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Acceso a internet (para conectar con MongoDB Atlas)

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

El archivo `.env` ya está configurado con:
- URL de conexión a MongoDB Atlas proporcionada
- Puerto del servidor (5000)
- Configuración de CORS

### 3. Ejecutar el proyecto

#### Modo desarrollo (con nodemon)
```bash
npm run dev
```

#### Modo producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## 📊 Estructura de la Base de Datos

### Colección: `productos` (principal)
Esta colección contiene todos los productos del sistema con su información completa.

### Colección: `preciosEspecialesGarcia25` (personalizada)
Colección desarrollada específicamente para este proyecto con la siguiente estructura optimizada:

```javascript
{
  usuario: {
    userId: String,           // ID único del usuario
    nombre: String,           // Nombre completo
    email: String,            // Email (validado)
    tipoCliente: String       // VIP, Premium, Corporativo, etc.
  },
  producto: {
    productId: Mixed,         // Referencia al producto
    nombre: String,           // Nombre del producto (denormalizado)
    precioOriginal: Number    // Precio original del producto
  },
  precioEspecial: Number,     // Precio especial asignado
  porcentajeDescuento: Number, // Calculado automáticamente
  vigencia: {
    fechaInicio: Date,        // Inicio de vigencia
    fechaFin: Date           // Fin de vigencia
  },
  activo: Boolean,           // Estado del precio especial
  motivo: String,            // Razón del precio especial
  creadoPor: String         // Usuario que lo creó
}
```

## 🔗 Endpoints de la API

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener productos con paginación y filtros |
| GET | `/api/productos/:id` | Obtener producto específico |
| GET | `/api/productos/categorias` | Obtener categorías disponibles |
| GET | `/api/productos/buscar` | Buscar productos por término |

#### Parámetros de consulta para productos:
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `categoria`: Filtrar por categoría
- `buscar`: Término de búsqueda
- `activo`: Filtrar por estado (true/false)
- `userId`: ID de usuario para aplicar precios especiales

### Precios Especiales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/precios-especiales` | Obtener precios especiales con filtros |
| POST | `/api/precios-especiales` | Crear nuevo precio especial |
| PUT | `/api/precios-especiales/:id` | Actualizar precio especial |
| DELETE | `/api/precios-especiales/:id` | Eliminar precio especial |
| GET | `/api/precios-especiales/verificar/:userId/:productId` | Verificar precio especial |
| GET | `/api/precios-especiales/usuario/:userId` | Obtener precios de un usuario |

### Utilidad

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar estado de la API |

## 💡 Justificación de Elecciones Técnicas

### Lenguaje: JavaScript (Node.js)
**Justificación**: Se eligió JavaScript para mantener consistencia en todo el stack (JavaScript tanto en frontend como backend). Esto facilita el desarrollo, el mantenimiento y reduce la curva de aprendizaje. Además, Node.js ofrece excelente rendimiento para APIs REST y tiene un ecosistema maduro para MongoDB.

### Framework: Express.js
- **Simplicidad**: Framework minimalista y flexible
- **Rendimiento**: Rápido y eficiente para APIs REST
- **Ecosistema**: Gran cantidad de middleware disponible
- **Documentación**: Ampliamente documentado y soportado

### Base de Datos: MongoDB con Mongoose
- **Compatibilidad**: Uso del clúster MongoDB Atlas proporcionado
- **Flexibilidad**: Esquema flexible para diferentes tipos de productos
- **Performance**: Índices optimizados para consultas frecuentes
- **ODM**: Mongoose proporciona validación y estructura

### Arquitectura: MVC (Modelo-Vista-Controlador)
- **Separación de responsabilidades**: Código más mantenible
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testabilidad**: Componentes aislados para testing
- **Reutilización**: Controladores y modelos reutilizables

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   ├── controllers/
│   │   ├── productController.js # Lógica de productos
│   │   └── specialPriceController.js # Lógica de precios especiales
│   ├── middleware/
│   │   ├── errorHandler.js      # Manejo centralizado de errores
│   │   └── validation.js        # Validadores y sanitización
│   ├── models/
│   │   ├── Product.js           # Modelo de productos
│   │   └── SpecialPrice.js      # Modelo de precios especiales
│   ├── routes/
│   │   ├── productRoutes.js     # Rutas de productos
│   │   └── specialPriceRoutes.js # Rutas de precios especiales
│   └── server.js                # Servidor principal
├── .env                         # Variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── package.json                # Dependencias y scripts
└── README.md                   # Documentación
```

## 🔧 Funcionalidades Clave

### 1. Gestión de Productos
- Listado con paginación y filtros
- Búsqueda por texto en nombre y descripción
- Aplicación automática de precios especiales por usuario

### 2. Gestión de Precios Especiales
- Creación con validaciones robustas
- Verificación de vigencia temporal
- Cálculo automático de porcentajes de descuento
- Prevención de duplicados por usuario/producto

### 3. Optimizaciones de Performance
- Índices de MongoDB para consultas frecuentes
- Paginación para evitar sobrecarga
- Validaciones en múltiples niveles
- Rate limiting para prevenir abuso

### 4. Seguridad
- Sanitización de entrada de datos
- Validación de tipos y formatos
- Helmet para headers de seguridad
- Rate limiting
- Manejo seguro de errores

## 🧪 Testing

Para probar la API, puedes usar herramientas como:
- **Postman**: Importar colección de endpoints
- **Thunder Client**: Extensión de VS Code
- **curl**: Línea de comandos

### Ejemplo de uso:

```bash
# Obtener productos
curl "http://localhost:5000/api/productos?page=1&limit=5"

# Crear precio especial
curl -X POST "http://localhost:5000/api/precios-especiales" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": {
      "userId": "user123",
      "nombre": "Juan García",
      "email": "juan@email.com",
      "tipoCliente": "VIP"
    },
    "producto": {
      "productId": "prod456"
    },
    "precioEspecial": 150.00,
    "vigencia": {
      "fechaFin": "2025-12-31T23:59:59.000Z"
    },
    "motivo": "Cliente VIP"
  }'
```

## 📝 Notas de Desarrollo

- El servidor incluye logging detallado en modo desarrollo
- Los errores se manejan de forma centralizada y consistente
- La API está preparada para integración con sistemas de autenticación
- El código está documentado siguiendo estándares JSDoc

## 🤝 Contribución

Este proyecto está estructurado para ser fácilmente extensible y mantenible, siguiendo las mejores prácticas de desarrollo de APIs REST.

---

**Sistema de Gestión de Productos con Precios Especiales**  
*Desarrollado con Node.js, Express y MongoDB*  
*Junio 2025*
