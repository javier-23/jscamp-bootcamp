import jobsData from '../jobs.json' with { type:'json' }
import { randomUUID } from 'crypto';

// Hacer una copia para poder modificarlo
let jobs = [...jobsData];

export class JobModel{
    static async getAll({text, title, level, limit = 10, technology, offset = 0}) {
        let filteredJobs = jobs;

        if (text) {
            const searchTerm = text.toLowerCase()
            filteredJobs = filteredJobs.filter(job => 
                job.titulo?.toLowerCase().includes(searchTerm) ||
                job.descripcion?.toLowerCase().includes(searchTerm)
            );
        }
        if (title) {
            const searchTerm = title.toLowerCase()
            filteredJobs = filteredJobs.filter(job =>
                job.titulo?.toLowerCase().includes(searchTerm)
            );
        }
        if (level) {    
            const searchTerm = level.toLowerCase()
            filteredJobs = filteredJobs.filter(job =>
                job.data?.nivel?.toLowerCase().includes(searchTerm)
            );
        }
        if (technology) {
            const searchTerm = technology.toLowerCase()
            filteredJobs = filteredJobs.filter(job =>
                job.data?.technology?.some(tech => tech.toLowerCase().includes(searchTerm))
            );
        }

        const limitNumber = Number(limit);
        const offsetNumber = Number(offset);

        const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber);
        
        return {paginatedJobs, total: filteredJobs.length, limit: limitNumber, offset: offsetNumber};
    }

    static async getById(id) {
        const job = jobs.find(job => job.id === id);
        return job;
    }

    static async create({ titulo, empresa, ubicacion, descripcion, data, content }) {
        const newJob = {
            id: randomUUID(),
            titulo: titulo,
            empresa: empresa,
            ubicacion: ubicacion,
            descripcion: descripcion,
            data: data,
            content: content
        };
        jobs.push(newJob);
        return newJob;
    }

    static async delete(id) {
        // Filtramos el array para eliminar el elemento
        jobs = jobs.filter(job => job.id !== id)
    }

    static async partialUpdate(id, { title, empresa, ubicaciones, descripcion, data, content }) {
        const jobIndex = jobs.findIndex(job => job.id === id)
        
        if (jobIndex === -1) return res.status(404).json({ message: 'No existe' })

        // Actualizamos
        if (title) jobs[jobIndex].titulo = title
        if (empresa) jobs[jobIndex].empresa = empresa
        if (ubicaciones) jobs[jobIndex].ubicacion = ubicaciones
        if (descripcion) jobs[jobIndex].descripcion = descripcion
        if (data) jobs[jobIndex].data = data
        if (content) jobs[jobIndex].content = content

    }

    static async update(id, { title, empresa, ubicaciones, descripcion, data, content }) {
        const jobIndex = jobs.findIndex(job => job.id === Number(id))
        
        if (jobIndex === -1) return res.status(404).json({ message: 'No existe' })
        
        // Actualizamos
        jobs[jobIndex].titulo = title
        jobs[jobIndex].empresa = empresa
        jobs[jobIndex].ubicacion = ubicaciones
        jobs[jobIndex].descripcion = descripcion
        jobs[jobIndex].data = data
        jobs[jobIndex].content = content
    }

}