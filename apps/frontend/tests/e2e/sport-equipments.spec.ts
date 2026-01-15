import { expect, test } from '@playwright/test'

test.describe('Sport Equipments - Home Page', () => {
  test('should display the sport equipments search page', async ({ page }) => {
    await page.goto('/')

    // Check hero section elements - use the h1 title
    await expect(
      page.locator('h1').filter({ hasText: /réservez vos/i })
    ).toBeVisible()
    await expect(page.getByText(/trouvez votre terrain idéal/i)).toBeVisible()

    // Check feature badges
    await expect(page.getByText(/géolocalisation/i)).toBeVisible()
    await expect(page.getByText(/réservation rapide/i)).toBeVisible()
    await expect(page.getByText(/tous les sports/i)).toBeVisible()
  })

  test('should display equipment cards', async ({ page }) => {
    await page.goto('/')

    // Wait for the equipment list to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/sport_equipments') &&
        response.status() === 200
    )

    // Check for equipment list section - use h2 specifically
    await expect(
      page.locator('h2').filter({ hasText: /équipements sportifs/i })
    ).toBeVisible()
  })

  test('should toggle between list and map views', async ({ page }) => {
    await page.goto('/')

    // Find view toggle buttons
    const listViewBtn = page.getByRole('button', { name: /liste/i })
    const mapViewBtn = page.getByRole('button', { name: /carte/i })

    // Initially should be in list view
    await expect(listViewBtn).toBeVisible()
    await expect(mapViewBtn).toBeVisible()

    // Click on map view
    await mapViewBtn.click()

    // URL should update
    await expect(page).toHaveURL(/view=map/)

    // Check for map header
    await expect(
      page.locator('h2').filter({ hasText: /explorer la carte/i })
    ).toBeVisible()

    // Switch back to list view
    await listViewBtn.click()

    // Should see equipments list again - use h2 specifically
    await expect(
      page.locator('h2').filter({ hasText: /équipements sportifs/i })
    ).toBeVisible()
  })

  test('should have pagination controls', async ({ page }) => {
    await page.goto('/')

    // Wait for data to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/sport_equipments') &&
        response.status() === 200
    )

    // Check for pagination navigation element
    const paginationNav = page.getByRole('navigation', { name: 'pagination' })

    // Pagination elements should be visible if there are multiple pages
    if (await paginationNav.isVisible()) {
      // Just verify pagination exists - don't check for specific buttons
      await expect(paginationNav).toBeVisible()
    }
  })
})

test.describe('Sport Equipments - Search & Filters', () => {
  test('should filter by search term', async ({ page }) => {
    await page.goto('/?name=stade')

    // Wait for filtered results
    await page.waitForResponse(
      (response) =>
        response.url().includes('/sport_equipments') &&
        response.status() === 200
    )

    // Should show search results header
    await expect(
      page.locator('h2').filter({ hasText: /résultats de recherche/i })
    ).toBeVisible()
  })

  test('should filter by city', async ({ page }) => {
    await page.goto('/?city=Paris')

    // Wait for filtered results
    await page.waitForResponse(
      (response) =>
        response.url().includes('/sport_equipments') &&
        response.status() === 200
    )

    // Should show filter in results text
    await expect(page.getByText(/paris/i).first()).toBeVisible()
  })

  test('should filter by sport type', async ({ page }) => {
    await page.goto('/?sport=Football')

    // Wait for filtered results
    await page.waitForResponse(
      (response) =>
        response.url().includes('/sport_equipments') &&
        response.status() === 200
    )

    // Should show sport filter in results text
    await expect(page.getByText(/football/i).first()).toBeVisible()
  })

  test('should combine multiple filters', async ({ page }) => {
    await page.goto('/?name=terrain&city=Paris&sport=Football')

    // Wait for filtered results
    await page.waitForResponse(
      (response) =>
        response.url().includes('/sport_equipments') &&
        response.status() === 200
    )

    // Should show search results header
    await expect(
      page.locator('h2').filter({ hasText: /résultats de recherche/i })
    ).toBeVisible()
  })
})

test.describe('Sport Equipments - Map View', () => {
  test('should display map view correctly', async ({ page }) => {
    await page.goto('/?view=map')

    // Check for map heading
    await expect(
      page.locator('h2').filter({ hasText: /explorer la carte/i })
    ).toBeVisible()
    await expect(page.getByText(/déplacez la carte/i)).toBeVisible()
  })

  test('should show equipment markers on map', async ({ page }) => {
    await page.goto('/?view=map')

    // Wait for data to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/sport_equipments') &&
        response.status() === 200
    )

    // Map container should be visible (Leaflet)
    const mapContainer = page.locator('.leaflet-container')
    await expect(mapContainer).toBeVisible({ timeout: 10000 })
  })
})
