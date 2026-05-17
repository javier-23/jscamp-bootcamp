/* Aquí irá tu código del primer ejercicio */
import Database from 'better-sqlite3'

const db = new Database('jobs.db')

db.pragma('journal_mode = WAL') // Mejora el rendimiento en concurrencia
db.pragma('foreign_keys = ON') // Habilita claves foráneas

export { db }