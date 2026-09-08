# ADL Automation Tests

Suite de automatización de pruebas desarrollada como proyecto integrador
del curso **Fundamentos de Test Automation Engineer** (Desafío Latam),
combinando pruebas E2E con enfoque BDD y pruebas de API.

## Stack

- **E2E / UI:** Cypress + Cucumber (`@badeball/cypress-cucumber-preprocessor`),
  con especificaciones escritas en Gherkin (`.feature`) y step definitions
  en JavaScript. El bundling de los steps se hace con esbuild.
- **API:** Colecciones de Postman, ejecutadas también vía Newman para
  poder correrlas en línea de comandos / CI en vez de solo desde la UI
  de Postman.
- **Reportes:** Salida de ejecución de Newman en `newman-reports/`.

## Por qué BDD y no solo Cypress "a secas"

Escribir los casos como `.feature` en Gherkin (dado/cuando/entonces)
separa la intención del test (qué se está verificando, en lenguaje
natural) de su implementación (los step definitions). Eso permite que
alguien no técnico pueda leer y validar el criterio de aceptación sin
tener que leer código, y es el mismo patrón que se usa en equipos QA
reales para mantener sincronizados los casos de prueba con los
requerimientos de negocio.

## Estructura

```
adl-automation-tests/
  cypress/
    e2e/
      *.feature              # casos de prueba en Gherkin
      step_definitions/      # implementación de cada step
  api-tests/
    postman/                 # colecciones de Postman para pruebas de API
  newman-reports/            # reportes generados al correr las colecciones vía Newman
  cypress.config.js
```

## Contra qué corre

Las pruebas E2E apuntan a la aplicación de práctica provista por el
curso (`test-adl.leonardojose.dev`), pensada específicamente para que
los alumnos automaticen flujos reales de una aplicación web sin
depender de un entorno propio.

## Cómo correr las pruebas

```bash
npm install
npx cypress open        # modo interactivo
npx cypress run         # modo headless (CI)
```

Para las pruebas de API con Newman:

```bash
npx newman run api-tests/postman/<coleccion>.json
```

## Contexto

Este repo es parte de mi formación en QA/Test Automation (certificación
Desafío Latam), complementaria a mi trabajo en automatización de
infraestructura y procesos (ver `meraki-freshdesk-bot` y
`chatbot-negocio-portable`): un mismo eje — reducir trabajo manual
repetitivo — aplicado a dos disciplinas distintas.
