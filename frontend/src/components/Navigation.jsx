import { Link, useLocation } from 'react-router-dom'

/**
 * Componente de navegación principal
 * Proporciona navegación entre las páginas de Artículos y Subida
 */
const Navigation = () => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/articulos' && (location.pathname === '/' || location.pathname === '/articulos')) {
      return true
    }
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">
                Sistema de Gestión
              </h1>
            </div>
          </div>

          {/* Enlaces de navegación */}
          <div className="flex items-center space-x-4">
            <Link
              to="/articulos"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/articulos')
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📦 Artículos
            </Link>
            <Link
              to="/subida"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/subida')
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📤 Subida
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
