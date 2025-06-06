/**
 * Componente para mostrar mensajes de error
 * Proporciona una interfaz consistente para mostrar errores con opción de reintento
 */
const ErrorMessage = ({ message, onRetry, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-red-400 text-xl">⚠️</div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            {message}
          </div>
          {(onRetry || onClose) && (
            <div className="mt-4 flex space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors duration-200"
                >
                  🔄 Reintentar
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors duration-200"
                >
                  ✕ Cerrar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
