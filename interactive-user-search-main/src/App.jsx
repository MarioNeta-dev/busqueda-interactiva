import { useEffect, useState, useCallback, useRef } from 'react'
import Card from './components/Card'
import SearchInput from './components/SearchInput'
import axios from 'axios'

export default function App() {
  const [usuarios, setUsuarios] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [cargando, setCargando] = useState(false)
  const timeoutRef = useRef(null)


  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/usuarios')

      setUsuarios(res.data)
      setFiltrados(res.data)
    } catch {
      // Error al cargar usuarios
    }
  }

  console.log(usuarios)

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const filtrarUsuarios = useCallback(
    (query) => {
      setCargando(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        if (query.trim() === '') {
          setFiltrados(usuarios)
        } else {
          const q = query.trim().toLowerCase()
          const resultados = usuarios.filter((u) =>
            [u.nombre, u.apellidos, u.perfil, u.intereses, u.correo].some(
              (campo) => String(campo).toLowerCase().includes(q)
            )
          )
          setFiltrados(resultados)
        }
        setCargando(false)
      }, 300)
    },
    [usuarios]
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-4">
        BUSCADOR DE USUARIOS
      </h1>
      <SearchInput onSearch={filtrarUsuarios} />
      {cargando && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <div className="spinner"></div>
        </div>
      )}
      {!cargando && Array.isArray(filtrados) && (
        <div className="card-grid">
          {filtrados.map((usuario) => <Card key={usuario.id} usuario={usuario} />)}
        </div>
      )}
    </div>
  )
}