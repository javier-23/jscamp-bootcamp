import { useState, useEffect } from 'react'
// Para manejar los parámetros de búsqueda en la URL
import { useSearchParams } from 'react-router'

import { SearchFormSection } from '../components/SearchFormSection'
import { Pagination } from '../components/Pagination'
import { JobListings } from '../components/JobListings'
import { Spinner } from '../components/Spinner'

const RESULTS_PER_PAGE = 5

const LOCAL_STORAGE_FILTERS_KEY = 'jobFilters'
const LOCAL_STORAGE_TEXT_KEY = 'jobSearchText'

// Custom hook
const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const defaultFilters = {
    technology: '',
    location: '',
    experienceLevel: '',
  }

  const loadFiltersFromLocalStorage = () => {
      // el try/catch no es necesario para `localStorage.getItem()`    
      const stringFilters = localStorage.getItem(LOCAL_STORAGE_FILTERS_KEY)
      
      // siempre es mas facil trabajar con el valor que es null primero. Con esto nos evitamos tener que trabajar con if/else 
      if(stringFilters === null) return defaultFilters

      const savedFilters = JSON.parse(stringFilters)
      return savedFilters
  }

  const loadTextFromLocalStorage = () => localStorage.getItem(LOCAL_STORAGE_TEXT_KEY) || ''

  // Cargar filtros guardados en la URL o localStorage
  const [filters, setFilters] = useState(() => {
    const savedFilters = loadFiltersFromLocalStorage()

    const nextFilters = {}
  
    nextFilters.technology = searchParams.get('technology') || savedFilters.technology || ''
    nextFilters.location = searchParams.get('type') || savedFilters.location || ''
    nextFilters.experienceLevel = searchParams.get('level') || savedFilters.experienceLevel || ''
    
    return nextFilters
  })

  // Cargar texto de búsqueda guardado en la URL o localStorage
  const [textToFilter, setTextToFilter] = useState(() => searchParams.get('text') || loadTextFromLocalStorage() || '')

  // Estado con la página actual, carga página actual desde la URL
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page')

    if (!pageParam) return 1

    const page = Number(pageParam)

      // Excelente validación!
      if (Number.isNaN(page) || page < 1) {
        return 1
      }

      return page
  })

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Guardar los filtros en el localStorage
  useEffect(() => {
    try{
      localStorage.setItem(LOCAL_STORAGE_FILTERS_KEY, JSON.stringify(filters))
    } catch (error) {
      console.error('Error saving filters to localStorage:', String(error?.message ?? error))
    }
  }, [filters])

  // Guardar el texto de búsqueda en el localStorage
  useEffect(() => {
    try{
      localStorage.setItem(LOCAL_STORAGE_TEXT_KEY, textToFilter)
    } catch (error) {
      console.error('Error saving search text to localStorage:', error)
    }
  }, [textToFilter])

  // Obtener los trabajos desde la API cuando cambian los filtros, texto de búsqueda o página actual
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (textToFilter) params.append('text', textToFilter)
        if (filters.technology) params.append('technology', filters.technology)
        if (filters.location) params.append('type', filters.location)
        if (filters.experienceLevel) params.append('level', filters.experienceLevel)

        const offset = (currentPage - 1) * RESULTS_PER_PAGE
        params.append('limit', RESULTS_PER_PAGE)
        params.append('offset', offset)

        const queryParams = params.toString()

        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${queryParams}`)
        if(!response.ok){
          throw new Error(`Error ${response.status}`)
        }
        
        const json = await response.json()
        
        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setError(error)
      } finally{
        setLoading(false)
      }
    }
    fetchJobs()
  }, [textToFilter, filters, currentPage])

  // Sincronizar los filtros y la página actual con los parámetros de la URL
  useEffect(() => {
    
    setSearchParams((prevParams) => {
      const applyIfExist = (key, value) => {
        if (value) prevParams.set(key, value)
        else prevParams.delete(key)
      }
      
      applyIfExist('text', textToFilter)
      applyIfExist('technology', filters.technology)
      applyIfExist('type', filters.location)
      applyIfExist('level', filters.experienceLevel)
      
      if(currentPage > 1){
        prevParams.set('page', currentPage)
      }
      else if(currentPage === 1){
        prevParams.delete('page')
      }
      
      return prevParams
    })

  }, [textToFilter, filters, currentPage, setSearchParams])


  // Calcular el total de páginas redondeando hacia arriba
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (filters) => {
    setFilters(filters)
    setTextToFilter(filters.search || '')
    setCurrentPage(1)
  }

  const handleTextFilter = (newText) => {
    setTextToFilter(newText)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    setTextToFilter('')
    localStorage.removeItem(LOCAL_STORAGE_FILTERS_KEY)
    localStorage.removeItem(LOCAL_STORAGE_TEXT_KEY)
    setCurrentPage(1)
    setSearchParams({})
  }

  const handleRetry = () => {
    setError(null)
    setCurrentPage(1)
    window.location.reload()
  }

  return {
    loading,
    totalPages,
    currentPage,
    handlePageChange, 
    handleSearch,
    handleTextFilter,
    handleReset,
    jobs,
    total,
    textToFilter,
    error,
    handleRetry
  }
}

export default function SearchPage() {
  
  const {
    loading,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter,
    handleReset,
    jobs,
    total,
    textToFilter,
    error,
    handleRetry
  } = useFilters()

  const title = loading 
    ? 'Cargando...' 
    : error 
    ? 'Error al cargar' 
    : `Resultados: ${total}, Página ${currentPage} - DevJobs`

  return (
    <main>
      <title>{title}</title>
      <meta name="description" content="Encuentra las mejores ofertas de trabajo para desarrolladores en DevJobs."></meta>
      
      {/* Formulario de búsqueda */}
        <SearchFormSection 
          onSearch={handleSearch} 
          onTextFilter={handleTextFilter} 
          onReset={handleReset}
          initialText={textToFilter}
          />

        {loading && (
          <section>
            <Spinner/>
          </section>
        )}

        {/* Mensaje de error */}
        {error && (
          <section>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-light)'
            }}>
              <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>
                Error al cargar los trabajos
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>{error}</p>
              <button 
                onClick={handleRetry}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Reintentar
              </button>
            </div>
          </section>
        )}
        

        {/* Listado de trabajos */}
        {!loading && !error && (
          <section>
              <JobListings jobs={jobs}/>

              {/* Paginación */}
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              )}

              {/* Texto informando con el rango de trabajos mostrados */}
              {total > 0 && (
                  <p 
                    style={{"display": "flex", "justifyContent": "center", 
                            "alignItems": "center", "marginBottom": "2rem", 
                            "marginTop": "1rem", "color": "var(--text-light)"}}>
                      Mostrando {(currentPage - 1) * RESULTS_PER_PAGE + 1} -{' '}
                      {Math.min(currentPage * RESULTS_PER_PAGE, total)} de {total} trabajos
                  </p>
              )}
          </section>
        )}
    </main>
  )
}