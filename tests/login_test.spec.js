import { test, expect } from '@playwright/test';

test('login in page', async ({ page }) => {

  // Paso 1: Navega a la página principal del sitio
  await page.goto('https://demowebshop.tricentis.com/login');
  console.log('Paso 1: Navegando a la página principal...');

  // Paso 2: Hacer clic en el link de login
  await page.getByRole('link', { name: 'Log in', exact: true }).click();
  console.log('Navegación hacia el formulariio de inicio de sesión.');

  // Paso 3: Rellenar campos de inicio de sesión
  await page.locator('#Email').fill('juanyoung@example.com');
  await page.locator('#Password').fill('ContrasenaSegura123!');
  console.log('Se completan datos de inicion de sesión')
  
  // Paso 4: Damos clic en el botón de inicio de sesión
  await page.getByRole('button', { name: 'Log in' }).click();
  console.log('se da click en el botón log in')

  // Paso 5: Comprabamos que se haya realizado el inicio de sesión
  console.log('Verificando que se muestre el nombre del usuario en la página');
  await expect(page.getByText('juanyoung@example.com')).toBeVisible();
  console.log('¡Test completado exitosamente!');
});


