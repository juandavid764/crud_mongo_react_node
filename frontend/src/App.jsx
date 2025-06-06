import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Articulos from './pages/Articulos'
import Subida from './pages/Subida'

/**
 * Componente principal de la aplicación
 * Maneja el enrutamiento y la estructura general de la aplicación
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navegación principal */}
        <Navigation />
        
        {/* Contenido principal */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Articulos />} />
            <Route path="/articulos" element={<Articulos />} />
            <Route path="/subida" element={<Subida />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
