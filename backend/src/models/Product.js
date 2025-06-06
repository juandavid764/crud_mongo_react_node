/**
 * Modelo de Producto
 * Representa la colección 'productos' en MongoDB
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Campo para el ID del producto (puede ser string o number según la estructura existente)
  productId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Nombre del producto
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  // Descripción del producto
  descripcion: {
    type: String,
    trim: true
  },
  // Precio base del producto
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  // Categoría del producto
  categoria: {
    type: String,
    trim: true
  },
  // Stock disponible
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  // URL de imagen del producto
  imagen: {
    type: String,
    trim: true
  },
  // Estado del producto (activo/inactivo)
  activo: {
    type: Boolean,
    default: true
  },
  // Código SKU del producto
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  }
}, {
  // Agregar timestamps automáticamente
  timestamps: true,
  // Configuración de la colección
  collection: 'productos'
});

// Índices para mejorar el rendimiento de las consultas
productSchema.index({ productId: 1 });
productSchema.index({ nombre: 'text', descripcion: 'text' });
productSchema.index({ categoria: 1 });
productSchema.index({ activo: 1 });

// Método virtual para obtener el precio con descuento aplicado
productSchema.virtual('precioConDescuento').get(function() {
  return this.precio;
});

// Método para aplicar precio especial
productSchema.methods.aplicarPrecioEspecial = function(precioEspecial) {
  return {
    ...this.toObject(),
    precioOriginal: this.precio,
    precioEspecial: precioEspecial,
    precioFinal: precioEspecial,
    tieneDescuento: true
  };
};

// Método estático para buscar productos por término
productSchema.statics.buscarPorTermino = function(termino) {
  return this.find({
    $and: [
      { activo: true },
      {
        $or: [
          { nombre: { $regex: termino, $options: 'i' } },
          { descripcion: { $regex: termino, $options: 'i' } },
          { categoria: { $regex: termino, $options: 'i' } }
        ]
      }
    ]
  });
};

// Transformación JSON para el cliente
productSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Producto', productSchema);
