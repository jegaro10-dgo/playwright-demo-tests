// Importamos los módulos 'test' y 'expect' de Playwright.
const { test, expect } = require('@playwright/test');

// Definimos la prueba con un nombre claro que describe su propósito.
test('has a functional contact form', async ({ page }) => {

  // Paso 1: Navegamos a la página que contiene el formulario.
  // En este ejemplo, usaremos un sitio de prueba.
  await page.goto('https://www.demoblaze.com');

  // Paso 2: hacemos clic en el enlace "contact"
  // usamos el rol "link" y el texto para encontrar el elemento
  await page.getByRole('link', { name: 'Contact'}).click();

  // Paso 3: Localizamos los camos del formulario de contacto
  // Playwright esperará automáticamente a que el modal del formulario sea visible
  // Usamos selectores como 'placeholder' para encontrar los elementos.
  // El 'await' es importante para esperar a que la acción se complete.
  await page.getByPlaceholder('Contact Email').fill('jesus.garcia@gmail.com');
  await page.getByPlaceholder('Contac Name').fill('Jesús García Rojas');
  await page.getByPlaceholder('Message').fill('Esto es un mensaje de prueba desde Playwright.');

  // Paso 4: Hacemos clic en el botón para enviar el formulario.
  // Usamos el texto del botón como selector.
  await page.getByRole('button', {name: 'Send message'}).click();

  // Paso 5: Verificamos que se muestre un mensaje de éxito.
  // El 'await expect' es una aserción que verifica que un elemento sea visible.
  // Esto es crucial para confirmar que el formulario se envió correctamente
  page.on('dialog', async dialog => {
    //verificamos el texto del cuadro de dialogo
    expect(dialog.message()).toContain('Thanks for the message!!');
    // Aceptamos el cuadro de diálogo para cerrarlo
    await dialog.accept();
  });
});
