import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Aquí irá el código

// Directorio
const dir = process.argv[2] ?? '.';

const orden = process.argv.find(arg => arg === '--asc' || arg === '--desc') ?? '--asc';
const searchFiles = process.argv.find(arg => arg === '--files') ?? false;
const searchDirs = process.argv.find(arg => arg === '--folders') ?? false;

/* La manera de revisar si el usuario tiene permisos de lectura es a partir de la propiedad `permission` del objeto `process` */
if (!process.permission){
  console.log('[ERROR]: Los permisos deben ser activados\nuse el flag [--permission]') // <- Podemos dejar un mensaje más descriptivo
  process.exit(1)
}

/* Y ahora que el usuario agregó el flag de permisos, debemos revisar que el usuario le haya dado permisos de lectura al directorio al cual queremos acceder */
if (!process.permission.has('fs.read', dir)) {
  console.log(`[ERROR]: Permiso denegado, use el flag [--permission --allow-fs-read=[directorio_a_leer]] \nPor ejemplo: [node --permission --allow-fs-read=${dir} cli.js ${dir}]`)
  process.exit(1)
}

// Leer nombres del directorio y comprueba si tienes permiso de lectura del directorio
let archivos
try{
    archivos = await readdir(dir);
}catch (error) {
    // Si falla reddir, no será por un error de permisos (eso lo evaluamos antes), sino porque el directorio no existe
    console.error(`ERROR: No se pudo leer el directorio ${dir}`);
    process.exit(1);}

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
    
    // Si tenemos muchos `if` que devuelven lo mismo, podemos simplificarlo de esta manera
    const shouldShow = (!searchFiles && !searchDirs) || 
                       (entry.isDirectory && searchDirs) || 
                       (!entry.isDirectory && searchFiles);
    
    if (shouldShow) {
        console.log(`${icon} ${entry.name.padEnd(20)} ${size}`);
    }
})
