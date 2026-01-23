import { useEffect, useId, useState } from "react"

let timeoutId = null

const useSearchForm = ({onSearch, onTextFilter, onReset, setCleanFilters, onTextChange}) => {
    const idText = useId()
    const idTechnology = useId()
    const idLocation = useId()
    const idExperienceLevel = useId()
    
    const handleSubmit = (event) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const filters = {
            search: formData.get(idText),
            technology: formData.get(idTechnology),
            location: formData.get(idLocation),
            experienceLevel: formData.get(idExperienceLevel),
        }
        // Si hay algún filtro aplicado, mostrar el botón de limpiar
        const hasFilters = Object.values(filters).some(value => value)
        setCleanFilters(hasFilters)

        onSearch(filters)
    }

    // Búsqueda de texto en tiempo real
    const handleChangeText = (event) => {
        const text = event.target.value
        onTextChange(text)

        //Debounce: cancelar timeout anterior
        if(timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            onTextFilter(text)
        }, 500)
    }

    const handleReset = () => {
        setCleanFilters(false)
        // Notificar al padre
        onReset()
    }

    return{
        handleSubmit,
        handleChangeText, 
        handleReset,
        idText,
        idTechnology,
        idLocation,
        idExperienceLevel
    }

}

export function SearchFormSection({ onSearch, onTextFilter, onReset, initialFilters, initialText }) {
    // Estado para saber qué campo está activo
    const [focusedField, setFocusedField] = useState(null)
    const [cleanFilters, setCleanFilters ] = useState(false)

    // Estados controlados para los selects
    const [technology, setTechnology] = useState(initialFilters.technology || '')
    const [location, setLocation] = useState(initialFilters.location || '')
    const [experienceLevel, setExperienceLevel] = useState(initialFilters.experienceLevel || '')
    const [searchText, setSearchText] = useState(initialText || '')

    const handleResetSearchForm = () => {
        setExperienceLevel('')
        setTechnology('')
        setLocation('')
        setSearchText('')
        setCleanFilters(false)
        onReset()
    }

    const handleTextChange = (text) => {
        setSearchText(text)
    }

    // con esto evitamos que se pasen tantos parametros al hook
    const {
        handleSubmit,
        handleChangeText,
        handleReset,
         idText,
        idTechnology,
        idLocation,
        idExperienceLevel
    } = useSearchForm({
        onSearch,
        onTextFilter,
        onReset: handleResetSearchForm,
        onTextChange: handleTextChange,
        setCleanFilters
    })

    useEffect(() => {
        const hasFilters = initialText || 
                          initialFilters.technology || 
                          initialFilters.location || 
                          initialFilters.experienceLevel
        setCleanFilters(!!hasFilters)
        setTechnology(initialFilters.technology || '')
        setLocation(initialFilters.location || '')
        setExperienceLevel(initialFilters.experienceLevel || '')
    }, [initialFilters, initialText])

    return (
      <section className="seccion-busqueda-empleos">
              <h1>Encuentra tu próximo trabajo</h1>
              <p>Explora las ofertas de empleo más recientes y encuentra el trabajo ideal para ti.</p>

              <form role="search" onSubmit={handleSubmit} className="search-form">
                  <div 
                    className="barra-busqueda-empleo"
                    onFocus={() => setFocusedField('search')}
                    onBlur={() => setFocusedField(null)}
                    style={focusedField === 'search' ? { borderColor: '#4f46e5', outline: '2px solid #4f46e5' } : {}}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
                        
                        <input 
                            name={idText} id="empleos-search-input" type="text"
                            placeholder="Buscar trabajos, empresas o habilidades"
                            onChange={handleChangeText}
                            value={searchText}
                        />
                  </div>

                  <div className="filtros-busqueda-empleo">
                      <select 
                        name={idTechnology} 
                        id="filter-technology" 
                        value={technology}
                        onChange={e => setTechnology(e.target.value)}>
                          <option value="">Tecnología</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="react">React</option>
                          <option value="node">Node.js</option>
                      </select>

                      <select
                        name={idLocation} 
                        id="filter-location" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}>
                          <option value="">Ubicación</option>
                          <option value="remoto">Remoto</option>
                          <option value="hibrido">Híbrido</option>
                          <option value="nuevayork">Nueva York</option>
                          <option value="madrid">Madrid</option>
                          <option value="londres">Londres</option>
                      </select>

                      <select 
                        name={idExperienceLevel} 
                        id="filter-experience-level" 
                        value={experienceLevel}
                        onChange={e => setExperienceLevel(e.target.value)}>
                          <option value="">Nivel de experiencia</option>
                          <option value="junior">Junior</option>
                          <option value="mid">Mid-level</option>
                          <option value="senior">Senior</option>
                          <option value="lead">Lead</option>
                      </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/>
                        </svg>
                        Aplicar filtros
                    </button>
                    { cleanFilters &&
                        <button type="button" className="btn-secondary" onClick={handleReset}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            Limpiar filtros
                        </button>
                    }
                </div>
              </form>
          </section>
    )
  }