# Portafolio de fotografía — onepage con parallax

Sitio de una sola página (HTML + CSS + JavaScript vanilla) con animaciones parallax
usando **GSAP + ScrollTrigger** (cargado por CDN, sin instalar nada).

## Ver el sitio

Abre `index.html` en el navegador. Para que todo funcione bien (imágenes, rutas),
lo mejor es servirlo con un servidor local simple:

```bash
python3 -m http.server 8000
```

Luego abre http://localhost:8000

## Cómo agregar o cambiar fotos

Las fotos viven en carpetas por categoría (`img/hero/`, `img/retrato/`, `img/calle/`,
`img/paisaje/`). Los originales quedan como respaldo en `img/todas/`.

Para agregar/cambiar una foto:
1. Copia la imagen a la carpeta de su categoría (ej. `img/retrato/`).
2. Abre `js/main.js` y en el objeto `SITE.categorias`, dentro de la categoría, agrega
   una línea con la ruta y una descripción:
   ```js
   { src: "img/retrato/mi-foto.jpg", alt: "Descripción de la foto" },
   ```
   - La **primera** foto de cada categoría se muestra a lo ancho (imagen "lead").
   - Para poner un título visible como pie de foto, añade `titulo`:
     `{ src: "...", alt: "...", titulo: "Centinela en Jaula" }`.

> Consejo: exporta a ~2000px de ancho en `.jpg`/`.webp` para que carguen rápido.

## Cómo editar los textos y datos

Todo está en el objeto `SITE` al inicio de `js/main.js`:
- `nombre`, `eyebrow`, `taglineHero`, `email`
- `redes` (Instagram, etc. — agrega o quita las que quieras)
- `categorias` (nombre, descripción y lista de fotos de cada una)

## Cambiar colores y tipografías

En `css/styles.css`, sección `:root` (arriba del todo). Cambia por ejemplo
`--bg`, `--fg`, `--accent` o las fuentes en `--font-display` / `--font-body` / `--font-mono`.

## Revisar el diseño con Impeccable

El skill de diseño **impeccable** está instalado. Para un chequeo de calidad de diseño:
```bash
npx impeccable detect index.html css/styles.css js/main.js
```

## Publicar

Es un sitio estático: puedes subirlo tal cual a **Netlify**, **Vercel**,
GitHub Pages o cualquier hosting. Arrastra la carpeta a Netlify Drop
(https://app.netlify.com/drop) y listo.

## Estructura

```
index.html          # estructura de la página
css/styles.css      # estilos, tema y responsive
js/main.js          # configuración (SITE), render y animaciones
img/                # tus fotos por categoría
assets/             # favicon, imagen para compartir (og-image)
```
