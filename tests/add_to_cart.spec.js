// En tu archivo de prueba (ej: tests/add_to_cart.spec.js)
import { test, expect } from '@playwright/test';

test('adds a product to the cart and verifies it', async ({ page }) => {

  // Paso 1: Navega a la página principal del sitio
  await page.goto('https://www.demoblaze.com');
  console.log('Paso 1: Navegando a la página principal...');

  // Paso 2: Localiza y haz clic en el producto "Samsung galaxy s6"
  console.log('Paso 2: Buscando el producto "Samsung galaxy s6" y haciendo clic...');
  // Usamos getByRole('link', ...) para ser específicos y evitar el "strict mode violation".
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

  // Paso 3: Espera explícitamente a que la URL de la página del producto cargue
  // Esto asegura que Playwright no intente buscar el botón antes de que la página haya cambiado.
  console.log('Paso 3: Esperando a que la página del producto cargue...');
  await page.waitForURL('**/prod.html*');
  
  // Paso 4: Localiza el botón "Add to cart" con un selector más robusto
  console.log('Paso 4: Buscando el botón "Add to cart"...');
  const addToCartButton = page.locator('#tbodyid >> text=Add to cart');

  // Aseguramos que el botón es visible antes de interactuar con él
  await expect(addToCartButton).toBeVisible();
  console.log('Botón "Add to cart" visible y listo para interactuar.');

  // Paso 5: Configura el listener para la alerta antes de hacer clic.
  page.on('dialog', async dialog => {
    // Verifica que el mensaje de la alerta sea el esperado
    await expect(dialog.message()).toContain('Product added');
    // Acepta la alerta (simula hacer clic en "OK")
    await dialog.accept();
    console.log('Alerta de confirmación aceptada.');
  });

  // Paso 6: Haz clic en el botón "Add to cart"
  await addToCartButton.click();
  console.log('Clic en "Add to cart" completado.');

  // Paso 7: Navega a la página del carrito
  console.log('Paso 7: Navegando a la página del carrito...');
  // La corrección clave: Usamos { exact: true } para asegurarnos de que solo se selecciona el enlace 'Cart' y no 'Add to cart'.
  await page.getByRole('link', { name: 'Cart', exact: true }).click();
  console.log('Navegación al carrito completada.');

  // Paso 8: Verifica que el producto "Samsung galaxy s6" esté en el carrito
  console.log('Paso 8: Verificando que el producto esté en el carrito...');
  const cartTable = page.locator('#tbodyid');
  await expect(cartTable.getByRole('cell', { name: 'Samsung galaxy s6' })).toBeVisible();
  console.log('¡Test completado exitosamente!');
});
