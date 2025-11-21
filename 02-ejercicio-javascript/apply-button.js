/* Aquí va la lógica para dar funcionalidad al botón de "Aplicar" */
const jobsListingSection = document.querySelector('.jobs-listings');

jobsListingSection?.addEventListener('click', (event) => {
    const elemento = event.target;

    if(elemento.classList.contains('button-apply-job')){
        elemento.textContent = '¡Aplicado!';
        elemento.disabled = true; // Deshabilita el botón después de hacer clic
        elemento.classList.add('is-applied'); // Añade una clase para cambiar el estilo
    }
});