/**
 * Componente para mostrar mensajes de éxito
 * Proporciona feedback positivo al usuario después de operaciones exitosas
 */
const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-green-400 text-xl">✅</div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">
            Éxito
          </h3>
          <div className="mt-2 text-sm text-green-700">
            {message}
          </div>
          {onClose && (
            <div className="mt-4">
              <button
                onClick={onClose}
                className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors duration-200"
              >
                ✕ Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuccessMessage
