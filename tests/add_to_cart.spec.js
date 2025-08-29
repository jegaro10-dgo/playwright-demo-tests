// Importamos los módulos 'test' y 'expect' de Playwright.
const { test, expect } = require('@playwright/test');

// Definimos la prueba para el flujo de "Añadir al carrito".
test('adds a product to the cart and verifies it', async ({ page }) => {

  // Paso 1: Navegamos a la página principal del sitio.
  console.log('Paso 1: Navegando a la página principal...');
  await page.goto('https://www.demoblaze.com/');
  console.log('Navegación completada.');

  // Paso 2: Hacemos clic en el primer producto de la lista.
  console.log('Paso 2: Buscando el producto "Samsung galaxy s6" y haciendo clic...');
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();
  console.log('Clic en el producto completado.');

  // Paso 3: Esperamos a que la página del producto se cargue.
  console.log('Esperando a que el botón "Add to cart" esté visible...');
  const addToCartButton = page.getByRole('button', { name: 'Add to cart' });
  await expect(addToCartButton).toBeVisible();

  // Paso 4: Manejamos el cuadro de diálogo (alert) de éxito antes de hacer clic.
  //console.log('Paso 4: Configurando el listener para la alerta...');
  //page.on('dialog', async dialog => {
    // Verificamos el mensaje de éxito de la alerta.
     //await expect(dialog.message()).toContain('Product added.');
    //// Acepta la alerta (simula hacer clic en "OK")
    //await dialog.accept();
    //console.log('Alerta de confirmación aceptada.');
 // });

  // Paso 5: Hacemos clic en el botón "Add to cart".
  console.log('Haciendo clic en el botón "Add to cart"...');
  await addToCartButton.click();

  // Paso 6: Navegamos a la página del carrito.
  console.log('Paso 6: Navegando a la página del carrito...');
  await page.getByRole('link', { name: 'Cart' }).click();
  console.log('Navegación al carrito completada.');

  // Paso 7: Esperamos a que la tabla del carrito sea visible.
  console.log('Paso 7: Esperando a que la tabla del carrito sea visible...');
  await page.waitForSelector('#tbodyid');
  console.log('Tabla del carrito visible.');

  // Paso 8: Verificamos que el producto esté en la tabla del carrito.
  console.log('Paso 8: Verificando que el producto "Samsung galaxy s6" esté en el carrito...');
  await expect(page.getByRole('cell', { name: 'Samsung galaxy s6' })).toBeVisible();
  console.log('Verificación completada. La prueba terminó con éxito.');

});
