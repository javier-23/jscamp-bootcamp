/* Aquí irá el código de tu test */

// @ts-check
import { test, expect } from '@playwright/test'

// Segundo ejercicio
test('Test de navegación básica: existe un buscador', async ({ page }) => {
    await page.goto('http://localhost:5173')
    const searchInput = page.getByRole('searchbox')
  
    // verificar que existe un buscador visible
    await expect(searchInput).toBeVisible()
})

// Tercer ejercicio
test('Test de búsqueda de empleos', async ({ page }) => {  
    await page.goto('http://localhost:5173')
    const searchInput = page.getByRole('searchbox')
    
    // Realizar una búsqueda
    await searchInput.fill('react')
    await page.getByRole('button', { name: 'Buscar' }).click()

    // Verificar que aparecen resultados
    const jobCards = page.getByRole('article')
    const total = await jobCards.count()
    await expect(total).toBeGreaterThan(0)

    // Verificar que el primer resultado es visible
    await expect(jobCards.first()).toBeVisible()
})

// Cuarto ejercicio
test('Test para simular flujo completo de usuario aplicando a oferta', async ({ page }) => {
    await page.goto('http://localhost:5173')
    const searchInput = page.getByRole('searchbox')
    
    // Realizar una búsqueda
    await searchInput.fill('JavaScript')
    await page.getByRole('button', { name: 'Buscar' }).click()

    // Verificar que se muestra el detalle del empleo
    const jobCards = page.getByRole('article')
    const firstJobDescription = jobCards.first().getByRole('paragraph')
    await expect(firstJobDescription).toBeVisible()

    // Iniciar sesión
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    // Hacer clic en Aplicar y verificar
    const applyButton = page.getByRole('button', { name: 'Aplicar' }).first()
    await applyButton.click()

    await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible()
})

// Quinto ejercicio
test('Test para verificar filtros de búsqueda', async ({ page }) => {
    await page.goto('http://localhost:5173')
    const searchInput = page.getByRole('searchbox')
    
    // Realizar una búsqueda
    await searchInput.fill('Python')
    await page.getByRole('button', { name: 'Buscar' }).click()
    
    // Aplicar filtro de ubicacion
    // Aquí lo que podemos hacer es buscar por rol y aria-label, para tener una mejor accesibilidad y control en el test (además de que es una mejor práctica que usar solo el ID)
    // await page.getByRole('combobox', { name: 'Ubicación' }).selectOption('Remoto')
    await page.locator('#filter-location').selectOption('Remoto')
    const jobCards = page.getByRole('article')
    
    // Verificar que todos los resultados tienen el filtro aplicado
    const jobCount = await jobCards.count()
    for (let i = 0; i < jobCount; i++) {
        await expect(jobCards.nth(i)).toHaveAttribute('data-modalidad', 'Remoto')
    }

    // Aplicar filtro nivel
    await page.locator('#filter-experience-level').selectOption('Senior')
    for (let i = 0; i < jobCount; i++) {
        await expect(jobCards.nth(i)).toHaveAttribute('data-nivel', 'Senior')
    }

})

// Sexto ejercicio
test('Test de paginación', async ({ page }) => {
    await page.goto('http://localhost:5173')
    const searchInput = page.getByRole('searchbox')
    
    // Realizar una búsqueda
    await searchInput.fill('desarrollador')
    await page.getByRole('button', { name: 'Buscar' }).click()

    // Verificar que aparezca el componente de paginación
    // Podemos hacer una busqueda por role navigation
    // const pagination = page.getByRole('navigation', { name: 'Paginación principal' })
    const pagination = page.locator('#pagination')
    await expect(pagination).toBeVisible()

    // Navegar a la siguiente pagina
    const nextButton = pagination.getByRole('link', { name: 'Siguiente' })
    await nextButton.click()
})

// Séptimo ejercicio
test('Test para verificar el detalle de un empleo', async ({ page }) => {
    await page.goto('http://localhost:5173')
    const searchInput = page.getByRole('searchbox')

    // Buscar
    await searchInput.fill('Backend')
    await page.getByRole('button', { name: 'Buscar' }).click()

    // Hacer clic en el primer resultado
    const jobCards = page.getByRole('article')
    await jobCards.first().click()

    // Verificar que se muestra la pagina al hacer clic
    const jobTitle = page.getByRole('heading', { level: 2 })
    await expect(jobTitle.first()).toHaveText('Descripción del puesto')

    // Verificar que se puede aplicar a un empleo
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    // Hacer clic en Aplicar y verificar
    const applyButton = page.getByRole('button', { name: 'Aplicar' }).first()
    await applyButton.click()

    await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible()
})
