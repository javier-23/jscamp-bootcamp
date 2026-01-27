import { useId, useState } from "react"

/* Sacamos props y centralizamos la lógica en el componente `Search` */
export function SearchFormSection({ 
  onTextChange, 
  onFilterChange, 
  onSubmit, 
  onReset, 
  searchText, 
  filters,
  hasFilters 
}) {
    const idText = useId()
    const idTechnology = useId()
    const idLocation = useId()
    const idExperienceLevel = useId()

    const [focusedField, setFocusedField] = useState(null)

    const handleSubmit = (evt) => {
        evt.preventDefault()
        onSubmit()
    }

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
                            value={searchText}
                            name={idText} id="empleos-search-input" type="text"
                            placeholder="Buscar trabajos, empresas o habilidades"
                            onChange={(e) => onTextChange(e.target.value)}
                        />
                  </div>

                  <div className="filtros-busqueda-empleo">
                      <select 
                        value={filters.technology}
                        onChange={(e) => onFilterChange('technology', e.target.value)}
                        name={idTechnology} 
                        id="filter-technology">
                          <option value="">Tecnología</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="react">React</option>
                          <option value="node">Node.js</option>
                      </select>

                      <select
                        value={filters.location}
                        onChange={(e) => onFilterChange('location', e.target.value)}
                        name={idLocation} 
                        id="filter-location">
                          <option value="">Ubicación</option>
                          <option value="remoto">Remoto</option>
                          <option value="hibrido">Híbrido</option>
                          <option value="nuevayork">Nueva York</option>
                          <option value="madrid">Madrid</option>
                          <option value="londres">Londres</option>
                      </select>

                      <select 
                        value={filters.experienceLevel}
                        onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
                        name={idExperienceLevel} 
                        id="filter-experience-level"
                      >
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
                    { hasFilters &&
                        <button type="button" className="btn-secondary" onClick={onReset}>
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