/*
 * Aquí debes crear el schema de validación con Zod para los jobs
 *
 * Recuerda:
 * - Importar zod
 * - Crear un schema que valide la estructura de un job
 * - Exportar funciones validateJob() y validatePartialJob()
 * - Usar safeParse() para validar sin lanzar excepciones
 * - Definir reglas de validación (min, max, required, optional, etc.)
 */

import { z } from 'zod';

const jobSchema = z.object({
    titulo: z.string({error: 'El título es obligatorio'})
             .min(3, 'El título debe tener al menos 3 caracteres')
             .max(100, 'El título no puede tener más de 100 caracteres'),
    empresa: z.string({error: 'La empresa es obligatoria'}),
    ubicacion: z.string({error: 'La ubicación es obligatoria'}),
    descripcion: z.string().optional(),
    content: z.string().optional(),
    data: z.object({
        technology: z.array(z.string()),
        modalidad: z.string().optional(),
        nivel: z.string().optional(),
    })
});

export function validateJob(input) {
    return jobSchema.safeParse(input);
}

export function validatePartialJob(input) {
    return jobSchema.partial().safeParse(input);
}
