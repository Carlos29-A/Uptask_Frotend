# UpTask - Frontend

Aplicación web para gestión de proyectos y tareas. Permite crear proyectos, asignar tareas, cambiar su estado y colaborar con otros usuarios mediante un sistema de roles y permisos.

## Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router
- React Hook Form + Zod
- Axios

## Requisitos

- Node.js 18 o superior
- El backend de UpTask corriendo

## Pasos para ejecutar

1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd uptask-frontend
```

2. Instalar dependencias

```bash
npm install
```

3. Crear el archivo de variables de entorno

```bash
cp .env.example .env.local
```

4. Configurar la URL del backend en `.env.local`

```
VITE_API_URL=http://localhost:4000/api
```

5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Vista previa de la build de producción |
| `npm run lint` | Ejecuta el linter |
