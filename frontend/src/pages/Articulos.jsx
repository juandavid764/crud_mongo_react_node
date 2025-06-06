import { useState, useEffect } from 'react'
import { productService } from '../services/api'
import { formatPrice, calculateDiscountPercentage, debounce } from '../utils/helpers'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

/**
 * Página de Artículos
 * Muestra una tabla de productos con sus precios
 * Los precios cambian si el usuario tiene precios especiales configurados
 */
const Articulos = () => {
  // Estados del componente
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  /**
   * Cargar productos desde la API
   */
  const loadProducts = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...params
      }
      
      // Agregar filtros si están presentes
      if (selectedCategory) queryParams.categoria = selectedCategory
      if (searchTerm.trim()) queryParams.buscar = searchTerm.trim()
      if (currentUserId.trim()) queryParams.userId = currentUserId.trim()
      
      const response = await productService.getProducts(queryParams)
      
      setProducts(response.data || [])
      setPagination(response.pagination || pagination)
      
    } catch (err) {
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cargar categorías disponibles
   */
  const loadCategories = async () => {
    try {
      const response = await productService.getCategories()
      setCategories(response.data || [])
    } catch (err) {
      console.error('Error al cargar categorías:', err)
    }
  }

  /**
   * Búsqueda con debounce
   */
  const debouncedSearch = debounce((term) => {
    setPagination(prev => ({ ...prev, page: 1 }))
    loadProducts({ buscar: term, page: 1 })
  }, 500)

  /**
   * Manejar cambio en el término de búsqueda
   */
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  /**
   * Manejar cambio de categoría
   */
  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    setPagination(prev => ({ ...prev, page: 1 }))
    loadProducts({ categoria: category, page: 1 })
  }

  /**
   * Manejar cambio de ID de usuario
   */
  const handleUserIdChange = (e) => {
    const userId = e.target.value
    setCurrentUserId(userId)
    setPagination(prev => ({ ...prev, page: 1 }))
    loadProducts({ userId: userId, page: 1 })
  }

  /**
   * Cambiar página
   */
  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    loadProducts({ page: newPage })
  }

  /**
   * Limpiar filtros
   */
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setCurrentUserId('')
    setPagination(prev => ({ ...prev, page: 1 }))
    loadProducts({ page: 1 })
  }

  // Efectos
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  if (loading && products.length === 0) {
    return <LoadingSpinner message="Cargando productos..." />
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📦 Gestión de Artículos
        </h1>
        <p className="text-gray-600">
          Visualiza el catálogo de productos con precios especiales aplicados según el usuario
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda por término */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Buscar productos
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Nombre o descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              📁 Categoría
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* ID de usuario para precios especiales */}
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              👤 ID Usuario
            </label>
            <input
              type="text"
              id="userId"
              value={currentUserId}
              onChange={handleUserIdChange}
              placeholder="ej: user123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botón limpiar filtros */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              🗑️ Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && <ErrorMessage message={error} onRetry={() => loadProducts()} />}

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Información de resultados */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Mostrando {products.length} de {pagination.total} productos
              {currentUserId && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Precios para usuario: {currentUserId}
                </span>
              )}
            </span>
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Actualizando...
              </div>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Original
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Final
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-lg font-medium">No se encontraron productos</p>
                      <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const hasSpecialPrice = product.tieneDescuento && product.precioEspecial
                  const discount = hasSpecialPrice 
                    ? calculateDiscountPercentage(product.precioOriginal || product.precio, product.precioEspecial)
                    : 0

                  return (
                    <tr key={product.id || product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.nombre}
                          </div>
                          {product.descripcion && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.descripcion}
                            </div>
                          )}
                          {product.sku && (
                            <div className="text-xs text-gray-400">
                              SKU: {product.sku}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.categoria || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <span className={hasSpecialPrice ? 'line-through text-gray-500' : 'text-gray-900 font-medium'}>
                          {formatPrice(product.precioOriginal || product.precio)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <span className={`font-medium ${hasSpecialPrice ? 'text-green-600' : 'text-gray-900'}`}>
                          {formatPrice(product.precioFinal || product.precioEspecial || product.precio)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {hasSpecialPrice ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            -{discount}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Sin descuento</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Página {pagination.page} de {pagination.pages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Articulos
