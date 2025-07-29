// cypress/e2e/login.cy.js

describe('Login Functionality', () => {
    beforeEach(() => {
        // Antes de cada test en este bloque, visita la página de login
        // Se asume que cy.visit('/login') te lleva a la pantalla de login.
        // Si la base URL es diferente y '/' es tu login, entonces cy.visit('/');
        cy.visit('/login');
    });

    it('should allow a registered user to log in successfully', () => {
        // Usamos el comando personalizado 'login' definido en cypress/support/commands.js
        // Este comando ya maneja los pasos de escribir credenciales y hacer clic en Ingresar,
        // así como la validación de que se redirige al dashboard.
        cy.login('tester@adl.com', 'testerEngineer');
        // No necesitas añadir más aserciones aquí, ya están dentro del comando 'login'.
        // Opcional: Si quieres una aserción adicional muy específica para este test:

    });

    it('should display an error message for incorrect credentials', () => {
        // 1. Intentar login con credenciales inválidas usando los selectores correctos
        cy.get('input#email').type('correo_incorrecto@adl.com');
        cy.get('input#password').type('clave_incorrecta');
        cy.get('button[type="submit"]').contains('Ingresar').click();

        // 2. Validar que el login falló y el mensaje de error específico
        cy.contains('Las credenciales proporcionadas son incorrectas').should('be.visible');

        // 3. Asegurarse de que no se redirigió al dashboard, sino que se quedó en la página de login
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/login');
    });

    it('should display a browser validation error for an invalid email format', () => {
        // 1. Intentar con un email sin "@"
        cy.get('input#email').type('correo_invalido.com');
        cy.get('input#password').type('cualquierclave');
        cy.get('button[type="submit"]').contains('Ingresar').click();

        // 2. Verificar el mensaje de validación HTML5 del navegador
        // Para errores de validación del navegador (como el "@" faltante), el mensaje aparece
        // como un tooltip del navegador y no es directamente accesible con cy.contains.
        // Se accede a la propiedad 'validationMessage' del elemento del input.
        cy.get('input#email')
            .then(($input) => {
                // Comprobamos que el mensaje de validación contenga parte del texto esperado.
                expect($input[0].validationMessage).to.include('Incluye un signo "@" en la dirección de correo electrónico.');
            });

        // 3. Asegurarse de que se permanece en la página de login
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/login');
    });

    // El test "should not allow an unregistered user to access the dashboard"
    // que tenías en products.cy.js es una prueba de "acceso no autorizado"
    // que valida la redirección al login. No es un test de "login fallido" per se,
    // sino de "seguridad de acceso". Lo mantendremos en products.cy.js como ya estaba,
    // ya que no implica una interacción directa con el formulario de login.
});