import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Aquí irá el código

// Directorio
const dir = process.argv[2] ?? '.';

const orden = process.argv.find(arg => arg === '--asc' || arg === '--desc') ?? '--asc';
const searchFiles = process.argv.find(arg => arg === '--files') ?? false;
const searchDirs = process.argv.find(arg => arg === '--folders') ?? false;

// Leer nombres del directorio y comprueba si tienes permiso de lectura del directorio
let archivos
try{
    archivos = await readdir(dir);
}catch (error) {
    console.error('ERROR: No tienes permiso de lectura del directorio');
    process.exit(1);
}

// Ordenar los archivos
archivos.sort((a, b) => {
    if (orden === '--desc') {
        return b.localeCompare(a);
    } else {
        return a.localeCompare(b);
    }
});

// Info de cada archivo
const entries = await Promise.all(
    archivos.map(async (archivo) => {
        const ruta = join(dir, archivo);
        const info = await stat(ruta);

        return {
            name: archivo,
            size: info.size/1024, // Convertir a KB
            isDirectory: info.isDirectory(),
        }
    })
);

// Mostrar la información por cada entrada
entries.forEach((entry) => {
    const icon = entry.isDirectory ? '📁' : '📄';
    const size = entry.isDirectory ? ' -' : ` ${entry.size.toFixed(2)} KB`;
    if(entry.isDirectory && searchDirs) {
        console.log(`${icon} ${entry.name.padEnd(20)} ${size}`);
    }
    else if(!entry.isDirectory && searchFiles) {
        console.log(`${icon} ${entry.name.padEnd(20)} ${size}`);
    }
    else if (!searchFiles && !searchDirs) {
        console.log(`${icon} ${entry.name.padEnd(20)} ${size}`);
    }
})
