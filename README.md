# Recetario de Cocina

Aplicacion moderna para gestionar recetas, ingredientes y compras utilizando Next.js (App Router) con TypeScript, Tailwind CSS, Framer Motion y shadcn/ui.

## Caracteristicas

- Dashboard con metricas principales
- CRUD completo de recetas con ingredientes y categorias
- Inventario de ingredientes y registro de compras
- Busqueda de recetas posibles segun ingredientes disponibles
- Modo claro/oscuro y diseno 100% responsivo
- Componentes accesibles basados en WAI-ARIA

## Requisitos

- Node.js 18 o superior
- npm
- Backend Fastify disponible en `http://localhost:5058/api`

## Instalacion del frontend

```bash
cd "recetario"
npm install
```

Configura un archivo `.env.local` si quieres personalizar la API:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5058/api
```

### Scripts principales

- `npm run dev` – inicia solo el frontend.
- `npm run dev:api` – inicia solo el backend usando el script del directorio `api/`.
- `npm run dev:full` – **nuevo comando** que levanta **frontend y backend en paralelo**.
- `npm run build` – build de produccion.
- `npm run start` – servidor Next.js en modo produccion.
- `npm run lint` – analisis estatico.

## Backend Fastify

El backend vive en la carpeta `api/`.

```bash
cd api
npm install
npm run dev
```

- Servidor: `http://localhost:5058`
- Base de datos SQLite: `db/recetario.db`
- Esquema y seeds: `api/db/schema.sql` y `api/db/seed.sql`
- Pruebas: `npm test`

## Estructura

```
Nueva carpeta/
  app/                  # Rutas App Router
  components/           # Componentes UI
  lib/                  # Cliente API y utilidades
  public/               # Activos estaticos
api/
  src/                  # Fastify + dominio + servicios
  db/                   # schema.sql y seed.sql
```

## Endpoints consumidos

- `GET/POST/PUT/DELETE /api/ingredientes`
- `GET/POST/PUT/DELETE /api/recetas`
- `GET/POST/PUT/DELETE /api/categorias`
- `GET/POST/PUT/DELETE /api/compras`
- `GET /api/recetas/posibles?ingredientes=...&categoria=...`

## Notas

- Los datos de ejemplo (ingredientes, categorias, recetas y compras) se siembran desde `api/db/seed.sql`.
- El historial de compras guarda fecha y cantidad segun la estructura del backend.
- Para una base inicial consulta `api/db/schema.sql` y `api/db/seed.sql`.
