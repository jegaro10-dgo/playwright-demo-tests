// Importamos las funciones 'test' y 'expect' de Playwright.
// 'test' define un bloque de prueba y 'expect' se usa para las aserciones.
import { test, expect } from '@playwright/test';

// Definimos un bloque de prueba. El primer argumento es una descripción del test.
test('has title', async ({ page }) => {

  // Navega a la URL de Google.
  await page.goto('https://www.google.com');

  // Espera a que la página se cargue completamente y verifica que el título sea 'Google'.
  // 'expect' es una aserción que detendrá el test si la condición no se cumple.
  await expect(page).toHaveTitle(/Google/);

  // Opcional: Tomamos una captura de pantalla y la guardamos en la carpeta 'test-results/screenshots'.
  // Esto es útil para verificar visualmente que la prueba se ejecutó.
  await page.screenshot({ path: 'test-results/screenshot.png' });
});
