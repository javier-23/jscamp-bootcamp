import { useRouter } from '../hooks/useRouter'

export function HomePage (){
    const { navigateTo } = useRouter()
    
    const handleSearch = (event) => {
        // Prevenir el comportamiento por defecto (reload de página)
        event.preventDefault()

        // Crear un objeto FormData desde el formulario
        const formData = new FormData(event.target)

        // Extraer el valor del input por su name
        const searchTerm = formData.get('search')
        
        let targetUrl = '/search'

        if (searchTerm) {
            // Codificar el texto para que sea seguro en la URL
            const encodedTerm = encodeURIComponent(searchTerm)
            targetUrl += `?text=${encodedTerm}`
        }
        
        navigateTo(targetUrl)
    }
    
    return(
        <main>
            <section>
                <img className = "background-image"
                    src="/background.webp"
                    alt="Imagen de programador trabajando"
                />

                <h1>Encuentra el trabajo de tus sueños</h1>
                <p>Únete a la comunidad de desarrolladores y encuentra el trabajo que siempre has querido.</p>
            
                <form role="search" onSubmit={handleSearch}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
                    </div>

                    <input required 
                        type="text" 
                        placeholder="Buscar empleos por título, habilidad o empresa" 
                        name="search"
                    />
                    <button type="submit">Buscar</button>
                </form>
            </section>

            <section className="why-devjobs">
                <header>
                    <h2>¿Por qué DevJobs?</h2>
                    <p>DevJobs es la principal bolsa de trabajo para desarrolladores. Conectamos a los desarrolladores con las mejores empresas del mundo.</p>
                </header>

                <footer>
                    <article>
                        <svg  
                            xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" />
                        </svg>
                        <h3>Encuentra el trabajo de tus sueños</h3>
                        <p>DevJobs te ayuda a encontrar el trabajo que siempre has querido.</p>
                    </article>

                    <article>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
                        <h3>Conecta con las mejores empresas</h3>
                        <p>DevJobs te conecta con las empresas más innovadoras del sector tecnológico.</p>
                    </article>

                    <article>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-cash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3" /><path d="M7 9m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" /><path d="M12 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /></svg>
                        <h3>Obtén el salario que mereces</h3>
                        <p>DevJobs te ayuda a obtener el salario que realmente mereces.</p>
                    </article> 
                </footer>
            </section>

        </main>

    )
}