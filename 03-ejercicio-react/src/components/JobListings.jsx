import {JobCard} from './JobCard'

export function JobListings({jobs}){
  
    return (
      <>
        <section className="seccion-resultados-empleos">
          <h2>Resultados de búsqueda</h2>
            <div className="jobs-listings">
            {
              jobs.length === 0 && (
                <p style={{textAlign: 'center', marginTop: '2rem', color: 'var(--text-light)', paddingBottom: '2rem', textWrap: 'balance'}}>
                  No se encontraron trabajos que coincidan con los filtros aplicados.
                </p>
              )
            }
              {jobs.map(job => (
                <JobCard key={job.id} job={job}/>
              ))}
            </div>
        </section>
      </>
    )
  }