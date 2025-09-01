import { test, expect } from '@playwright/test';

test('addds a product to the cart and complete checkout', async ({ page }) => { 
    // paso 1: navegar a l página principal
    await page.goto('https://demowebshop.tricentis.com/');
    console.log('paso 1: navegando a la página principal');

    // paso 2: Buscar un producto y hacer click en él
    // bucaremos el libro "fiction"
    await page.locator('#small-searchterms').fill('Fiction');
    console.log('Paso 2: Agregando producto al buscador');
    await page.getByRole('button', {name: 'Search'}).click();
    // vamos al detalle del producto
    await page.getByRole('link', {name: 'Fiction', exact: true}).click();
    console.log('Viendo el detalle del producto');


    // paso 3: aumentar la cantidad del producto
    const quantityInput = page.locator('#addtocart_45_EnteredQuantity');
    await quantityInput.fill('2');  //aumentamos la cantidad a 2 unidades
    console.log('Paso 3: Se ha cambiado la cantidad de producto a 2');

    // Paso 4: Agregar el producto al carrito
    await page.locator('#add-to-cart-button-45').click();
    console.log('Producto agregado al carrito');

    // Paso 5: Esperar que se muestre notificación de éxito
    await expect(page.getByText('The product has been added to your')).toBeVisible();
    console.log('Paso 5: Mensaje de confirmación visible');

    // Paso 6: Navegar al carrito de compras
    await page.getByRole('link', {name: 'Shopping cart', exact: true}).click();
    console.log('Paso 6: Navegando al carrito de compras');

    // Paso 7: Verificar que el producto esté en el carrito
    await expect(page.locator('.product-name').getByText('Fiction')).toBeVisible();
    console.log('Paso 7: El producto "Fiction" se encuentra en el carrito de compras');

    // Paso 8: Iniciar el proceso de checkout
    await page.locator('#termsofservice').check();
    await page.locator('#checkout').click();
    console.log('Paso 8: Iniciando el proceso de de pago');

    // Paso 9: Realizar el proceso de pago como invitado
    await page.getByRole('button', {name: 'Checkout as Guest'}).click();
    console.log('Paso 9: Se selecciona continuar como invitado');

    // Paso 10: Rellenar el formulario de facturación
    await page.locator('#BillingNewAddress_FirstName').fill('Test');
    await page.locator('#BillingNewAddress_LastName').fill('User');
    await page.locator('#BillingNewAddress_Email').fill('testuser@test.com');
    await page.locator('#BillingNewAddress_CountryId').selectOption('Mexico');
    await page.locator('#BillingNewAddress_City').fill('Mexico City');
    await page.locator('#BillingNewAddress_Address1').fill('123 Test St');
    await page.locator('#BillingNewAddress_ZipPostalCode').fill('01234');
    await page.locator('#BillingNewAddress_PhoneNumber').fill('555-123-4567');

    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('Paso 10: Datos de facturación completados.');

    // Paso 11: Finalizar el proceso de pago y verificar la confirmación
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
    await page.getByRole('button', { name: 'Confirm', exact: true}).click(); // Confirmación de la orden
    console.log('Paso 11: Confirmación de la orden.');
    // Paso 12: Verificar el mensaje de confirmación final de la orden
    await expect(page.getByText('Your order has been successfully processed!')).toBeVisible();
    console.log('¡La compra se ha completado exitosamente!');
});