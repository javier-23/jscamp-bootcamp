import crypto from 'node:crypto'
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'
import { db } from '../db/database'

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener todos los resultados, y por cada filtro,
    // debemos agregarlo a la consulta
    let query = 'SELECT j.*, FROM jobs j LEFT JOIN job_technologies jt ON j.id = jt.job_id'
    
    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.tech) {
      conditions.push(`jt.technology = ?`)
      params.push(filters.tech)
    }

    if (filters?.modality) {
      conditions.push(`jt.modality = ?`)
      params.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push(`jt.level = ?`)
      params.push(filters.level)
    }

    if (conditions.length > 0) {
      query += 'WHERE ' + conditions.join(' AND ') 
    }

    query += ' GROUP BY j.id'

    const rows = db.prepare(query).all(...params)

    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technology.split(','),
        modality: row.modality,
        level: row.level
      }
    }))
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener el job por ID
    return undefined
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    // TODO: Debemos insertar el job en la base de datos
    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // TODO: Debemos eliminar el job de la base de datos
    return false
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    // TODO: Debemos actualizar el job en la base de datos
    return null
  }
}
