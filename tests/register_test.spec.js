import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('user registration with random data', async ({ page }) => {

  // Generar datos aleatorios con Faker.js
  const randomFirstName = faker.person.firstName();
  const randomLastName = faker.person.lastName();
  const randomEmail = faker.internet.email();
  const password = 'Password123!';

  console.log(`Registrando nuevo usuario con:
    Nombre: ${randomFirstName} ${randomLastName}
    Email: ${randomEmail}`);

  // Paso 1: Navegar a la página de registro
  await page.goto('https://demowebshop.tricentis.com/register');
  console.log('Paso 1: Navegando a la página de registro...');

  // Paso 2: Seleccionar el género (opcional, si existe)
  await page.locator('#gender-male').check();
  console.log('Paso 2: Seleccionando género...');

  // Paso 3: Rellenar los campos con datos aleatorios
  await page.locator('#FirstName').fill(randomFirstName);
  await page.locator('#LastName').fill(randomLastName);
  await page.locator('#Email').fill(randomEmail);
  await page.locator('#Password').fill(password);
  await page.locator('#ConfirmPassword').fill(password);
  console.log('Paso 3: Rellenando formulario con datos aleatorios...');

  // Paso 4: Hacer clic en el botón de registro
  await page.getByRole('button', { name: 'Register' }).click();
  console.log('Paso 4: Haciendo clic en el botón de registro...');

  // Paso 5: Verificar que el registro fue exitoso
  // Buscamos un mensaje de confirmación en la página.
  await expect(page.getByText('Your registration completed')).toBeVisible();
  console.log('Paso 5: Verificando mensaje de registro exitoso...');

  // Paso 6: Cerrar sesión para limpiar el estado
  await page.getByRole('link', { name: 'Log out' }).click();
  console.log('Paso 6: Cerrando sesión...');
  
  console.log('¡Prueba de registro completada exitosamente!');
});
