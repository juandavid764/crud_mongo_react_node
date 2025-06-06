import { useState, useEffect } from 'react'
import { specialPriceService, productService } from '../services/api'
import { formatPrice, validateEmail, capitalizeWords, CLIENT_TYPES, getClientTypeColor, getDateInputValue } from '../utils/helpers'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'

/**
 * Página de Subida
 * Formulario para agregar nuevos precios especiales a la colección personalizada
 */
const Subida = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    usuario: {
      userId: '',
      nombre: '',
      email: '',
      tipoCliente: 'Premium'
    },
    producto: {
      productId: '',
      nombre: '',
      precioOriginal: 0
    },
    precioEspecial: '',
    vigencia: {
      fechaInicio: getDateInputValue(),
      fechaFin: getDateInputValue(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // 30 días por defecto
    },
    motivo: '',
    creadoPor: 'Sistema'
  })

  // Estados del componente
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchingProduct, setSearchingProduct] = useState(false)
  const [productSuggestions, setProductSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  /**
   * Buscar producto por ID
   */
  const searchProduct = async (productId) => {
    if (!productId.trim()) {
      setFormData(prev => ({
        ...prev,
        producto: { productId: '', nombre: '', precioOriginal: 0 }
      }))
      return
    }

    try {
      setSearchingProduct(true)
      setError(null)
      
      const response = await productService.getProductById(productId)
      
      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          producto: {
            productId: response.data.productId || response.data.id,
            nombre: response.data.nombre,
            precioOriginal: response.data.precio
          }
        }))
      }
    } catch (err) {
      setFormData(prev => ({
        ...prev,
        producto: { ...prev.producto, nombre: '', precioOriginal: 0 }
      }))
      console.error('Producto no encontrado:', err)
    } finally {
      setSearchingProduct(false)
    }
  }

  /**
   * Buscar productos para sugerencias
   */
  const searchProductSuggestions = async (searchTerm) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setProductSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await productService.searchProducts(searchTerm)
      
      if (response.success && response.data) {
        setProductSuggestions(response.data.slice(0, 5)) // Máximo 5 sugerencias
        setShowSuggestions(true)
      }
    } catch (err) {
      console.error('Error al buscar productos:', err)
      setProductSuggestions([])
      setShowSuggestions(false)
    }
  }

  /**
   * Seleccionar producto de las sugerencias
   */
  const selectProduct = (product) => {
    setFormData(prev => ({
      ...prev,
      producto: {
        productId: product.productId || product.id,
        nombre: product.nombre,
        precioOriginal: product.precio
      }
    }))
    setShowSuggestions(false)
    setProductSuggestions([])
  }

  /**
   * Manejar cambios en el formulario
   */
  const handleInputChange = (section, field, value) => {
    if (section === 'usuario') {
      setFormData(prev => ({
        ...prev,
        usuario: { ...prev.usuario, [field]: value }
      }))
    } else if (section === 'producto') {
      setFormData(prev => ({
        ...prev,
        producto: { ...prev.producto, [field]: value }
      }))
      
      // Si se cambia el ID del producto, buscar el producto
      if (field === 'productId') {
        searchProduct(value)
      }
      
      // Si se cambia el nombre, buscar sugerencias
      if (field === 'nombre') {
        searchProductSuggestions(value)
      }
    } else if (section === 'vigencia') {
      setFormData(prev => ({
        ...prev,
        vigencia: { ...prev.vigencia, [field]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  /**
   * Validar formulario
   */
  const validateForm = () => {
    const errors = []

    // Validar usuario
    if (!formData.usuario.userId.trim()) {
      errors.push('ID del usuario es requerido')
    }
    if (!formData.usuario.nombre.trim()) {
      errors.push('Nombre del usuario es requerido')
    }
    if (!formData.usuario.email.trim()) {
      errors.push('Email del usuario es requerido')
    } else if (!validateEmail(formData.usuario.email)) {
      errors.push('Formato de email inválido')
    }

    // Validar producto
    if (!formData.producto.productId) {
      errors.push('Debe seleccionar un producto válido')
    }
    if (!formData.producto.precioOriginal || formData.producto.precioOriginal <= 0) {
      errors.push('El producto debe tener un precio válido')
    }

    // Validar precio especial
    const precioEspecial = parseFloat(formData.precioEspecial)
    if (!precioEspecial || precioEspecial <= 0) {
      errors.push('Precio especial debe ser mayor a 0')
    } else if (precioEspecial > formData.producto.precioOriginal) {
      errors.push('El precio especial no puede ser mayor al precio original')
    }

    // Validar vigencia
    const fechaInicio = new Date(formData.vigencia.fechaInicio)
    const fechaFin = new Date(formData.vigencia.fechaFin)
    const ahora = new Date()

    if (fechaFin <= ahora) {
      errors.push('La fecha de fin debe ser futura')
    }
    if (fechaInicio >= fechaFin) {
      errors.push('La fecha de inicio debe ser anterior a la fecha de fin')
    }

    return errors
  }

  /**
   * Enviar formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const submitData = {
        usuario: {
          userId: formData.usuario.userId.trim(),
          nombre: capitalizeWords(formData.usuario.nombre.trim()),
          email: formData.usuario.email.trim().toLowerCase(),
          tipoCliente: formData.usuario.tipoCliente
        },
        producto: {
          productId: formData.producto.productId
        },
        precioEspecial: parseFloat(formData.precioEspecial),
        vigencia: {
          fechaInicio: new Date(formData.vigencia.fechaInicio),
          fechaFin: new Date(formData.vigencia.fechaFin)
        },
        motivo: formData.motivo.trim(),
        creadoPor: formData.creadoPor
      }

      const response = await specialPriceService.createSpecialPrice(submitData)

      if (response.success) {
        setSuccess('Precio especial creado exitosamente')
        // Limpiar formulario
        setFormData({
          usuario: {
            userId: '',
            nombre: '',
            email: '',
            tipoCliente: 'Premium'
          },
          producto: {
            productId: '',
            nombre: '',
            precioOriginal: 0
          },
          precioEspecial: '',
          vigencia: {
            fechaInicio: getDateInputValue(),
            fechaFin: getDateInputValue(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
          },
          motivo: '',
          creadoPor: 'Sistema'
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calcular porcentaje de descuento
   */
  const discountPercentage = () => {
    const precio = parseFloat(formData.precioEspecial)
    const original = formData.producto.precioOriginal
    
    if (precio && original && precio <= original) {
      return Math.round(((original - precio) / original) * 100)
    }
    return 0
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📤 Subida de Precios Especiales
        </h1>
        <p className="text-gray-600">
          Agrega nuevos precios especiales a la colección <code className="bg-gray-100 px-2 py-1 rounded text-sm">preciosEspecialesGarcia25</code>
        </p>
      </div>

      {/* Mensajes */}
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Usuario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            👤 Información del Usuario
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                ID del Usuario *
              </label>
              <input
                type="text"
                id="userId"
                value={formData.usuario.userId}
                onChange={(e) => handleInputChange('usuario', 'userId', e.target.value)}
                placeholder="ej: user123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="tipoCliente" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cliente *
              </label>
              <select
                id="tipoCliente"
                value={formData.usuario.tipoCliente}
                onChange={(e) => handleInputChange('usuario', 'tipoCliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(CLIENT_TYPES).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClientTypeColor(formData.usuario.tipoCliente)}`}>
                  {formData.usuario.tipoCliente}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.usuario.nombre}
                onChange={(e) => handleInputChange('usuario', 'nombre', e.target.value)}
                placeholder="Juan García"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.usuario.email}
                onChange={(e) => handleInputChange('usuario', 'email', e.target.value)}
                placeholder="juan@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Información del Producto */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📦 Información del Producto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                ID del Producto *
              </label>
              <input
                type="text"
                id="productId"
                value={formData.producto.productId}
                onChange={(e) => handleInputChange('producto', 'productId', e.target.value)}
                placeholder="Buscar por ID del producto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {searchingProduct && (
                <div className="absolute right-3 top-9 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            <div className="relative">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto
              </label>
              <input
                type="text"
                id="productName"
                value={formData.producto.nombre}
                onChange={(e) => handleInputChange('producto', 'nombre', e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!!formData.producto.productId}
              />
              
              {/* Sugerencias de productos */}
              {showSuggestions && productSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {productSuggestions.map((product) => (
                    <button
                      key={product.id || product._id}
                      type="button"
                      onClick={() => selectProduct(product)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">{product.nombre}</div>
                      <div className="text-sm text-gray-500">
                        ID: {product.productId || product.id} - {formatPrice(product.precio)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="precioOriginal" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Original
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="precioOriginal"
                  value={formData.producto.precioOriginal || ''}
                  readOnly
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
              {formData.producto.precioOriginal > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {formatPrice(formData.producto.precioOriginal)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="precioEspecial" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Especial *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="precioEspecial"
                  value={formData.precioEspecial}
                  onChange={(e) => handleInputChange(null, 'precioEspecial', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {formData.precioEspecial && (
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">
                    {formatPrice(parseFloat(formData.precioEspecial))}
                  </p>
                  {discountPercentage() > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Descuento: {discountPercentage()}%
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vigencia y Configuración */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📅 Vigencia y Configuración
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                value={formData.vigencia.fechaInicio}
                onChange={(e) => handleInputChange('vigencia', 'fechaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin *
              </label>
              <input
                type="date"
                id="fechaFin"
                value={formData.vigencia.fechaFin}
                onChange={(e) => handleInputChange('vigencia', 'fechaFin', e.target.value)}
                min={getDateInputValue()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del Precio Especial
              </label>
              <textarea
                id="motivo"
                value={formData.motivo}
                onChange={(e) => handleInputChange(null, 'motivo', e.target.value)}
                placeholder="ej: Cliente VIP, Promoción especial, Liquidación..."
                rows="3"
                maxLength="200"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-1 text-sm text-gray-500">
                {formData.motivo.length}/200 caracteres
              </div>
            </div>

            <div>
              <label htmlFor="creadoPor" className="block text-sm font-medium text-gray-700 mb-2">
                Creado Por
              </label>
              <input
                type="text"
                id="creadoPor"
                value={formData.creadoPor}
                onChange={(e) => handleInputChange(null, 'creadoPor', e.target.value)}
                placeholder="Sistema"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              🔄 Limpiar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  💾 Crear Precio Especial
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Subida
