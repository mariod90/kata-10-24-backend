# Task Manager Backend

Este proyecto es una API REST de gestión de tareas, implementada utilizando la arquitectura hexagonal, que permite realizar operaciones CRUD sobre tareas. También incluye autenticación simulada mediante un middleware que verifica un token antes de acceder a las rutas protegidas.

## Herramientas utilizadas

- **Node.js**: Entorno de ejecución para JavaScript/TypeScript en el backend.
- **Express.js**: Framework web para construir la API REST.
- **TypeScript**: Superconjunto de JavaScript que añade tipado estático.
- **SQLite**: Base de datos ligera utilizada como persistencia.
- **Jest**: Framework de testing para escribir y ejecutar pruebas unitarias.
- **Arquitectura Hexagonal**: Patrones para mantener la separación de capas entre el dominio, la aplicación y la infraestructura.

## Funcionalidades

- **CRUD de Tareas**:
    - Crear, obtener, actualizar y eliminar tareas.
- **Autenticación Simulada**:
    - Middleware que verifica un token de autenticación para rutas protegidas.
- **Manejo de Errores**:
    - Gestión de errores personalizados con códigos de estado y mensajes claros.

## Requisitos previos

- **Node.js** (versión 14 o superior)

## Instalación y ejecución

### Clonar el repositorio

```bash
git clone https://github.com/mariod90/kata-10-24-backend.git
cd kata-10-24-backend
```

### Instalar dependencias
```bash
npm install
```

### Ejecutar el servidor
Para iniciar el servidor localmente, ejecuta:
```bash
npm run dev
```

El servidor estará corriendo en http://localhost:3000.

## Probar la API
Asegúrate de que el servidor esté corriendo.
Abre Postman o tu herramienta de prueba de APIs favorita, y crea un entorno con la URL base http://localhost:3000.
Añade una cabecera Authorization con el valor **"mysecrettoken"** en las solicitudes.

### Endpoints principales:
- **GET /tasks**: Obtener todas las tareas.
- **POST /tasks**: Crear una nueva tarea (requiere title y description).
- **PUT /tasks/:id**: Actualizar una tarea existente.
- **DELETE /tasks/:id**: Eliminar una tarea.

## Correr los tests unitarios

Para ejecutar las pruebas unitarias con Jest:
```bash
npm run test
```
