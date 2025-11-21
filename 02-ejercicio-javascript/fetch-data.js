/* Aquí va la lógica para mostrar los resultados de búsqueda */

const container = document.querySelector('.jobs-listings');
const loading = document.querySelector('#jobs-loading')

fetch('./data.json')
  .then((response) => {
    return response.json();
  })
  .then((jobs) => {
    if (loading) 
      loading.remove()

    if (jobs.length === 0) {
      container.innerHTML = '<p>No hay empleos disponibles por ahora.</p>'
      return
    }

    jobs.forEach((job) => {
        const article = document.createElement('article')
        article.className = 'job-listing-card'

        article.dataset.modalidad = job.data.modalidad
        article.dataset.nivel = job.data.nivel
        article.dataset.technology = job.data.technology.join(',')

        article.innerHTML =
            `<div>
                <h3>${job.titulo}</h3>
                <small>${job.empresa} | ${job.ubicacion}</small>
                <p>${job.descripcion}</p>
            </div>
            <button class="button-apply-job">Aplicar</button>`

        container.appendChild(article)
    })
  })
  .catch((error) => {
    if (loading) 
        loading.textContent = 'No se pudieron cargar los empleos'

    console.error(error)
  })