/* Aquí va la lógica para filtrar los resultados de búsqueda */

const MAX_RESULTS = 10;

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('empleos-search-input');
  const filterTechnology = document.getElementById('filter-technology')
  const filterLocation = document.getElementById('filter-location')
  const filterExperienceLevel = document.getElementById('filter-experience-level')
  // ----------------------------------------
  // Función con la lógica de los filtros y la búsqueda
  function applyFiltersAndSearch() {
    const jobs = document.querySelectorAll('.job-listing-card');

    // Obtener la búsqueda
    // agregamos .trim() por si el usuario ingresa espacios vacíos
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Obtener los valores de los filtros
    const selectedLocation = filterLocation.value;
    const selectedTechnology = filterTechnology.value;
    const selectedExperienceLevel = filterExperienceLevel.value;

    // Contador de resultados visibles
    let contador = 0;

    jobs.forEach(job => {
        // Titulo del empleo
        const title = job.querySelector('h3').textContent.toLowerCase();

        // Datos del empleo del JSON
        const modalidad = job.dataset.modalidad;

        const technologyString = job.dataset.technology;
        const technologyArray = technologyString ? technologyString.split(',') : []; // 

        const experienceLevel = job.dataset.nivel;

        // Verificar si coincide con la búsqueda
        const matchesSearch = title.includes(searchTerm) || searchTerm === '';

        // Verificar si coincide con los filtros
        const matchesLocation = selectedLocation === '' || modalidad === selectedLocation;
        const matchesTechnology = selectedTechnology === '' || technologyArray.includes(selectedTechnology); 
        const matchesExperienceLevel = selectedExperienceLevel === '' || experienceLevel === selectedExperienceLevel;

        const isShown = matchesSearch && matchesLocation && matchesTechnology && matchesExperienceLevel && (contador < MAX_RESULTS);
        
        if(isShown) {
          contador++;
        }

        job.classList.toggle('is-hidden', !isShown);
    });

    if(contador === 0) {
      document.querySelector('#no-results-message').style.display = 'block';
    } else {
      document.querySelector('#no-results-message').style.display = 'none';
    }
  }

  // ------------------------------------------------
  // Búsqueda

  searchInput.addEventListener('input', applyFiltersAndSearch);


  // ----------------------------------------
  // Filtro de tecnología

  filterTechnology.addEventListener('change', applyFiltersAndSearch);


  // ----------------------------------------
  // Filtro de ubicación

  filterLocation.addEventListener('change', applyFiltersAndSearch);


  // ------------------------------------------------
  // Filtro de nivel de experiencia

  filterExperienceLevel.addEventListener('change', applyFiltersAndSearch);
});