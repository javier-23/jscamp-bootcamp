import { useRef } from 'react'

export function useDebounce(callback, delay) {
  const timeoutRef = useRef(null)

  return (value) => {
    // Si ya hay un timeout pendiente, lo cancelamos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Creamos un nuevo timeout que ejecutará el callback después del delay
    timeoutRef.current = setTimeout(() => {
      callback(value)
    }, delay)
  }
}
