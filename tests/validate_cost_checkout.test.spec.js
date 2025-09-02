import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN ---
const usersToTest = [0, 4];
// --- FIN DE CONFIGURACIÓN ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readAllUsers() {
  const filePath = path.join(__dirname, 'usuarios_registrados.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.trim().split('\n').slice(1);
  const users = [];

  for (const line of lines) {
    const [email, password] = line.split(',');
    users.push({ email, password });
  }

  return users;
}

const allUsers = readAllUsers();

const testUsers = usersToTest.map(index => allUsers[index]).filter(user => user !== undefined);

if (testUsers.length === 0) {
  throw new Error('No se encontraron usuarios válidos para los índices seleccionados.');
}

test.describe('Checkout con usuarios registrados', () => {
  for (const user of testUsers) {
    test(`Completar checkout para el usuario: ${user.email}`, async ({ page }) => {
      console.log(`\n--- Ejecutando test para el usuario: ${user.email} ---`);
      await page.goto('https://demowebshop.tricentis.com/');
      console.log('Paso 1: Navegando a la página principal');
      await page.getByRole('link', { name: 'Log in' }).click();
      console.log('Paso 2: Navegando a la página de login');
      await page.locator('#Email').fill(user.email);
      await page.locator('#Password').fill(user.password);
      await page.getByRole('button', { name: 'Log in' }).click();
      console.log('Paso 3: Login completado.');
      await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
      console.log('Login exitoso.');
      await page.locator('#small-searchterms').fill('Fiction');
      console.log('Paso 4: Agregando producto al buscador');
      await page.getByRole('button', { name: 'Search' }).click();
      await page.getByRole('link', { name: 'Fiction', exact: true }).click();
      console.log('Viendo el detalle del producto');
      const quantityInput = page.locator('#addtocart_45_EnteredQuantity');
      await quantityInput.fill('2');
      console.log('Paso 5: Se ha cambiado la cantidad de producto a 2');
      await page.locator('#add-to-cart-button-45').click();
      console.log('Producto agregado al carrito');
      await expect(page.getByText('The product has been added to your')).toBeVisible();
      console.log('Paso 7: Mensaje de confirmación visible');
      await page.getByRole('link', { name: 'Shopping cart', exact: true }).click();
      console.log('Paso 8: Navegando al carrito de compras');
      await expect(page.locator('.product-name').getByText('Fiction')).toBeVisible();
      console.log('Paso 9: El producto "Fiction" se encuentra en el carrito de compras');
      await page.locator('#termsofservice').check();
      await page.locator('#checkout').click();
      console.log('Paso 10: Iniciando el proceso de pago');
      const billingForm = page.locator('#BillingNewAddress_CountryId');
      try {
        await billingForm.waitFor({ state: 'visible', timeout: 5000 });
        console.log('Detectado: El formulario de facturación está visible. Rellenando datos.');
        await page.locator('#BillingNewAddress_CountryId').selectOption('Mexico');
        await page.locator('#BillingNewAddress_City').fill('Mexico City');
        await page.locator('#BillingNewAddress_Address1').fill('123 Test St');
        await page.locator('#BillingNewAddress_ZipPostalCode').fill('01234');
        await page.locator('#BillingNewAddress_PhoneNumber').fill('555-123-4567');
      } catch (error) {
        console.log('Los datos de facturación ya existen o la página cargó de manera diferente. Continuando.');
      }
      await page.getByRole('button', { name: 'Continue' }).click();
      console.log('Paso 11: Datos de facturación completados.');

      await expect(page.getByRole('button', { name: 'Continue', exact: true })).not.toBeDisabled(); // Método de envío
      console.log('El botón "Continue" está ahora habilitado');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      console.log('Datos de envio completados');
      await page.locator('#shippingoption_0').check();
      console.log('Método de pago seleccionado');
      await expect(page.getByRole('button', { name: 'Continue', exact: true})).not.toBeDisabled(); // Método de pago
      console.log('El botón "Continue" está ahora habilitado');
      await page.getByRole('button', { name: 'Continue', exact: true}).click(); // Información de pago
      console.log('Método de pago completado');
      await expect(page.getByRole('button', { name: 'Continue', exact: true})).not.toBeDisabled(); 
      await page.getByRole('button', { name: 'Continue', exact: true}).click(); 
      console.log('Información de pago completa');
      await expect(page.getByRole('button', { name: 'Continue', exact: true})).not.toBeDisabled(); 
      await page.getByRole('button', { name: 'Continue', exact: true}).click(); 
      console.log('Pasando a la confirmación de la orden');

      // --- CAMBIO CLAVE: VERIFICACIÓN DEL PRECIO TOTAL ---
      console.log('Paso 12: Verificando el precio total.');
      const orderTotalElement = page.locator('.order-total');
      const orderTotalText = await orderTotalElement.textContent();
      
      if (orderTotalText === null) {
      throw new Error('No se pudo encontrar el precio total de la orden.');
}
      
      const orderTotalValue = parseFloat(orderTotalText.replace(/[^0-9.]/g, ''));
      const expectedTotal = 65.00; // Valor esperado basado en el precio del producto y la cantidad
      expect(orderTotalValue).toBe(expectedTotal);
      console.log(`Verificación de precio exitosa. Precio total: ${orderTotalValue}`);
      // --- FIN DE LA VALIDACIÓN ---

      await page.getByRole('button', { name: 'Confirm', exact: true }).click();
      console.log('Paso 13: Confirmación de la orden.');
      await expect(page.getByText('Your order has been successfully processed!')).toBeVisible();
      console.log('¡La compra se ha completado exitosamente!');
    });
  }
});