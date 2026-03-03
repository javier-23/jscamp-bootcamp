/* Aquí debe ir la lógica de tu controlador */
import { JobModel } from "../models/jobs.js";
import { DEFAULTS } from "../config.js";

export class JobController {
    static async getAll(req, res){
        const {text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET} = req.query;
        
        const {paginatedJobs, total, limit: limitNumber, offset: offsetNumber} = await JobModel.getAll({text, title, level, limit, technology, offset});

        return res.json({data: paginatedJobs, total, limit: limitNumber, offset: offsetNumber});
    }

    static async getId(req, res){
        const { id } = req.params;

        const job = await JobModel.getById(id);

        if (!job){
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json({job});
    }

    static async create(req, res){
        const { titulo, empresa, ubicacion, descripcion, data, content } = req.body;

        const newJob = await JobModel.create({ titulo, empresa, ubicacion, descripcion, data, content });

        res.status(201).json(newJob);
    }

    static async update(req, res){
        const { id } = req.params;
        const { titulo, empresa, ubicacion, descripcion, data, content } = req.body;
        
        await JobModel.update(id, { titulo, empresa, ubicacion, descripcion, data, content });

        /* Podemos agregar en la respuesta el job actualizado */
        res.json({ message: 'Job updated successfully', job: { id, titulo, empresa, ubicacion, descripcion, data, content } });
    }

    static async partialUpdate(req, res){
        const { id } = req.params;
        const { titulo, empresa, ubicacion, descripcion, data, content } = req.body;
        await JobModel.partialUpdate(id, { titulo, empresa, ubicacion, descripcion, data, content });

        /* Podemos agregar en la respuesta el job actualizado */
        res.json({ message: 'Job partially updated successfully', job: { id, titulo, empresa, ubicacion, descripcion, data, content } });
    }

    static async delete(req, res){
        const { id } = req.params

        await JobModel.delete(id)

        // Respondemos con 204 (Éxito sin contenido)
        return res.status(204).send()
    }
}