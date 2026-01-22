import { JobListings } from "./JobListings"
import { Pagination } from "./Pagination"
import { Spinner } from '../components/Spinner'

/* Hicimos cambios con `if` para que el código sea más legible y evitar tanta lógica con `&&` anidados */
{/* Sección con los resultados de búsqueda: resultados (spinner, error o trabajos), información de los resultado y paginación  */}
export function SearchResultsSection({jobs, loading, error, handleRetry, totalPages, currentPage, handlePageChange, total, resultsPerPage}) {
    
    {/* Spinner de carga */}
    if(loading) return <section>
        <Spinner/>
    </section>

    {/* Mensaje de error */}
    if(error) return <section>
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

    return (
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
                    Mostrando {(currentPage - 1) * resultsPerPage + 1} -{' '}
                    {Math.min(currentPage * resultsPerPage, total)} de {total} trabajos
                </p>
            )}
        </section>
    )
}