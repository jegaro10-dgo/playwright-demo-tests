import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// --- CONFIGURACIÓN ---
// Define los índices de los usuarios que quieres probar (empezando desde 0)
// Ejemplo: [0, 4] para el primer y quinto usuario
// Ejemplo: [0, 1, 2, 3, 4] para los primeros 5 usuarios
const usersToTest = [0, 4]; // Puedes cambiar esto a tu gusto
// --- FIN DE CONFIGURACIÓN ---

// Función para leer todos los usuarios del archivo de texto
function readAllUsers() {
  const filePath = path.join(__dirname, 'usuarios_registrados.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const userBlocks = fileContent.trim().split('--- Usuario Registrado ');
  const users = [];

  for (const block of userBlocks) {
    if (block.trim() === '') continue;

    const lines = block.split('\n').map(line => line.trim());
    
    const emailLine = lines.find(line => line.startsWith('Email:'));
    const passwordLine = lines.find(line => line.startsWith('Contraseña:'));

    if (emailLine && passwordLine) {
      const email = emailLine.split(': ')[1];
      const password = passwordLine.split(': ')[1];
      users.push({ email, password });
    }
  }
  return users;
}

// Leer todos los usuarios del archivo
const allUsers = readAllUsers();

// Filtra solo los usuarios que deseas probar
const testUsers = usersToTest.map(index => allUsers[index]).filter(user => user !== undefined);

// Si no se encuentra ningún usuario, lanzamos un error para detener el script
if (testUsers.length === 0) {
  throw new Error('No se encontraron usuarios válidos para los índices seleccionados.');
}

// Usar un bucle para crear un test para cada usuario seleccionado
for (const user of testUsers) {
  test(`Checkout de compra con usuario: ${user.email}`, async ({ page }) => {
    console.log(`\n--- Ejecutando test para el usuario: ${user.email} ---`);

    // Paso 1: Navegar a la página principal
    await page.goto('https://demowebshop.tricentis.com/');
    console.log('Paso 1: Navegando a la página principal');

    // Paso 2: Navegar a la página de login
    await page.getByRole('link', { name: 'Log in' }).click();
    console.log('Paso 2: Navegando a la página de login');

    // Paso 3: Rellenar el formulario de login y autenticar
    await page.locator('#Email').fill(user.email);
    await page.locator('#Password').fill(user.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    console.log('Paso 3: Login completado.');

    // Verificar que el login fue exitoso
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
    console.log('Login exitoso.');

    // Paso 4: Buscar un producto y hacer click en él
    await page.locator('#small-searchterms').fill('Fiction');
    console.log('Paso 4: Agregando producto al buscador');
    await page.getByRole('button', { name: 'Search' }).click();

    // Vamos al detalle del producto
    await page.getByRole('link', { name: 'Fiction', exact: true }).click();
    console.log('Viendo el detalle del producto');

    // Paso 5: Aumentar la cantidad del producto
    const quantityInput = page.locator('#addtocart_45_EnteredQuantity');
    await quantityInput.fill('2');
    console.log('Paso 5: Se ha cambiado la cantidad de producto a 2');

    // Paso 6: Agregar el producto al carrito
    await page.locator('#add-to-cart-button-45').click();
    console.log('Producto agregado al carrito');

    // Paso 7: Esperar que se muestre la notificación de éxito
    await expect(page.getByText('The product has been added to your')).toBeVisible();
    console.log('Paso 7: Mensaje de confirmación visible');

    // Paso 8: Navegar al carrito de compras
    await page.getByRole('link', { name: 'Shopping cart', exact: true }).click();
    console.log('Paso 8: Navegando al carrito de compras');

    // Paso 9: Verificar que el producto esté en el carrito
    await expect(page.locator('.product-name').getByText('Fiction')).toBeVisible();
    console.log('Paso 9: El producto "Fiction" se encuentra en el carrito de compras');

    // Paso 10: Iniciar el proceso de checkout
    await page.locator('#termsofservice').check();
    await page.locator('#checkout').click();
    console.log('Paso 10: Iniciando el proceso de pago');

    // Pasos de checkout (el usuario ya está logueado)
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.locator('#shippingoption_0').check();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    // Confirmar la orden
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    console.log('Orden confirmada.');

    // Paso 11: Verificar el mensaje de confirmación final
    await expect(page.getByText('Your order has been successfully processed!')).toBeVisible();
    console.log('¡La compra se ha completado exitosamente!');
  });
}