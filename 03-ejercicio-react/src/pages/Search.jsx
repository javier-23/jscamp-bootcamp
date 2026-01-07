import { useState, useEffect } from 'react'

import { SearchFormSection } from '../components/SearchFormSection'
import { SearchResultsSection } from '../components/SearchResultsSection'

const RESULTS_PER_PAGE = 5

// Custom hook
const useFilters = () => {
  const defaultFilters = {
    technology: '',
    location: '',
    experienceLevel: '',
  }

  const loadFiltersFromLocalStorage = () => {
    try {
      const stringFilters = localStorage.getItem('jobFilters')
      
      if(stringFilters != null){
          const savedFilters = JSON.parse(stringFilters)
          return savedFilters
      }
      else{
        return defaultFilters
      }
    } catch (error) {
      console.error('Error parsing filters from localStorage:', error)
      return defaultFilters
    }
  }

  const loadTextFromLocalStorage = () => {
    try {
      return localStorage.getItem('jobSearchText') || ''
    } catch (error) {
      return ''
    }
  }

  const [filters, setFilters] = useState(() => {
    // Primero intentar cargar desde URL
    const urlParams = new URLSearchParams(window.location.search)
    const urlText = urlParams.get('text')
    
    if (urlText) {
      return loadFiltersFromLocalStorage() // Cargar filtros guardados al iniciar
    }
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

  // Guardar los filtros en el localStorage
  useEffect(() => {
    try{
      localStorage.setItem('jobFilters', JSON.stringify(filters))
    } catch (error) {
      console.error('Error saving filters to localStorage:', error)
    }
  }, [filters])

  // Guardar el texto de búsqueda
  useEffect(() => {
    try{
      localStorage.setItem('jobSearchText', textToFilter)
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
    localStorage.removeItem('jobFilters')
    localStorage.removeItem('jobSearchText')
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