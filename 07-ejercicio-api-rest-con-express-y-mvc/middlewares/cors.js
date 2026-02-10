import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:1234',
    'http://localhost:3000',
    'https://midu.dev',
    'http://jscamp.dev',
    'http://localhost:5173'
];

// Middleware para habilitar CORS (origenes distintos))
export const corsMiddleware = ({ acceptedOrigin = ACCEPTED_ORIGINS } = {}) => {
    return cors({
        origin: (origin, callback) => { 
        if(acceptedOrigin.includes(origin) || !origin) {
            return callback(null, true);
        }
        return callback(new Error('Origen no permitido por CORS'));
        }
    })
}