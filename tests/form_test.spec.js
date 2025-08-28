// Importamos los módulos 'test' y 'expect' de Playwright.
const { test, expect } = require('@playwright/test');

// Definimos la prueba con un nombre claro que describe su propósito.
test('has a functional contact form', async ({ page }) => {

  // Paso 1: Navegamos a la página principal.
  await page.goto('https://www.demoblaze.com/');

  // Paso 2: Hacemos clic en el enlace "Contact".
  // Usamos el rol "link" y el texto para encontrar el elemento.
  await page.getByRole('link', { name: 'Contact' }).click();

  // Paso 3: Esperamos a que el modal del formulario de contacto sea visible.
  // Esto previene errores de tiempo de espera si el modal tarda en cargarse.
  await page.waitForSelector('#exampleModalLabel');

  // Paso 4: Rellenamos los campos del formulario de contacto usando los placeholders correctos.
  await page.locator('#recipient-email').fill('jesus.garcia@gmail.com');
  await page.locator('#recipient-name').fill('Jesús García');
  await page.locator('#message-text').fill('Esto es un mensaje de prueba desde Playwright.');

  // Paso 5: Hacemos clic en el botón "Send message".
  // Usamos el rol "button" y el texto para encontrar el botón.
  await page.getByRole('button', { name: 'Send message' }).click();

  // Paso 6: Manejamos el cuadro de diálogo (alert) de éxito.
  // Playwright tiene una función para escuchar los eventos de diálogo.
  page.on('dialog', async dialog => {
    // Verificamos el texto del cuadro de diálogo.
    expect(dialog.message()).toContain('Thanks for the message!!');
    // Aceptamos el cuadro de diálogo para cerrarlo.
    await dialog.accept();
  });
});
