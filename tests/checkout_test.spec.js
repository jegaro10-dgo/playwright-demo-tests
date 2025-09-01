const { expect } = require("@playwright/test");

impor { test, expect } from '@playwright/test';

test('addds a product to the cart and complete checkout', async ({ page }) => { 
    // paso 1: navegar a l página principal
    await page.goto('https://demowebshop.tricentis.com/');
    console.log('paso 1: navegando a la página principal');

    // paso 2: Buscar un producto y hacer click en él
    // bucaremos el libnro "fiction"
    await page.getByRole('link', {name: 'Fiction'}).click();
    console.log('Paso 2: Navegando a la página del producto "Fiction"');

    // paso 3: aumentar la cantidad del producto
    const quantityInput = page.locatr('#addtocart_45_EnteredQuantity');
    await quantityInput.fill('2');  //aumentamos la cantidad a 2 unidades
    console.log('Paso 3: Se ha cambiado la cantidad de producto a 2');

    // Paso 4: Agregar el producto al carrito
    await page.getByRole('add-to-cart-button-45').click();
    console.log('Producto agregado al carrito');

    // Paso 5: Esperar que se muestre notificación de éxito
    await expect(page.getByText('The product has been added to your')).toBeVisible();
    console.log('Paso 5: Mensaje de confirmación visible');

    // Paso 6: Navegar al carrito de compras
    await page.getByRole('link', {name: 'Shopping cart'}).click();
    console.log('Paso 6: Navegando al carrito de compras');

    // Paso 7: Verificar que el producto esté en el carrito
    await expect(page.locator('.product-name').getByText('Fiction')).toBeVisible();
    console.log('Paso 7: El producto "Fiction" se encuentra en el carrito de compras');

    // Paso 8: Iniciar el proceso de checkout
    await page.locator('#termofservice').check();
    await page.locator('#checkouut').click();
    console.log('Paso 8: Iniciando el proceso de de pago');

    // Paso 9: Realizar el proceso de pago como invitado


}