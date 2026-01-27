# Aquí puedes dejar tus dudas

Muchas gracias por tus comentarios! Se agradece que expliques los cambios y el motivo de estos, así aprendo y mejoro.

Tenía una duda con el archivo SearchFormSection.jsx, y es que tengo dos handleReset (uno en el componente y otro en el custom hook) y no entiendo muy bien que diferencia hay entre tenerlo cada uno en un sitio si además parece que hacen cosas parecidas o alomejor se puede simplificar, no lo tengo claro. 

Por si podríais explicármelo, gracias!

---

### Respuesta

Hola crack! Es verdad, y estas son las cosas que pueden ser muy buenas o muy malas en React, el uso de handlers que pueden ser muy parecidos. Revisé esa parte con más detalle y es mejor poder simplificarlo para que la responsabilidad sea clara y no hayan dos cosas parecidas en el mismo lugar.

Lo que hice fue centralizar la lógica de los filtros exclusivamente en el custom hook `useFilters`. Creo que tiene todo el sentido para no separar responsabilidades en lugares distintos. Y luego, pasar por `props` a `SearchFormSection` solo las cosas que realmente son responsabilidad del componente, como hacer el submit del formulario.No importa que se haga cuando hagamos submit, solo importa que se pueda hacer submit, lo que pase luego es responsabilidad del `Search.jsx` (quien maneja la lógica con su hook).

Hice otros cambios para que el feedback sea mas rico en información y maneras de hacer las cosas. Espero que no sea mucha carga, si tienes dudas también me puedes escribir por discord y tenemos una llamada para hacerlo más didáctico (madeval o Madeval#7117).

## Primera parte

<!-- Dudas de la primera parte del ejercicio -->

## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->

## Tercera parte

<!-- Dudas de la tercera parte del ejercicio -->

## Cuarta parte

<!-- Dudas de la cuarta parte del ejercicio -->

## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->

## Sexta parte

<!-- Dudas de la sexta parte del ejercicio -->

## Séptima parte

<!-- Dudas de la séptima parte del ejercicio -->

## Ejercicio extra

<!-- Dudas del ejercicio extra -->
