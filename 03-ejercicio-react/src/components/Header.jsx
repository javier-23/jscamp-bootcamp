import {Link} from './Link'

function Header() {
  return (
    <header>
        <a href="/" style={{margin: 0}}>
            <h1>
                <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>    
                DevJobs
            </h1>
        </a>

        <nav aria-label="Navegación principal">
            <ul>
                <li>
                    <Link href="/">Inicio</Link>
                </li>
                <li>
                    <Link href="/search">Empleos</Link>
                </li>
                <li>
                    <Link href="/about">Acerca</Link>
                </li>
                <li>
                    <Link href="/contact">Contacto</Link>
                </li>
            </ul>
        </nav>

        <div>
            <button className="btn-login">Subir CV</button>
        </div>
    </header>
  )
}

export default Header