# 🎉 Invitación Digital Premium — RSVP

Invitación digital para confirmar asistencia a una fiesta. Construida con **HTML5 + Tailwind CSS (CDN) + JavaScript Vanilla**, sin frameworks ni pasos de compilación, lista para publicarse en cualquier hosting estático (GitHub Pages, Netlify o Vercel) y conectada a **Supabase** como base de datos gratuita para guardar las confirmaciones.

---

## 📁 Estructura del proyecto

```
/
├── index.html          → Página principal (invitación)
├── admin.html           → Panel de administración de confirmaciones
├── styles.css            → Estilos (glassmorphism, animaciones, responsive)
├── script.js             → Lógica: datos del evento, countdown, RSVP, galería, FAQ
├── README.md
└── assets/
    ├── img/               → Coloca aquí tus fotos (galería, etc.)
    └── icons/
```

No requiere Node.js, PHP ni servidor propio. Puedes abrir `index.html` directamente en el navegador para probarlo.

---

## 1. Crear tu base de datos gratuita en Supabase

### 1.1 Crear una cuenta
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **Start your project** y crea una cuenta (puedes usar GitHub o correo).

### 1.2 Crear el proyecto
1. Dentro del dashboard, haz clic en **New Project**.
2. Elige un nombre (ej. `invitacion-fiesta`), una contraseña para la base de datos y una región cercana.
3. Espera 1-2 minutos a que Supabase aprovisione el proyecto.

### 1.3 Crear la tabla `rsvp`
1. En el menú lateral, entra a **Table Editor** → **New table**.
2. Nombra la tabla `rsvp`.
3. Agrega las siguientes columnas (además de la columna `id` que Supabase crea por defecto):

| Columna          | Tipo                | Notas                              |
|------------------|---------------------|-------------------------------------|
| `id`             | `int8` (auto)       | Se crea automáticamente             |
| `nombre`         | `text`              | Requerido                           |
| `personas`       | `int4`              | Número de asistentes                |
| `asistencia`     | `text`              | Valores: `si` / `no`                |
| `comentarios`    | `text`              | Puede ser nulo                      |
| `fecha_registro` | `timestamptz`       | Default value: `now()`              |

> 💡 Tip: también puedes crear la tabla ejecutando este SQL en **SQL Editor**:
>
> ```sql
> create table rsvp (
>   id bigint generated always as identity primary key,
>   nombre text not null,
>   personas int4 not null,
>   asistencia text not null,
>   comentarios text,
>   fecha_registro timestamptz default now()
> );
>
> alter table rsvp enable row level security;
>
> create policy "Cualquiera puede insertar confirmaciones"
>   on rsvp for insert
>   with check (true);
>
> create policy "Cualquiera puede leer confirmaciones"
>   on rsvp for select
>   using (true);
> ```
>
> Las políticas (`policies`) son necesarias porque Supabase activa **Row Level Security** por defecto. Si quieres que solo tú puedas leer las confirmaciones en `admin.html`, ajusta la política de `select` para requerir autenticación — por defecto aquí queda abierta para simplificar el prototipo.

### 1.4 Obtener tus credenciales
1. Ve a **Project Settings** (ícono de engrane) → **API**.
2. Copia:
   - **Project URL** → esto es tu `SUPABASE_URL`
   - **anon public key** → esto es tu `SUPABASE_ANON_KEY`

### 1.5 Colocar las credenciales en el proyecto
Debes pegarlas en **dos archivos**:

**En `script.js`** (líneas cerca del inicio del archivo):
```js
const SUPABASE_URL = "PEGA_AQUI_TU_SUPABASE_URL";
const SUPABASE_ANON_KEY = "PEGA_AQUI_TU_SUPABASE_ANON_KEY";
```

**En `admin.html`** (dentro del `<script>` al final del archivo):
```js
const SUPABASE_URL = "PEGA_AQUI_TU_SUPABASE_URL";
const SUPABASE_ANON_KEY = "PEGA_AQUI_TU_SUPABASE_ANON_KEY";
```

> ⚠️ La `anon public key` es segura para usarse en el frontend siempre y cuando tengas Row Level Security (RLS) configurado correctamente, como en el SQL de arriba. Nunca uses la `service_role key` en el navegador.

---

## 2. Probar localmente

Como es un sitio 100% estático, basta con abrir `index.html` en tu navegador. Para evitar problemas de rutas relativas, se recomienda usar un servidor local simple:

```bash
# Con Python
python3 -m http.server 8080

# o con Node (si lo tienes instalado, opcional)
npx serve .
```

Luego visita `http://localhost:8080`.

---

## 3. Publicar gratis

### Opción A — GitHub Pages
1. Sube el proyecto a un repositorio en GitHub:
   ```bash
   git init
   git add .
   git commit -m "Invitación digital premium"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
2. En GitHub, ve a **Settings → Pages**.
3. En **Source**, elige la rama `main` y la carpeta `/ (root)`.
4. Guarda. Tu sitio quedará publicado en `https://TU-USUARIO.github.io/TU-REPO/`.

### Opción B — Netlify
1. Ve a [https://app.netlify.com](https://app.netlify.com) y crea una cuenta.
2. Haz clic en **Add new site → Deploy manually** y arrastra la carpeta del proyecto.
   - O conecta tu repositorio de GitHub para despliegues automáticos.
3. Netlify te dará una URL pública al instante.

### Opción C — Vercel
1. Ve a [https://vercel.com](https://vercel.com) y crea una cuenta.
2. Haz clic en **Add New → Project** e importa tu repositorio de GitHub.
3. Como es un proyecto estático, no necesitas configurar ningún "Build Command". Despliega.

---

## 4. Personalizar la invitación

Toda la información del evento se controla desde **un solo lugar**: el objeto `evento` al inicio de `script.js`.

```js
const evento = {
  nombre: "Mi Fiesta",
  fecha: "2026-08-08",                 // YYYY-MM-DD
  hora: "16:00",                        // HH:MM (24h)
  lugar: "Salón Jardín Alameda",
  direccion: "Av. Reforma 123, Col. Centro, Cuernavaca, Morelos",
  googleMaps: "https://maps.google.com/?q=...",
  mensaje: "Será un gusto compartir este día contigo. ¡Esperamos contar con tu presencia!",
  estacionamiento: true,
  acompanantes: 1,
  codigoVestimenta: false,
  fechaLimiteConfirmacion: "2026-08-05"
};
```

| Quiero cambiar…              | Edita…                                                                 |
|-------------------------------|------------------------------------------------------------------------|
| Nombre del evento              | `evento.nombre`                                                        |
| Fecha y hora                   | `evento.fecha` y `evento.hora` (esto también actualiza el countdown)   |
| Lugar y dirección              | `evento.lugar` y `evento.direccion` (el mapa se genera automáticamente)|
| Mensaje de bienvenida          | `evento.mensaje`                                                       |
| Enlace "Abrir en Google Maps"  | `evento.googleMaps`                                                    |
| Preguntas frecuentes           | Función `pintarFaq()` en `script.js`                                   |
| Imágenes de la galería         | Reemplaza los archivos en `assets/img/` (mismos nombres) o edita el arreglo `galeriaImagenes` en `script.js` |
| Fecha límite de confirmación   | `evento.fechaLimiteConfirmacion`                                       |
| Colores / tipografía           | Variables `tailwind.config` en `index.html` y `:root` en `styles.css`  |

---

## 5. Panel de administración

Abre `admin.html` (por ejemplo `https://tu-sitio.com/admin.html`) para ver todas las confirmaciones guardadas en Supabase: nombre, número de personas, asistencia, comentarios y fecha de registro, con buscador, filtro por asistencia y totales.

> 🔒 Este archivo no está protegido por contraseña — es un prototipo. Si vas a usarlo en producción, considera agregar autenticación (Supabase Auth) o restringir el acceso al panel por otros medios.

---

## 6. Notas técnicas

- **Sin frameworks de compilación**: todo corre directo en el navegador vía CDN (Tailwind, Font Awesome, Supabase JS).
- **Accesibilidad**: formularios con `label`, `fieldset`/`legend`, roles ARIA en mensajes de error y foco visible en todos los controles interactivos.
- **Rendimiento**: imágenes con `loading="lazy"`, animaciones respetan `prefers-reduced-motion`.
- **Row Level Security**: revisa las políticas de Supabase antes de publicar en producción; el ejemplo de este README abre lectura y escritura públicas para simplificar el prototipo.

---

¡Disfruta tu fiesta! 🥂 — *Created by Panda de Gomita*
