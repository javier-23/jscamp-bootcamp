import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { json } from 'node:stream/consumers';


process.loadEnvFile()

const port = process.env.PORT || 3000

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

const server = createServer(async(req, res) => {
  // TODO: Aquí irá la lógica del servidor
  const { method, url } = req
  const [pathname, querystring] = url.split('?')

  const searchParams = new URLSearchParams(querystring)

  if (method === 'GET') {
    
    // Obtener todos los usuarios
    if(pathname === '/users') {

      // Filtros de búsqueda
      const name = searchParams.get('name')
      const minAge = searchParams.get('minAge')
      const maxAge = searchParams.get('maxAge')
      // Paginación
      const limit = Number(searchParams.get('limit')) || users.length
      const offset = Number(searchParams.get('offset')) || 0

      let filteredUsers = users

      if(name) {
        filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(name.toLowerCase()))
      }
      if (minAge !== null){
        const minAgeNum = Number(minAge)
        if(!isNaN(minAgeNum)) {
          filteredUsers = filteredUsers.filter(user => user.age >= minAgeNum)
        }
      }
      if(maxAge !== null) {
        const maxAgeNum = Number(maxAge)
        if(!isNaN(maxAgeNum)) {
          filteredUsers = filteredUsers.filter(user => user.age <= maxAgeNum)
        }
      }

      const paginatedAndFilteredUsers = filteredUsers.slice(offset, offset + limit)

      return sendJson(res, 200, paginatedAndFilteredUsers)
    }

    // Health check
    if(pathname === '/health') {
      return sendJson(res, 200, { status: 'ok', uptime: process.uptime() })
    }
  
  }
  else if (method === 'POST') {
    
    // Crear un nuevo usuario
    if(pathname === '/users') {
      const body = await json(req)
      
      if(!body.name || !body.age) {
        return sendJson(res, 400, { error: 'El nombre y la edad son requeridos' })
      }

      const newUser = {
        id: randomUUID(),
        name: body.name,
        age: body.age,
      }

      users.push(newUser)
      return sendJson(res, 201, newUser)
    }
  }

  // Manejo de rutas no encontradas
  return sendJson(res, 404, { error: 'Ruta no encontrada' })

})

server.listen(port, () => {
  const address = server.address()
  console.log(`Servidor escuchando en http://localhost:${address.port}`)
})

const users = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Miguel',
    age: 28,
  },
  {
    id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b',
    name: 'Mateo',
    age: 34,
  },
  {
    id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
    name: 'Pablo',
    age: 22,
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
    name: 'Lucía',
    age: 31,
  },
  {
    id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e',
    name: 'Ana',
    age: 26,
  },
  {
    id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a',
    name: 'Juan',
    age: 29,
  },
  {
    id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d',
    name: 'Sofía',
    age: 25,
  },
  {
    id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
    name: 'Carlos',
    age: 37,
  },
  {
    id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f',
    name: 'Elena',
    age: 23,
  },
  {
    id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b',
    name: 'Diego',
    age: 30,
  },
]