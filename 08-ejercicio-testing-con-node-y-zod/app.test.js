/*
 * Aquí debes escribir tus tests para la API de jobs
 *
 * Recuerda:
 * - Usar node:test y node:assert (sin dependencias externas)
 * - Levantar el servidor con before() y cerrarlo con after()
 * - Testear todos los endpoints: GET, POST, PUT, PATCH, DELETE
 * - Verificar validaciones con Zod
 * - Comprobar códigos de estado HTTP correctos
 */
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import app from './app.js';

let server
const PORT = 5678
const BASE_URL = `http://localhost:${PORT}`

before( async () => {
    return new Promise((resolve, reject) => {
        server = app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`)
            resolve()
        })
        server.on('error', reject)
    })
});

after( async () => {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) return reject(err)
            else resolve()
        })
    })
});

describe('Get /jobs', () => {
    test('Debería devolver un array de trabajos', async () => {
        const response = await fetch(`${BASE_URL}/jobs`)
        
        assert.strictEqual(response.status, 200)
        const json = await response.json()
        assert.ok(Array.isArray(json.data), 'La respuesta debe contener un array de trabajos')
    })

    test('Debería filtrar trabajos por tecnología', async () => {
        const response = await fetch(`${BASE_URL}/jobs?technology=react`)
        const json = await response.json()
        assert.ok(json.data.every(job => job.data.technology.includes('react')), 'Todos los trabajos deben incluir la tecnología "react"')
    })

    test('Respetar limite de resultados', async () => {
        const response = await fetch(`${BASE_URL}/jobs?limit=2`)
        const json = await response.json()
        assert.strictEqual(json.limit, 2, 'El límite de resultados devuelto debe ser igual al especificado en la consulta')
        assert.strictEqual(json.data.length, 2, 'La cantidad de trabajos devueltos debe ser igual al límite especificado')
    })

    test('Respetar offset de resultados', async () => {
        const response = await fetch(`${BASE_URL}/jobs?offset=1`)
        const json = await response.json()
        assert.strictEqual(json.data[0].id, 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57', 'El primer trabajo devuelto debe ser el segundo de la lista original, respetando el offset')
    })
})

describe('POST /jobs', () => {
    test('Debería crear un nuevo trabajo con datos válidos', async () => {
        const newJob = { titulo: 'Desarrollador Backend', empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], modalidad: 'full-time', nivel: 'junior' } }
        
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newJob)
        })

        assert.strictEqual(response.status, 201)
        const json = await response.json()
        assert.ok(json.id, 'El nuevo trabajo debe tener un ID generado')
        // Verificar que los datos coinciden con lo enviado
        assert.strictEqual(json.titulo, newJob.titulo)
        assert.strictEqual(json.empresa, newJob.empresa)
        assert.strictEqual(json.ubicacion, newJob.ubicacion)
        assert.strictEqual(json.descripcion, newJob.descripcion)
        assert.deepStrictEqual(json.data, newJob.data)
    })
    
    test('Debería devolver error 400 para datos inválidos', async () => {
        const invalidJob = { titulo: 'ab', empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }
        
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invalidJob)
        })
        assert.strictEqual(response.status, 400)
    })

    test('Debería devolver error 400 para título de más de 100 caracteres', async () => {
        const longTitleJob = { titulo: 'a'.repeat(101), empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }
        
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(longTitleJob)
        })
        assert.strictEqual(response.status, 400)
    })

    test('Sin campo titulo', async () => {
        const jobWithoutTitle = { empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }
        
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobWithoutTitle)
        })
        assert.strictEqual(response.status, 400)
    })

    test('Titulo que no es string', async () => {
        const jobWithInvalidTitle = { titulo: 123, empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }
        
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobWithInvalidTitle)
        })
        assert.strictEqual(response.status, 400)
    })

    test('Sin descripcion', async () => {
        const jobWithoutDescription = { titulo: 'Desarrollador Backend', empresa: 'Tech Company', ubicacion: 'Remoto', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }

        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobWithoutDescription)
        })
        assert.strictEqual(response.status, 201)
    })
})

describe('GET /jobs/:id', () => {
    
    test('Debería devolver un trabajo existente por ID', async () => {
        const response = await fetch(`${BASE_URL}/jobs/d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57`)
        assert.strictEqual(response.status, 200)
        const json = await response.json()
        assert.strictEqual(json.id, 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57')
    })

    test('Debería devolver error 404 para ID no existente', async () => {
        const response = await fetch(`${BASE_URL}/jobs/non-existent-id`)
        assert.strictEqual(response.status, 404)
    })  
})

describe('PUT /jobs/:id', () => {

    test('Debería actualizar completamente un trabajo existente', async () => {
        const updatedJob = { titulo: 'Desarrollador Frontend', empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de interfaces web', data: { technology: ['react'], type: 'full-time', level: 'junior' } }
        const response = await fetch(`${BASE_URL}/jobs/d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedJob)
        })
        assert.strictEqual(response.status, 204)

        // Verificar que el trabajo se actualizó correctamente
        const getResponse = await fetch(`${BASE_URL}/jobs/d35b2c89-5d60-4f26-b19a-6cfb2f1a0f57`)
        const json = await getResponse.json()
        assert.strictEqual(json.titulo, 'Desarrollador Frontend')
    })

    test('Devolver 404 cuando ID no existe', async () => {
        const updatedJob = { titulo: 'Desarrollador Frontend', empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de interfaces web', data: { technology: ['react'], type: 'full-time', level: 'junior' } }
        const response = await fetch(`${BASE_URL}/jobs/non-existent-id`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedJob)
        })
        assert.strictEqual(response.status, 404)
    })
})

describe('PATCH /jobs/:id', () => {

    test('Debería actualizar parcialmente un trabajo existente', async () => {
        const partialUpdate = { titulo: 'Desarrollador Fullstack', ubicacion: 'Presencial' }
        const response = await fetch(`${BASE_URL}/jobs/f62d8a34-923a-4ac2-9b0b-14e0ac2f5405`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialUpdate)
        })
        assert.strictEqual(response.status, 204)
        // Verificar que el trabajo se actualizó correctamente
        const getResponse = await fetch(`${BASE_URL}/jobs/f62d8a34-923a-4ac2-9b0b-14e0ac2f5405`)
        const json = await getResponse.json()
        assert.strictEqual(json.titulo, 'Desarrollador Fullstack')
        assert.strictEqual(json.ubicacion, 'Presencial')
    })

    test('Devolver 404 cuando ID no existe', async () => {
        const partialUpdate = { titulo: 'Desarrollador Fullstack', ubicacion: 'Presencial' }
        const response = await fetch(`${BASE_URL}/jobs/non-existent-id`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partialUpdate)
        })
        assert.strictEqual(response.status, 404)
    })
})

describe('DELETE /jobs/:id', () => {

    test('Debería eliminar un trabajo existente', async () => {
        const response = await fetch(`${BASE_URL}/jobs/f62d8a34-923a-4ac2-9b0b-14e0ac2f5405`, {
            method: 'DELETE'
        })
        assert.strictEqual(response.status, 204)
        // Verificar que el trabajo se eliminó correctamente
        const getResponse = await fetch(`${BASE_URL}/jobs/f62d8a34-923a-4ac2-9b0b-14e0ac2f5405`)
        assert.strictEqual(getResponse.status, 404)
    })

    test('Devolver 404 cuando ID no existe', async () => {
        const response = await fetch(`${BASE_URL}/jobs/non-existent-id`, {
            method: 'DELETE'
        })
        assert.strictEqual(response.status, 404)
    })
})