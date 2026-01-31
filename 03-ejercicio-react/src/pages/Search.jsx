import { useState, useEffect, useMemo } from 'react'

import { SearchFormSection } from '../components/SearchFormSection'
import { SearchResultsSection } from '../components/SearchResultsSection'
import { useDebounce } from '../hooks/useDebounce'

const RESULTS_PER_PAGE = 5

// Trabajar con strings puede generar errores dificiles de depurar. Por eso es mejor usar constantes para los nombres de las claves.
const LOCAL_STORAGE_FILTERS_KEY = 'jobFilters'
const LOCAL_STORAGE_TEXT_KEY = 'jobSearchText'

// Custom hook
const useJobsFilters = () => {
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

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }))
    setCurrentPage(1)
  }

  const handleTextChange = (newText) => {
    setTextToFilter(newText)
  }

  // creé una función para hacer debounce. Lo hice para que puedas ver que podemos crear hooks genéricos que puedan ser reutilizados en cualquier lugar. Como estaba antes está genial :)
  const debouncedTextChange = useDebounce(() => {
    setCurrentPage(1)
  }, 500)

  // para evitar logicas duplicadas, todo lo que tenga que ver con filtro y búsqueda, lo vamos a ejecutar dentro del hook que ya tenemos. Por esto, el debounce y búsqueda por texto que antes teníamos en `SearchFormSection.jsx` lo hacemos aquí :)
  // No hace falta crear `handleTextChange` ni `handleTextChangeWithDebounce` porque se usan solo aquí, pero me pareció interesante como ejercicio de "dejar las cosas declarativas".
  const handleTextChangeWithDebounce = (text) => {
    handleTextChange(text)
    debouncedTextChange(text)
  }

  const handleSubmit = () => {
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    setTextToFilter('')
    setCurrentPage(1)
  }

  // usamos el `useMemo` para evitar que se calcule la variable `hasFilters` cada vez que se renderice el componente. Hay un patrón muy usado normalmente cuando trabajamos con datos en react y es que, cuando queremos filtrar datos, hay una gran chance de que lo podamos hacer con `useMemo`. Lo que dice estas lineas es: solo quiero que modifiques el valor de `hasFilters` cuando el texto/selects cambian.
  const hasFilters = useMemo(() => {
    return textToFilter || filters.technology || filters.location || filters.experienceLevel
  }, [textToFilter, filters])

  const handleRetry = () => {
    setError(null)
    setCurrentPage(1)
    window.location.reload()
  }

  // crack! cuando veas este cambio verás que el objeto de retorno es mas grande y complejo que el anterior. Quiero que sepas que la manera en la que lo hiciste también es correcta. Hice esto para agrupar responsabilidades y props (que sea mas fácil de entender y mantener). Al haber tantas props y handlers, puede ser difícil recordar y entender a que corresponde cada una. Por eso agruparlas es lo mejor, sobre todo cuando las usamos en puntos diferentes del código.
  return {
    jobs: {
      values: {
        jobs,
        total,
        loading,
        error
      },
      handlers: {
        handleRetry,
      }
    },
    pagination: {
      values: {
        total: totalPages,
        currentPage
      },
      handlers: {
        handlePageChange
      }
    },
    filters: {
      values: {
        filters,
        textToFilter,
        hasFilters
      },
      handlers: {
        handleReset,
        handleFilterChange,
        handleTextChangeWithDebounce,
        handleSubmit
      }
    }
  }
}

export function Search() {
  const { jobs, pagination, filters } = useJobsFilters()

  const title = jobs.values.loading 
    ? 'Cargando...' 
    : jobs.values.error 
    ? 'Error al cargar' 
    : `Resultados: ${jobs.values.total}, Página ${pagination.values.currentPage} - DevJobs`

  return (
    <main>
      <title>{title}</title>
      <meta name="description" content="Encuentra las mejores ofertas de trabajo para desarrolladores en DevJobs."></meta>
      
      {/* Formulario de búsqueda */}
      {/* Al dividir las props del hook por responsabilidades, aquí se ve claramente que todo lo que tiene que ver con filters, se encuentra SOLO en el componente `SearchFormSection` y no en `SearchResultsSection`. Esto... nos podría dar algún indicio de que podamos llevar el hook a `SearchFormSection`? | No lo hice en esta corrección porque siento que ya hicimos muchos cambios y más que aclarar, va a confundir más. Espero que hasta ahora se entienda bien, y siempre, en todo código, hay posibilidad de mejorar :)  */}
        <SearchFormSection 
          onTextChange={filters.handlers.handleTextChangeWithDebounce}
          onFilterChange={filters.handlers.handleFilterChange}
          onSubmit={filters.handlers.handleSubmit}
          onReset={filters.handlers.handleReset}
          searchText={filters.values.textToFilter}
          filters={filters.values.filters}
          hasFilters={filters.values.hasFilters}
          />
         <SearchResultsSection
          jobs={jobs.values.jobs}
          loading={jobs.values.loading}
          error={jobs.values.error}
          handleRetry={jobs.handlers.handleRetry}
          totalPages={pagination.values.total}
          currentPage={pagination.values.currentPage}
          handlePageChange={pagination.handlers.handlePageChange}
          total={jobs.values.total}
          resultsPerPage={RESULTS_PER_PAGE}
        />
    </main>
  )
}