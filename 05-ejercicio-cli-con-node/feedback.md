## Aquí irá el feedback del ejercicio

Hola crack! Muy buen trabajo! Felicidades por tu ejercicio :)
Hemos dejado algunos comentarios en el código, cualquier duda nos la puedes decir si?

Agregamos algunas validaciones sobre permisos. Node por defecto (al menos por el momento), para que pueda validad por permisos del usuario, debemos usar el flag `--permission`, acompañado del flag del permiso que queremos validar. Por ejemplo: `node --permission --allow-fs-read=[directorio_a_leer] cli.js [directorio_a_leer]`