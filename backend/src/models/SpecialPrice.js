/**
 * Modelo de Precios Especiales
 * Colección: preciosEspecialesGarcia25
 * 
 * Esta colección almacena precios especiales para usuarios específicos,
 * optimizada para consultas rápidas y relaciones eficientes con productos.
 */

const mongoose = require('mongoose');

const specialPriceSchema = new mongoose.Schema({
  // Información del usuario con precio especial
  usuario: {
    // ID único del usuario
    userId: {
      type: String,
      required: true,
      trim: true
    },
    // Nombre del usuario
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    // Email del usuario
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    // Tipo de cliente (VIP, Premium, Corporativo, etc.)
    tipoCliente: {
      type: String,
      enum: ['VIP', 'Premium', 'Corporativo', 'Mayorista', 'Empleado'],
      default: 'Premium'
    }
  },
  
  // Información del producto con precio especial
  producto: {
    // ID del producto (referencia a la colección productos)
    productId: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    // Nombre del producto (denormalizado para consultas rápidas)
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    // Precio original del producto
    precioOriginal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  
  // Configuración del precio especial
  precioEspecial: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v <= this.producto.precioOriginal;
      },
      message: 'El precio especial no puede ser mayor al precio original'
    }
  },
  
  // Porcentaje de descuento calculado automáticamente
  porcentajeDescuento: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Vigencia del precio especial
  vigencia: {
    fechaInicio: {
      type: Date,
      required: true,
      default: Date.now
    },
    fechaFin: {
      type: Date,
      required: true
    }
  },
  
  // Estado del precio especial
  activo: {
    type: Boolean,
    default: true
  },
  
  // Motivo del precio especial
  motivo: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Usuario que creó este precio especial
  creadoPor: {
    type: String,
    trim: true,
    default: 'Sistema'
  }
}, {
  timestamps: true,
  collection: 'preciosEspecialesGarcia25'
});

// Middleware pre-save para calcular el porcentaje de descuento
specialPriceSchema.pre('save', function(next) {
  if (this.producto.precioOriginal && this.precioEspecial) {
    this.porcentajeDescuento = Math.round(
      ((this.producto.precioOriginal - this.precioEspecial) / this.producto.precioOriginal) * 100
    );
  }
  next();
});

// Índices para optimizar consultas
specialPriceSchema.index({ 'usuario.userId': 1, 'producto.productId': 1 }, { unique: true });
specialPriceSchema.index({ 'producto.productId': 1 });
specialPriceSchema.index({ 'usuario.userId': 1 });
specialPriceSchema.index({ 'usuario.email': 1 });
specialPriceSchema.index({ activo: 1 });
specialPriceSchema.index({ 'vigencia.fechaInicio': 1, 'vigencia.fechaFin': 1 });

// Método virtual para verificar si el precio especial está vigente
specialPriceSchema.virtual('esVigente').get(function() {
  const ahora = new Date();
  return this.activo && 
         ahora >= this.vigencia.fechaInicio && 
         ahora <= this.vigencia.fechaFin;
});

// Método estático para encontrar precio especial por usuario y producto
specialPriceSchema.statics.encontrarPrecioEspecial = function(userId, productId) {
  const ahora = new Date();
  return this.findOne({
    'usuario.userId': userId,
    'producto.productId': productId,
    activo: true,
    'vigencia.fechaInicio': { $lte: ahora },
    'vigencia.fechaFin': { $gte: ahora }
  });
};

// Método estático para obtener todos los precios especiales de un usuario
specialPriceSchema.statics.obtenerPreciosUsuario = function(userId) {
  const ahora = new Date();
  return this.find({
    'usuario.userId': userId,
    activo: true,
    'vigencia.fechaInicio': { $lte: ahora },
    'vigencia.fechaFin': { $gte: ahora }
  }).sort({ 'producto.nombre': 1 });
};

// Método estático para obtener usuarios con precios especiales para un producto
specialPriceSchema.statics.obtenerUsuariosConPrecioEspecial = function(productId) {
  const ahora = new Date();
  return this.find({
    'producto.productId': productId,
    activo: true,
    'vigencia.fechaInicio': { $lte: ahora },
    'vigencia.fechaFin': { $gte: ahora }
  }).select('usuario precioEspecial porcentajeDescuento');
};

// Método para validar vigencia
specialPriceSchema.methods.validarVigencia = function() {
  const ahora = new Date();
  return this.activo && 
         ahora >= this.vigencia.fechaInicio && 
         ahora <= this.vigencia.fechaFin;
};

// Transformación JSON para el cliente
specialPriceSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    ret.esVigente = doc.esVigente;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('PrecioEspecial', specialPriceSchema);
