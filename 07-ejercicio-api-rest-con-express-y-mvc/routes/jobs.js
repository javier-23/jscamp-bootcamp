import { Router } from 'express';
import { JobController } from '../controllers/jobs.js';


const jobsRouter = Router();

jobsRouter.get('/', JobController.getAll);
jobsRouter.get('/:id', JobController.getId);

// No es Idempotente
jobsRouter.post('/', JobController.create);
jobsRouter.put('/:id', JobController.update)
// Para actualizaciones parciales
jobsRouter.patch('/:id', JobController.partialUpdate)
jobsRouter.delete('/:id', JobController.delete)

export { jobsRouter }