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


/* Podemos crear unos helpers que nos ayuden a hacer los tests más legibles y reutilizar código */
const handleGetRequestAndAssertStatus = async (path, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`);
  assert.strictEqual(response.status, expectedStatus);
  
  return response.json();
};

const handlePostRequestAndAssertStatus = async (path, body, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  assert.strictEqual(response.status, expectedStatus);
  
  return response.json();
};

const handlePutRequestAndAssertStatus = async (path, body, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  assert.strictEqual(response.status, expectedStatus);
};

const handlePatchRequestAndAssertStatus = async (path, body, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  assert.strictEqual(response.status, expectedStatus);
};

const handleDeleteRequestAndAssertStatus = async (path, expectedStatus = 200) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
  });
  
  assert.strictEqual(response.status, expectedStatus);
};

describe('Get /jobs', () => {
    test('Debería devolver un array de trabajos', async () => {
        const response = await handleGetRequestAndAssertStatus(`/jobs`)
        
        assert.ok(Array.isArray(response.data), 'La respuesta debe contener un array de trabajos')
    })

    test('Debería filtrar trabajos por tecnología', async () => {
        // Las constantes las podemos pasar a una variable
        const technology = 'react'
        const response = await handleGetRequestAndAssertStatus(`/jobs?technology=${technology}`)
        assert.ok(response.data.every(job => job.data.technology.includes(technology)), 'Todos los trabajos deben incluir la tecnología "react"')
    })

    test('Respetar limite de resultados', async () => {
        const limit = 2
        const json = await handleGetRequestAndAssertStatus(`/jobs?limit=${limit}`)

        assert.strictEqual(json.limit, limit, 'El límite de resultados devuelto debe ser igual al especificado en la consulta')
        assert.strictEqual(json.data.length, limit, 'La cantidad de trabajos devueltos debe ser igual al límite especificado')
    })

    test('Respetar offset de resultados', async () => {
        const offset = 1
        const json = await handleGetRequestAndAssertStatus(`/jobs?offset=${offset}`)
        assert.strictEqual(json.data[0].id, 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57', 'El primer trabajo devuelto debe ser el segundo de la lista original, respetando el offset')

        /* También podemos no depender de un ID escrito a mano, y buscar uno en BBDD. Por si en algún momento cambia */

        // 1. Obtenemos todos los jobs
        const allJobs = await handleGetRequestAndAssertStatus("/jobs", 200);
        
        // 2. Obtenemos el job correspondiente al offset
        const jobAtOffset = allJobs.data[offset];
        
        // 3. Comprobamos que el job obtenido es el mismo que el que se obtiene con el offset
        assert.strictEqual(json.data[0].id, jobAtOffset.id, "El primer trabajo debe ser el segundo de la lista");
    })
})

describe('POST /jobs', () => {
    test('Debería crear un nuevo trabajo con datos válidos', async () => {
        const newJob = { titulo: 'Desarrollador Backend', empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], modalidad: 'full-time', nivel: 'junior' } }
        
      
        const json = await handlePostRequestAndAssertStatus(`/jobs`, newJob, 201)
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
        
        await handlePostRequestAndAssertStatus(`/jobs`, invalidJob, 400)
    })

    test('Debería devolver error 400 para título de más de 100 caracteres', async () => {
        const longTitleJob = { titulo: 'a'.repeat(101), empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }
        
        await handlePostRequestAndAssertStatus(`/jobs`, longTitleJob, 400)
    })

    test('Sin campo titulo', async () => {
        const jobWithoutTitle = { empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }
        
        await handlePostRequestAndAssertStatus(`/jobs`, jobWithoutTitle, 400)
    })

    test('Titulo que no es string', async () => {
        const jobWithInvalidTitle = { titulo: 123, empresa: 'Tech Company', ubicacion: 'Remoto', descripcion: 'Desarrollo de APIs REST', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }
        
        await handlePostRequestAndAssertStatus(`/jobs`, jobWithInvalidTitle, 400)
    })

    test('Sin descripcion', async () => {
        const jobWithoutDescription = { titulo: 'Desarrollador Backend', empresa: 'Tech Company', ubicacion: 'Remoto', data: { technology: ['nodejs'], type: 'full-time', level: 'junior' } }

        await handlePostRequestAndAssertStatus(`/jobs`, jobWithoutDescription, 201)
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

        // Pasamos a una constante el ID que se reutiliza. Además podemos traerlo de jobs si quisiéramos
        const ID = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'

       await handlePutRequestAndAssertStatus(`/jobs/${ID}`, updatedJob, 204)

        // Verificar que el trabajo se actualizó correctamente
        const json = await handleGetRequestAndAssertStatus(`/jobs/${ID}`, 200)
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
        const ID = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'
        await handlePatchRequestAndAssertStatus(`/jobs/${ID}`, partialUpdate, 204)

        // Verificar que el trabajo se actualizó correctamente
        const json = await handleGetRequestAndAssertStatus(`/jobs/${ID}`, 200)
        assert.strictEqual(json.titulo, 'Desarrollador Fullstack')
        assert.strictEqual(json.ubicacion, 'Presencial')
    })

    test('Devolver 404 cuando ID no existe', async () => {
        const partialUpdate = { titulo: 'Desarrollador Fullstack', ubicacion: 'Presencial' }
        await handlePatchRequestAndAssertStatus('/jobs/non-existent-id', partialUpdate, 404)
    })
})

describe('DELETE /jobs/:id', () => {

    test('Debería eliminar un trabajo existente', async () => {
        const ID = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'
        await handleDeleteRequestAndAssertStatus(`/jobs/${ID}`, 204)
        // Verificar que el trabajo se eliminó correctamente
        await handleGetRequestAndAssertStatus(`/jobs/${ID}`, 404)
    })

    test('Devolver 404 cuando ID no existe', async () => {
        await handleDeleteRequestAndAssertStatus('/jobs/non-existent-id', 404)
    })
})