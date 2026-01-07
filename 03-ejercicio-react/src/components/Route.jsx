import { useRouter } from '../hooks/useRouter'

export function Route({ path, component: Component }) {
  // Obtener la ruta actual del router
  const { currentPath } = useRouter()

  // Si la ruta no coincide, no renderizar nada
  if (currentPath !== path) {
    return null
  }

  // Si coincide, renderizar el componente
  return <Component />
}