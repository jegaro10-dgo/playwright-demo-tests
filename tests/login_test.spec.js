import { test, expect } from '@playwright/test';
import fs from 'fs/promises';

/**
 * Lee el archivo de usuarios y devuelve los datos del usuario especificado.
 * @param {number} registrationNumber El número de registro del usuario que deseas obtener.
 * @returns {Promise<{email: string, password: string}|null>}
 */
async function getUserByRegistrationNumber(registrationNumber) {
  try {
    const fileContent = await fs.readFile('usuarios_registrados.txt', 'utf-8');
    // Usar una expresión regular para encontrar el bloque de texto del usuario
    const userEntryRegex = new RegExp(`--- Usuario Registrado ${registrationNumber} ---(.*?)-+`, 's');
    const userEntryMatch = fileContent.match(userEntryRegex);

    if (!userEntryMatch || userEntryMatch.length < 2) {
      throw new Error(`No se encontró el usuario con el número de registro ${registrationNumber}.`);
    }

    const userEntry = userEntryMatch[1];

    // Extraer email y contraseña con expresiones regulares
    const emailMatch = userEntry.match(/Email: (.*)/);
    const passwordMatch = userEntry.match(/Contraseña: (.*)/);

    const email = emailMatch ? emailMatch[1].trim() : null;
    const password = passwordMatch ? passwordMatch[1].trim() : null;

    if (!email || !password) {
      throw new Error('No se pudo encontrar el email o la contraseña en la entrada del usuario.');
    }

    return { email, password };

  } catch (error) {
    console.error('Error al leer o procesar el archivo de usuarios:', error);
    return null;
  }
}

// Ahora, en tu prueba, puedes especificar qué usuario quieres usar.
test('login with a specific user from file', async ({ page }) => {

  // CAMBIA ESTE NÚMERO para seleccionar el usuario que quieres usar.
  // Por ejemplo, 1, 2, 3, etc.
  const userToUse = 10;

  // Paso 1: Leer los datos del usuario desde el archivo
  const userData = await getUserByRegistrationNumber(userToUse);
  if (!userData) {
    test.skip(); // Si no hay datos, saltamos la prueba
    return;
  }

  console.log(`Usando los datos del usuario #${userToUse} para iniciar sesión:
    Email: ${userData.email}
    Contraseña: ${userData.password}`);

  // Paso 1: Navega a la página principal del sitio
  await page.goto('https://demowebshop.tricentis.com/login');
  console.log('Paso 1: Navegando a la página principal...');

  // Paso 2: Hacer clic en el link de login
  await page.getByRole('link', { name: 'Log in', exact: true }).click();
  console.log('Navegación hacia el formulario de inicio de sesión.');

  // Paso 3: Rellenar campos de inicio de sesión
  await page.locator('#Email').fill(userData.email);
  await page.locator('#Password').fill(userData.password);
  console.log('Se completan datos de inicion de sesión')
  
  // Paso 4: Damos clic en el botón de inicio de sesión
  await page.getByRole('button', { name: 'Log in' }).click();
  console.log('se da click en el botón log in')

  // Paso 5: Comprabamos que se haya realizado el inicio de sesión
  console.log('Verificando que se muestre el nombre del usuario en la página');
  await expect(page.getByText(userData.email)).toBeVisible();
  console.log('¡Test completado exitosamente!');
});