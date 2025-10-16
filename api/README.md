# Recetario API

API REST construida con Fastify y SQLite para el proyecto **Recetario de Cocina**.

## Requisitos

- Node.js >= 22.5

## Scripts

- `npm install` – instala dependencias.
- `npm run dev` – ejecuta el servidor en modo desarrollo (http://localhost:5058).
- `npm run build` + `npm start` – compila y ejecuta en producción.
- `npm test` – ejecuta pruebas (node:test).

## Variables de entorno

| Variable            | Descripción                                              | Valor por defecto          |
| ------------------- | -------------------------------------------------------- | -------------------------- |
| `PORT`              | Puerto HTTP del servidor Fastify                         | `5058`                     |
| `HOST`              | Host de escucha                                          | `0.0.0.0`                  |
| `SQLITE_DB_PATH`    | Ruta del archivo SQLite                                  | `./db/recetario.db`        |

La base de datos se inicializa automáticamente leyendo `db/schema.sql` y `db/seed.sql`
cuando la tabla `Ingredientes` no existe.

## Endpoints principales

- CRUD de ingredientes: `/api/ingredientes`
- CRUD de categorías: `/api/categorias`
- CRUD de recetas: `/api/recetas`
- Recetas posibles: `/api/recetas/posibles`
- CRUD de compras: `/api/compras`

Todas las respuestas usan JSON y exponen mensajes de error tipo Problem Details.
