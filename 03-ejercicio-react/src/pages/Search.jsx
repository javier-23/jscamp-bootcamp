import { useState, useEffect } from 'react'

import { SearchFormSection } from '../components/SearchFormSection'
import { SearchResultsSection } from '../components/SearchResultsSection'

const RESULTS_PER_PAGE = 5

// Trabajar con strings puede generar errores dificiles de depurar. Por eso es mejor usar constantes para los nombres de las claves.
const LOCAL_STORAGE_FILTERS_KEY = 'jobFilters'
const LOCAL_STORAGE_TEXT_KEY = 'jobSearchText'

// Custom hook
const useFilters = () => {
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

  // en este caso no es necesario try/catch. `localStorage.getItem()` no lanza excepciones. Lo que si puede lanzar excepciones es el método `localStorage.setItem()`, pero es raro que falle. Solo lo hace si la memoria está llena o si el usuario entra en un modo del navegador privado.
  const loadTextFromLocalStorage = () => localStorage.getItem(LOCAL_STORAGE_TEXT_KEY) || ''

  const [filters, setFilters] = useState(() => {    
    // el if no ees necesario, siempre estas ejecutando el método `loadFiltersFromLocalStorage()`
    /* if (urlText) {
      return loadFiltersFromLocalStorage() // Cargar filtros guardados al iniciar
    }
    return loadFiltersFromLocalStorage() */
    return loadFiltersFromLocalStorage()
  })
 const [textToFilter, setTextToFilter] = useState(() => {
    // Primero intentar desde URL
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('text') || loadTextFromLocalStorage()
  })
  const [currentPage, setCurrentPage] = useState(1)

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Excelente ejecutar dos useEffects para eventos diferentes!
  // Guardar los filtros en el localStorage
  useEffect(() => {
    try{
      localStorage.setItem(LOCAL_STORAGE_FILTERS_KEY, JSON.stringify(filters))
    } catch (error) {
      console.error('Error saving filters to localStorage:', error)
    }
  }, [filters])

  // Guardar el texto de búsqueda
  useEffect(() => {
    try{
      localStorage.setItem(LOCAL_STORAGE_TEXT_KEY, textToFilter)
    } catch (error) {
      console.error('Error saving search text to localStorage:', error)
    }
  }, [textToFilter])

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        // no es necesario pero lo quise poner para que veas otra forma de evitar tantos `if` debajo del otro :)
        const appendIfExists = (key, value) => {
          if(value) params.append(key, value)
        }
        
        appendIfExists('text', textToFilter)
        appendIfExists('technology', filters.technology)
        appendIfExists('type', filters.location)
        appendIfExists('level', filters.experienceLevel)

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
        setError(error.message)
      } finally{
        setLoading(false)
      }
    }
    fetchJobs()
  }, [textToFilter, filters.technology, filters.location, filters.experienceLevel, currentPage])

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
    filters,
    textToFilter,
    error,
    handleRetry
  }
}

export function Search() {

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
    filters,
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
          initialFilters={filters}
          initialText={textToFilter}
          />
      <SearchResultsSection jobs={jobs} loading={loading} error={error} handleRetry={handleRetry} totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} total={total} resultsPerPage={RESULTS_PER_PAGE}/>
    </main>
  )
}