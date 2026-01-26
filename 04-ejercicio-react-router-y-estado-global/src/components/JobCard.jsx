import { useState } from "react"
import { Link } from "../components/Link.jsx"
import styles from "./JobCard.module.css"
import { useFavoritesStore } from "../store/favoritesStore.js"
import { useAuthStore } from "../store/authStore.js"

function JobCardFavoriteButton({ jobId }) {
    const { isLoggedIn } = useAuthStore()
    const { isFavorite, toogleFavorite } = useFavoritesStore()
    
    return (
        <button
            disabled={!isLoggedIn}
            onClick={(e) => {
                e.stopPropagation()
                toogleFavorite(jobId)
            }}
            aria-label={isFavorite(jobId) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
            {isFavorite(jobId) ? '❤️' : '🤍'}
        </button>
    )
}

function JobCardApplyButton() {
    const [isApplied, setIsApplied] = useState(false)
    const { isLoggedIn } = useAuthStore()

    const handleApplyClick = (e) => {
        e.stopPropagation() // Evitar que el click en el botón se propague al enlace padre
        setIsApplied(true)
    }

    let buttonClasses = 'button-apply-job'
    let buttonText = 'Aplicar'
    if(isLoggedIn){
        buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
        buttonText = isApplied ? 'Aplicado' : 'Aplicar'
    }

    return (
        <button disabled={!isLoggedIn} className={buttonClasses} onClick={handleApplyClick}>{buttonText}</button>
    )
}

export function JobCard({job}){
    
    return (
        <article 
            className="job-listing-card" 
            data-modalidad={job.data.modalidad}
            data-nivel={job.data.nivel}
            data-technology={job.data.technology}
        >
            <Link
                href={`/jobs/${job.id}`} 
                className={styles.cardLink}
                aria-label={`Ver detalles del trabajo: ${job.titulo} en ${job.empresa}`}
            >
                <div>
                    <h3>
                        {job.titulo}
                    </h3>
                    <small>{job.empresa} | {job.ubicacion}</small>
                    <p>{job.descripcion}</p>
                </div>
            </Link>
            <JobCardApplyButton jobId={String(job.id)} />
            <JobCardFavoriteButton jobId={String(job.id)} />
        </article>
    )    
}