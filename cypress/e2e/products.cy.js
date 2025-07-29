// cypress/e2e/products.cy.js

describe('Product Management Functionality', () => {
    // Este beforeEach se ejecutará antes de CADA test (it block).
    // Asegura que cada test comience con una sesión de login fresca y conocida.
    beforeEach(() => {
        cy.login('tester@adl.com', 'testerEngineer');
        // Añadimos una pequeña espera después del login para permitir que la aplicación
        // complete cualquier lógica de inicialización o redirección post-login.
        cy.wait(1000); 
    });

    it('should allow a registered user to view the list of products (Articulos)', () => {
        // Pasos para navegar a la lista de artículos desde el dashboard
        cy.get('span.flex-1.ml-4').contains('Entidades').parent().click();
        cy.get('a[href="/articulos"]').contains('Artículos').click();

        // Aserciones para verificar que estamos en la página correcta
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos');
        cy.contains('Listado de Artículos', { timeout: 20000 }).should('be.visible');
        cy.get('table', { timeout: 20000 }).should('be.visible');
    });

    it('should allow a registered user to register a new product (Iphone 16)', () => {

        
        // Pasos para navegar a la página de creación de artículos desde el dashboard
        // ESTOS PASOS SON NECESARIOS PORQUE CADA TEST COMIENZA DESDE EL DASHBOARD (debido al beforeEach)
        cy.get('span.flex-1.ml-4').contains('Entidades').parent().click();
        cy.get('a[href="/articulos"]').contains('Artículos').click();
        cy.contains('Listado de Artículos', { timeout: 20000 }).should('be.visible'); // Aseguramos que el listado sea visible antes de crear
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos'); // Aseguramos la URL

        // Clic en "Crear Artículo" para ir al formulario
        cy.get('button[type="button"]').contains('Crear Artículo').click();

        // Aserción para verificar que estamos en la página de nuevo artículo
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos/nuevo');

        // Rellenar el formulario de creación
        cy.get('#sku').type('IPHONE-0001');
        cy.get('input#name').type('Iphone 16');
        cy.get('#stock_quantity').type('100');
        cy.get('#cost_price').clear().type('1200000');
        cy.get('#sale_price').clear().type('1500000');
        
        // Selección de la unidad de medida, asegurando visibilidad y habilitación
        cy.get('#unit')
          .should('be.visible')
          .and('not.be.disabled')
          .select('Unidad'); 
        cy.wait(200); // Pequeña pausa para permitir que la UI actualice la selección

        cy.intercept('POST', '**/api/products').as('createArticle');

        // Clic en "Guardar Cambios"
        cy.get('button[type="submit"]').contains('Guardar Cambios').click();
        cy.wait('@createArticle').then((interception) => {
            // Asumiendo que el ID del artículo está en interception.response.body.id
            // O en interception.response.body.data.id, o similar, dependiendo de la estructura de tu API
            const articleId = interception.response.body.id || interception.response.body.data.id; // Ajusta esto según la estructura real de tu respuesta

            // Almacenar el ID en un alias de Cypress para usarlo en otros tests
            cy.wrap(articleId).as('createdArticleId');
            Cypress.env('createdArticleId', articleId); // También puedes guardarlo en Cypress.env para acceso global si los tests están separados
            cy.log(`Artículo creado con ID: ${articleId}`);
        });

        // Aserciones para verificar que el artículo fue creado y estamos de vuelta en la lista
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos');
         cy.get('.Toastify__toast--info', { timeout: 20000 })
          .should('be.visible')
          .and('contain.text', 'Articulo "Iphone 16" creado con éxito!');

        cy.contains('tr', 'Iphone 16').should('be.visible');
    });

    it('should allow a registered user to update an existing product (Iphone 16 to Iphone 16 Pro Max)', () => {
        const articleId = this.createdArticleId || Cypress.env('createdArticleId'); // Obtén el ID del alias o de Cypress.env
        // Pasos para navegar a la lista de artículos desde el dashboard
        cy.get('span.flex-1.ml-4').contains('Entidades').parent().click();
        cy.get('a[href="/articulos"]').contains('Artículos').click();
        cy.contains('Listado de Artículos', { timeout: 20000 }).should('be.visible');
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos');

        //cy.visit(`/articulos/${articleId}/editar`);

        // Encontrar y hacer clic en el botón de edición para "Iphone 16"
        cy.contains('tr', 'IPHONE-0001').within(() => {
            cy.get('button.text-indigo-600').click();
        });
        cy.wait(500);

        // Aserción para verificar que estamos en la página de edición
        cy.url().should('include', `/articulos/${articleId}/editar`);


        // Actualizar los campos del formulario
        cy.get('input#name').clear().type('Iphone 16 Pro Max');
        cy.get('#stock_quantity').clear().type('120');
        cy.get('#cost_price').clear().type('1350');
        cy.get('#sale_price').clear().type('1800');
        
        // Selección de la unidad de medida (si aplica al editar)
        cy.get('#unit').should('be.visible').and('not.be.disabled').select('Caja'); // Asumiendo que "Caja" es una opción válida
        cy.wait(200);

        // Clic en "Guardar Cambios"
        cy.get('button[type="submit"]').contains('Guardar Cambios').click();

        // Aserciones para verificar que el artículo fue actualizado y estamos de vuelta en la lista
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos');
        cy.contains('Artículo "Iphone 16 Pro Max" actualizado con éxito!', { timeout: 20000 }).should('be.visible');
        cy.contains('tr', 'Iphone 16 Pro Max').should('be.visible');
        //cy.contains('tr', 'Iphone 16').should('not.exist'); // Asegura que el nombre anterior ya no esté
    });

    it('should allow a registered user to delete a product (Iphone 16 Pro Max)', () => {
        // Pasos para navegar a la lista de artículos desde el dashboard
        cy.get('span.flex-1.ml-4').contains('Entidades').parent().click();
        cy.get('a[href="/articulos"]').contains('Artículos').click();
        cy.contains('Listado de Artículos', { timeout: 20000 }).should('be.visible');
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos');

        // Encontrar y hacer clic en el botón de eliminar para "Iphone 16 Pro Max"
        cy.contains('tr', 'Iphone 16 Pro Max').within(() => {
            cy.get('button.text-red-600').click();
        });

        // Aserciones para verificar que el artículo fue eliminado y estamos de vuelta en la lista
        cy.url().should('eq', 'https://test-adl.leonardojose.dev/articulos');
        cy.contains('Artículo eliminado con éxito', { timeout: 20000 }).should('be.visible');
        cy.contains('tr', 'Iphone 16 Pro Max').should('not.exist'); // Asegura que el artículo ya no esté en la tabla
    });

    // cypress/e2e/products.cy.js (o el archivo donde tengas este test)

    describe('Acceso de Usuario No Autorizado', () => { // O dentro de tu bloque describe existente
    beforeEach(() => {
        // Limpia todas las cookies, el almacenamiento local y el almacenamiento de sesión.
        // Esto asegura que el usuario esté definitivamente deslogueado antes de intentar acceder a una ruta protegida.
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
    });

    it('should not allow an unregistered user to access the dashboard', () => {
        // Este test no necesita login, solo visita una URL protegida
        cy.visit('/dashboard');
        // Aserciones para verificar que fuimos redirigidos al login
        cy.url().should('not.eq', 'https://test-adl.leonardojose.dev/dashboard');
        cy.url().should('include', '/login');
        cy.get('button[type="submit"]').contains('Ingresar', { timeout: 20000 }).should('be.visible');
    });

    // (Opcional) Si también quieres un test para login con credenciales incorrectas, agrégalo aparte:
    /*
    it('should not allow login with incorrect credentials', () => {
        cy.visit('/login');
        cy.get('#email').type('usuario_incorrecto@adl.com');
        cy.get('#password').type('contraseña_incorrecta');
        cy.get('button[type="submit"]').contains('Ingresar').click();
        // Aserta que aparece un mensaje de error, o que la URL no cambia de /login
        cy.get('.error-message').should('be.visible').and('contain.text', 'Credenciales inválidas');
        cy.url().should('include', '/login'); // Debería quedarse en la página de login
    });
    */
});
});