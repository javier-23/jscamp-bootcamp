import crypto from 'node:crypto'
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'
import { db } from '../db/database'

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener todos los resultados, y por cada filtro,
    // debemos agregarlo a la consulta
    // Podemos agregar también el Content que insertamos en la base de datos
     let query = `
      SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies,
        jc.description AS content_description,
        jc.responsibilities, jc.requirements, jc.about
      FROM jobs j
      JOIN job_technologies jt ON j.id = jt.job_id
      LEFT JOIN job_content jc ON j.id = jc.job_id
    `

    // let query = 'SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies FROM jobs j LEFT JOIN job_technologies jt ON j.id = jt.job_id'
    
    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.technology) {
      conditions.push(`j.id IN (SELECT job_id FROM job_technologies WHERE technology = ?)`)
      // conditions.push(`jt.technology = ?`)
      params.push(filters.technology)
    }

    if (filters?.modality) {
      conditions.push(`j.modality = ?`)
      // conditions.push(`modality = ?`)
      params.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push(`j.level = ?`)
      // conditions.push(`level = ?`)
      params.push(filters.level)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ') 
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
        technology: row.technologies.split(','), // SI no existe technology, split devolverá un array vacío
        modality: row.modality,
        level: row.level
      },
      // Agregamos el content
      content: {
        description: row.content_description ?? '',
        responsibilities: row.responsibilities ?? '',
        requirements: row.requirements ?? '',
        about: row.about ?? ''
      }
    }))
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    // TODO: Debemos hacer la consulta a la base de datos para obtener el job por ID
    // Hacemos lo mismo que en el método getAll
     const row = db.prepare(`
      SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies,
        jc.description AS content_description,
        jc.responsibilities, jc.requirements, jc.about
      FROM jobs j
      JOIN job_technologies jt ON j.id = jt.job_id
      LEFT JOIN job_content jc ON j.id = jc.job_id
      WHERE j.id = ?
      GROUP BY j.id
    `).get(id) as any // <- Es mejor hacer un tipado, pero para evitar errores de typescript, usaremos un `any`

    // const row = db.prepare('SELECT j.*, GROUP_CONCAT(jt.technology) as technologies FROM jobs j LEFT JOIN job_technologies jt ON j.id = jt.job_id WHERE j.id = ?').get(id)
    if (!row) return undefined

    return row ? {
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies ? row.technologies.split(',') : [],
        modality: row.modality,
        level: row.level
      }
    } : undefined;
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    // TODO: Debemos insertar el job en la base de datos
    const insertJob = db.prepare('INSERT INTO jobs (id, title, company, location, description, modality, level) VALUES (?, ?, ?, ?, ?, ?, ?)')
    
    const insertTechnology = db.prepare('INSERT INTO job_technologies (technology, job_id) VALUES (?, ?)')

    const transaction = db.transaction(() => {
      insertJob.run(newJob.id, newJob.title, newJob.company, newJob.location, newJob.description, newJob.data.modality, newJob.data.level)
      newJob.data.technology && newJob.data.technology.forEach(tech => {
        insertTechnology.run(tech, newJob.id)
      })
    })

    transaction()
    
    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // TODO: Debemos eliminar el job de la base de datos
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
    return !!result.changes
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    // TODO: Debemos actualizar el job en la base de datos
    const currentJob = await this.getById(id)
    if (!currentJob) return null

    const updatedJobData = {
    ...currentJob,
    ...input,
    data: {
      ...currentJob.data,
      ...input.data,
    },
    // Agregamos el content
    content: input.content ? { ...currentJob.content, ...input.content } : currentJob.content
  }

    const updateJob = db.prepare('UPDATE jobs SET title = ?, company = ?, location = ?, description = ?, modality = ?, level = ? WHERE id = ?')
    
    // Borras las tecnologías anteriores
    const deleteTechnologies = db.prepare('DELETE FROM job_technologies WHERE job_id = ?')
    const updateTechnologies = db.prepare('INSERT INTO job_technologies (technology, job_id) VALUES (?, ?)')
    // Hacemos una actualización de `content` también
    const updateContent = db.prepare(`
          INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            description = excluded.description,
            responsibilities = excluded.responsibilities,
            requirements = excluded.requirements,
            about = excluded.about
        `)
    const transaction = db.transaction(() => {
      updateJob.run(updatedJobData.title, updatedJobData.company, updatedJobData.location, updatedJobData.description, updatedJobData.data?.modality, updatedJobData.data?.level, id)
      
      if(input.data?.technology){
        deleteTechnologies.run(id)
        input.data?.technology.forEach(tech => {
          updateTechnologies.run(tech, id)
        })
      }

      if (updatedJobData.content) {
        updateContent.run(id, id, updatedJobData.content.description, updatedJobData.content.responsibilities, updatedJobData.content.requirements, updatedJobData.content.about)
      }
    })

    transaction()

    const updatedJob = await this.getById(id)

    return updatedJob ?? null
  }
}
