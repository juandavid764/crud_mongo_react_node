# Sistema de Gestión de Productos con Precios Especiales

**Prueba Técnica - React + MongoDB**

Este proyecto implementa un sistema completo de gestión de productos con precios especiales usando React como frontend y una API Node.js que interactúa con MongoDB.

## 📋 Introducción

El sistema permite:
- **Visualizar productos** con precios normales y especiales según el usuario
- **Gestionar precios especiales** para usuarios específicos en la colección personalizada `preciosEspecialesGarcia25`
- **Navegación fluida** entre las dos funcionalidades principales: Artículos y Subida

### Características Principales

- ✅ **Frontend React** moderno con Tailwind CSS
- ✅ **API RESTful** robusta con Node.js y Express
- ✅ **Base de datos MongoDB** optimizada con índices
- ✅ **Navegación SPA** con React Router
- ✅ **Validación completa** en frontend y backend
- ✅ **Diseño responsive** y accesible
- ✅ **Manejo de errores** centralizado
- ✅ **Componentes reutilizables** y documentados

## 🚀 Pasos para Ejecutar Localmente

### Prerrequisitos

- **Node.js** versión 14 o superior
- **npm** o **yarn**
- **Conexión a internet** (para MongoDB Atlas)

### 1. Clonar e Instalar Dependencias

```bash
# Navegar al directorio del proyecto
cd "crud_mongo_react_node"

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 2. Configurar Variables de Entorno

El backend ya incluye la configuración necesaria en el archivo `.env` con:
- URL de conexión a MongoDB Atlas
- Puerto del servidor (5000)
- Configuración de CORS

### 3. Iniciar el Backend

```bash
# Desde el directorio backend
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### 4. Iniciar el Frontend

```bash
# Desde el directorio frontend (nueva terminal)
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Verificar Funcionamiento

- **Backend**: Visita `http://localhost:5000/api/health`
- **Frontend**: Visita `http://localhost:5173`

## 🏗️ Justificación de Elecciones Técnicas

### Frontend: React + Vite

**¿Por qué React?**
- **Ecosistema maduro**: Amplia comunidad y documentación
- **Componentes reutilizables**: Facilita mantenimiento y escalabilidad
- **Hooks modernos**: useState, useEffect para gestión de estado local
- **Performance**: Virtual DOM para renderizado eficiente

**¿Por qué Vite?**
- **Desarrollo rápido**: HMR (Hot Module Replacement) instantáneo
- **Build optimizado**: Bundling eficiente para producción
- **Configuración mínima**: Setup más simple que webpack

### Estilos: Tailwind CSS

**Ventajas elegidas:**
- **Desarrollo rápido**: Classes utilitarias predefinidas
- **Consistencia**: Sistema de diseño unificado
- **Responsive**: Grid y flexbox responsivos incluidos
- **Optimización**: Purge automático de CSS no utilizado

### Gestión de Estado: useState Local

**Justificación:**
- **Simplicidad**: La aplicación no requiere estado global complejo
- **Performance**: Evita re-renderizados innecesarios
- **Mantenibilidad**: Fácil de entender y debuggear

### Comunicación API: Axios

**¿Por qué Axios sobre fetch?**
- **Interceptors**: Manejo centralizado de errores
- **Request/Response transformation**: Procesamiento automático de JSON
- **Timeout y cancelación**: Control de requests
- **Mejor sintaxis**: Más legible que fetch nativo

### Navegación: React Router DOM

**Beneficios:**
- **SPA nativa**: Navegación sin recargas de página
- **Routes declarativas**: Configuración clara y mantenible
- **History API**: URLs amigables y navegación back/forward

## 📁 Descripción de la Estructura del Proyecto

```
crud_mongo_react_node/
├── frontend/                          # Aplicación React
│   ├── src/
│   │   ├── components/                # Componentes reutilizables
│   │   │   ├── Navigation.jsx         # Menú de navegación
│   │   │   ├── LoadingSpinner.jsx     # Indicador de carga
│   │   │   ├── ErrorMessage.jsx       # Componente de errores
│   │   │   └── SuccessMessage.jsx     # Componente de éxito
│   │   ├── pages/                     # Páginas principales
│   │   │   ├── Articulos.jsx          # Tabla de productos
│   │   │   └── Subida.jsx             # Formulario de precios especiales
│   │   ├── services/                  # Servicios de API
│   │   │   └── api.js                 # Configuración y métodos de API
│   │   ├── utils/                     # Utilidades y helpers
│   │   │   └── helpers.js             # Funciones de formateo y validación
│   │   ├── App.jsx                    # Componente principal con routing
│   │   ├── main.jsx                   # Punto de entrada de React
│   │   └── index.css                  # Estilos con Tailwind
│   ├── package.json                   # Dependencias del frontend
│   └── vite.config.js                 # Configuración de Vite
├── backend/                           # API Node.js
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js            # Conexión a MongoDB
│   │   ├── controllers/               # Lógica de negocio
│   │   │   ├── productController.js   # CRUD de productos
│   │   │   └── specialPriceController.js # CRUD de precios especiales
│   │   ├── middleware/                # Middleware personalizado
│   │   │   ├── errorHandler.js        # Manejo de errores
│   │   │   └── validation.js          # Validaciones
│   │   ├── models/                    # Modelos de MongoDB
│   │   │   ├── Product.js             # Esquema de productos
│   │   │   └── SpecialPrice.js        # Esquema de precios especiales
│   │   ├── routes/                    # Definición de rutas
│   │   │   ├── productRoutes.js       # Endpoints de productos
│   │   │   └── specialPriceRoutes.js  # Endpoints de precios especiales
│   │   └── server.js                  # Servidor principal
│   └── package.json                   # Dependencias del backend
└── README.md                          # Documentación (este archivo)
```

### Arquitectura del Frontend

#### 📄 **Páginas (Pages)**
- **Articulos.jsx**: Tabla interactiva de productos con:
  - Búsqueda en tiempo real
  - Filtros por categoría
  - Aplicación automática de precios especiales
  - Paginación
  - Indicadores visuales de descuentos

- **Subida.jsx**: Formulario completo para crear precios especiales:
  - Validación en tiempo real
  - Búsqueda de productos por ID o nombre
  - Autocompletado de productos
  - Cálculo automático de descuentos
  - Validación de fechas de vigencia

#### 🧩 **Componentes (Components)**
- **Navigation.jsx**: Menú principal responsive con estados activos
- **LoadingSpinner.jsx**: Indicador de carga reutilizable
- **ErrorMessage.jsx**: Manejo consistente de errores
- **SuccessMessage.jsx**: Feedback positivo para operaciones exitosas

#### 🔧 **Servicios (Services)**
- **api.js**: Configuración centralizada de Axios con:
  - Interceptors para manejo de errores
  - Timeout configurado
  - Métodos específicos para cada endpoint
  - Transformación automática de respuestas

#### 🛠️ **Utilidades (Utils)**
- **helpers.js**: Funciones auxiliares para:
  - Formateo de precios en COP
  - Formateo de fechas
  - Validaciones (email, fechas)
  - Cálculos de descuentos
  - Debounce para búsquedas

### Flujo de Datos

```
Usuario → Componente → Service → API Backend → MongoDB
                ↓
Usuario ← Componente ← Response ← API Backend ← MongoDB
```

### Colección MongoDB Personalizada

**Nombre**: `preciosEspecialesGarcia25`

**Estructura optimizada**:
```javascript
{
  usuario: {
    userId: String,           // ID único del usuario
    nombre: String,           // Nombre completo
    email: String,            // Email validado
    tipoCliente: Enum         // VIP, Premium, Corporativo, etc.
  },
  producto: {
    productId: Mixed,         // Referencia al producto
    nombre: String,           // Denormalizado para consultas rápidas
    precioOriginal: Number    // Precio base del producto
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

**Índices optimizados**:
- `{ "usuario.userId": 1, "producto.productId": 1 }` (único)
- `{ "producto.productId": 1 }`
- `{ "usuario.userId": 1 }`
- `{ "vigencia.fechaInicio": 1, "vigencia.fechaFin": 1 }`

## 🎯 Funcionalidades Implementadas

### 📦 Página Artículos
- [x] Tabla responsive de productos
- [x] Búsqueda en tiempo real con debounce
- [x] Filtros por categoría
- [x] Aplicación automática de precios especiales
- [x] Indicadores visuales de descuentos
- [x] Paginación funcional
- [x] Estados de carga y error
- [x] Campo para ID de usuario

### 📤 Página Subida
- [x] Formulario completo de precios especiales
- [x] Validación en tiempo real
- [x] Búsqueda de productos por ID
- [x] Autocompletado de productos por nombre
- [x] Cálculo automático de descuentos
- [x] Validación de fechas de vigencia
- [x] Tipos de cliente predefinidos
- [x] Mensajes de éxito y error

### 🔄 Funcionalidades Transversales
- [x] Navegación SPA fluida
- [x] Manejo centralizado de errores
- [x] Estados de carga consistentes
- [x] Diseño responsive
- [x] Formateo de precios en COP
- [x] Validaciones robustas

## 🧪 Testing y Uso

### Probar la Aplicación

1. **Navegar a Artículos**:
   - Observar tabla de productos
   - Usar búsqueda: "laptop"
   - Filtrar por categoría
   - Ingresar un ID de usuario: "user123"

2. **Crear Precio Especial**:
   - Ir a "Subida"
   - Llenar formulario con datos de prueba
   - Observar validaciones en tiempo real
   - Crear el precio especial

3. **Verificar Precio Especial**:
   - Volver a "Artículos"
   - Ingresar el mismo ID de usuario
   - Ver el precio especial aplicado

### Datos de Prueba Sugeridos

```json
{
  "usuario": {
    "userId": "user123",
    "nombre": "Juan García",
    "email": "juan@email.com",
    "tipoCliente": "VIP"
  },
  "precioEspecial": 150000,
  "vigencia": {
    "fechaFin": "2025-12-31"
  },
  "motivo": "Cliente VIP - Descuento especial"
}
```

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev      # Iniciar en modo desarrollo
npm run build    # Build para producción
npm run preview  # Vista previa del build
npm run lint     # Ejecutar linter
```

### Backend
```bash
npm start        # Iniciar en modo producción
npm run dev      # Iniciar con nodemon (desarrollo)
```
