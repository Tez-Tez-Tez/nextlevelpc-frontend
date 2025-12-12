import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

const APP_URL = 'https://nextlevelpc-frontend-vite.vercel.app/';
const TIMEOUT_GENERAL = 20000;
const PAUSA_VISUAL = 3000; 

const TEST_USER = {
    nombre: 'User',
    apellido: 'Test',
    email: `comprador${Date.now()}@test.com`,
    password: 'Password123!',
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Flujo Completo E2E: Pago con Stripe', function() {
    this.timeout(180000);
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('firefox').build();
        await driver.manage().window().maximize();
    });

    after(async () => {
        await sleep(5000);
        await driver.quit();
    });

    it('1. Registro y 2. Login de Usuario', async function() {
        await driver.get(APP_URL);
        await sleep(PAUSA_VISUAL);
        await (await driver.wait(until.elementLocated(By.id('user-btn')), TIMEOUT_GENERAL)).click();
        await (await driver.wait(until.elementLocated(By.className('auth-switch-btn')), TIMEOUT_GENERAL)).click();
        await driver.findElement(By.id('register-nombre')).sendKeys(TEST_USER.nombre);
        await driver.findElement(By.id('register-apellido')).sendKeys(TEST_USER.apellido);
        await driver.findElement(By.id('register-correo')).sendKeys(TEST_USER.email);
        await driver.findElement(By.id('register-password')).sendKeys(TEST_USER.password);
        await driver.findElement(By.id('register-confirmPassword')).sendKeys(TEST_USER.password);
        await driver.findElement(By.className('auth-submit-btn')).click();
        await (await driver.wait(until.alertIsPresent(), 10000)).accept();
        await driver.findElement(By.className('auth-modal-close')).click();
        await sleep(1000);
        await (await driver.wait(until.elementLocated(By.id('user-btn')), TIMEOUT_GENERAL)).click();
        await driver.findElement(By.id('login-correo')).sendKeys(TEST_USER.email);
        await driver.findElement(By.id('login-password')).sendKeys(TEST_USER.password);
        await driver.findElement(By.className('auth-submit-btn')).click();
        const backdrop = await driver.findElement(By.className('auth-modal-backdrop'));
        await driver.wait(until.stalenessOf(backdrop), 10000);
        await sleep(PAUSA_VISUAL);
    });

    it('3. Selección de Producto y Carrito', async function() {
        await (await driver.wait(until.elementLocated(By.css('nav a[href="/productos"]')), TIMEOUT_GENERAL)).click();
        await sleep(PAUSA_VISUAL);
        await (await driver.wait(until.elementLocated(By.className('producto-card-link')), TIMEOUT_GENERAL)).click();
        await sleep(PAUSA_VISUAL);
        await (await driver.wait(until.elementLocated(By.className('product-detail-buy-btn')), TIMEOUT_GENERAL)).click();
        await driver.wait(until.elementLocated(By.className('navbar-cart-badge')), 10000);
        await sleep(PAUSA_VISUAL);
        await (await driver.wait(until.elementLocated(By.id('cart-btn')), TIMEOUT_GENERAL)).click();
        await sleep(1000);
        await (await driver.wait(until.elementLocated(By.className('btn-checkout')), TIMEOUT_GENERAL)).click();
        await sleep(PAUSA_VISUAL);
    });

    // --- PAGO CON STRIPE ---
    it('4. Realizar pago con tarjeta de prueba Stripe', async function() {
        console.log('Esperando carga del Checkout...');
        await driver.wait(until.elementLocated(By.className('checkout-container')), TIMEOUT_GENERAL);
        
        // 1. Entrar al iframe
        const iframe = await driver.wait(until.elementLocated(By.css('.checkout-container iframe')), TIMEOUT_GENERAL);
        await driver.switchTo().frame(iframe);
        console.log('✅ Dentro del iframe de Stripe');

        // 2. Llenar los campos de la tarjeta
        try {
            const cardInput = await driver.wait(until.elementLocated(By.name('cardnumber')), 10000);
            await cardInput.sendKeys('4242424242424242');
            console.log('Número de tarjeta ingresado...');

            const expInput = await driver.wait(until.elementLocated(By.name('exp-date')), 5000);
            await expInput.sendKeys('1226');

            const cvcInput = await driver.wait(until.elementLocated(By.name('cvc')), 5000);
            await cvcInput.sendKeys('123');
            
            const postalInput = await driver.findElements(By.name('postal'));
            if (postalInput.length > 0) await postalInput[0].sendKeys('110111');

            console.log('✅ Todos los campos de la tarjeta llenados');
        } catch (error) {
            console.log('Aviso: Fallo al llenar los campos individuales de Stripe.');
     
        }

        // 3. SALIR DEL IFRAME
        await driver.switchTo().defaultContent();
        console.log('Regresando al contenido principal...');
        await sleep(2000); // Pequeña pausa para asegurar el cambio de foco

        // 4. CLIC EN BOTÓN DE PAGO FINAL (Usando el selector exacto `checkout-btn`)
        console.log('Buscando botón final con clase .checkout-btn');
        const btnPagar = await driver.wait(
            until.elementLocated(By.className('checkout-btn')), // Selector corregido
            TIMEOUT_GENERAL
        );

        // Esperar a que el botón se ACTIVE (visibilidad + clickeabilidad)
        await driver.wait(until.elementIsVisible(btnPagar), 5000);
        await driver.wait(until.elementIsEnabled(btnPagar), 5000, "El botón de pago nunca se habilitó después de ingresar la tarjeta.");
        
        // Desplazar y Click
        await driver.executeScript("arguments[0].scrollIntoView(true);", btnPagar);
        await sleep(1000);
        
        console.log('Haciendo clic en el botón Finalizar Pago...');
        await btnPagar.click();

        // 5. Validación de éxito
        await driver.wait(until.urlContains('/factura'), 30000);
        const urlFinal = await driver.getCurrentUrl();
        assert.ok(urlFinal.includes('/factura'), "No se llegó a la pantalla de éxito/factura");

        console.log('✅ ¡Flujo E2E completado con éxito!');
    });
});

