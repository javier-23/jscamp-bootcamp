import { NavLink } from 'react-router'
import { useAuthStore } from '../store/authStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'

export function Header() {
  const { isLoggedIn, handleLogin, handleLogOut } = useAuthStore()
  const { clearFavorites } = useFavoritesStore()

  const logout = () => {
      handleLogOut()
      clearFavorites()
  }

  return (
    <header>
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ color: 'white' }}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </NavLink>

      <nav>
        <NavLink 
          className={ ({isActive}) => isActive ? 'active-link' : '' }
          to="/search"
          aria-label="Ir a empleos"
        >
          Empleos
        </NavLink>

        <a href="/search">Sin SPA</a>
      </nav>

      <div>
          {isLoggedIn 
              ? <button className="btn-login" onClick={logout}>Cerrar sesión</button>
              : <button className="btn-login" onClick={handleLogin}>Iniciar sesión</button> 
          }
      </div>
    </header>
  )
}
