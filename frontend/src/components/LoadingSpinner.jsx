/**
 * Componente de spinner de carga
 * Muestra un indicador de carga con mensaje personalizable
 */
const LoadingSpinner = ({ message = 'Cargando...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
      <p className="mt-4 text-gray-600 text-center">{message}</p>
    </div>
  )
}

export default LoadingSpinner
