import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { Link } from "../components/Link.jsx"
import snarkdown from "snarkdown" // Convierte markdown a HTML
import styles from "./Detail.module.css"
import { useAuthStore } from "../store/authStore.js"
import { useFavoritesStore } from "../store/favoritesStore.js"

function JobSection({ title, content }) {
    let html = snarkdown(content ?? '') // Convierte markdown a HTML
    // también lo que podemos hacer es usar CSS. Todos los ul que estén dentro de `.section` los vamos a estilar. (Si te vas al CSS de `Detail.module.css` lo verás mejor)
    // html = html.replace(/<ul>/g, '<ul class="check">')

    return (
        <section className={styles.section} >
            <h2 className={styles.sectionTitle}>
                {title}
            </h2>
            
            <div
                dangerouslySetInnerHTML={ { __html: html } // Permitir insertar HTML que se que es seguro, en vez de texto plano
            }/>

        </section>
    )
}

function DetailFavoriteButton({ jobId }) {
    const { isFavorite, toogleFavorite } = useFavoritesStore()
    const { isLoggedIn } = useAuthStore()
    
    return (
        <button 
            disabled={!isLoggedIn}
            onClick={() => {toogleFavorite(jobId)}}
            aria-label={isFavorite(jobId) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
            {isFavorite(jobId) ? '❤️' : '🤍'}
        </button>
    )
}

export default function JobDetail() {
    // useParams devuelve un objeto. Como he puesto en la ruta :id, pongo en la variable id
    const { jobId } = useParams()
    const [job, setJob] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const { isLoggedIn } = useAuthStore()

    useEffect(() => {
        if (!jobId) return

        fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
            .then((res) => {
                if(!res.ok){
                    throw new Error(`Job Not Found ${res.status}`)
                }
                return res.json()
            })
            .then(json => {
                setJob(json)
            })
            .catch((error) => {
               setError(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [jobId])

    if (loading) {
        return (
            <div className={styles.loading}>
                <p>Cargando oferta...</p>
            {/* aquí puedes pegar el HTML de skeleton que ya tienes preparado */}
            </div>
        )
    }

    if (!job || error) {
        return (
            <div className={styles.notFound}>
                <h1>Oferta no encontrada</h1>
                <p>Puede que esta oferta haya caducado o que la URL no sea correcta.</p>
                <button className={styles.backButton} onClick={() => navigate('/jobs')}>
                    Volver a la lista de empleos
                </button>
            </div>
        )
    }
    
    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link 
                    href="/search" 
                    className={styles.breadcrumbLink}
                >
                    Empleos
                </Link>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbTitle}>{job.titulo}</span>
            </nav>

            {/* Header principal */}
            <header className={styles.header}>
                <div className={styles.titleAndMeta}>
                    <h1 className={styles.title}>{job.titulo}</h1>
                    <div className={styles.meta}>
                        <p className={styles.company}>{job.empresa}</p>
                        <span className={styles.metaSeparator}>|</span>
                        <p className={styles.location}>{job.ubicacion}</p>
                    </div>
                </div>

                <div className={styles.applyContainer}>
                    <button className={styles.applyButton} disabled={!isLoggedIn}>
                       {isLoggedIn ? 'Aplicar a esta oferta' : 'Inicia sesión para aplicar'}
                    </button>
                    <DetailFavoriteButton jobId={String(job.id)} />
                </div>
            </header>

            <article className="prose">
                <JobSection 
                    title="Descripción del puesto"
                    content={job.content.description}
                />

                <JobSection 
                    title="Responsabilidades"
                    content={job.content.responsibilities}
                />
                <JobSection 
                    title="Requisitos"
                    content={job.content.requirements}
                />
                <JobSection 
                    title="Acerca de la empresa"
                    content={job.content.about}
                />
            </article>

        </div>
    )
}