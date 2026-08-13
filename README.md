# Red Seal Industrial Electrician Study App

Aplicación web bilingüe (inglés/español) para estudiar vocabulario técnico y practicar preguntas tipo Red Seal de **Industrial Electrician**.

## Características

- Flashcards con algoritmo SM-2 simplificado.
- Pronunciación en inglés con Web Speech API (`en-CA`).
- Quiz de opción múltiple con explicación bilingüe.
- Pregunta de seguimiento para comprobar comprensión real.
- Simulacro de 50 reactivos con temporizador de práctica.
- Guías de estudio bilingües.
- Panel de progreso con estadísticas por bloque.
- Persistencia con `localStorage`.
- PWA instalable y caché offline mediante Service Worker.
- HTML, CSS y JavaScript vanilla: sin frameworks ni dependencias externas.

## Estructura

```text
red-seal-study-app/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── flashcards.js
│   ├── quiz.js
│   ├── progress.js
│   └── speech.js
├── data/
│   ├── questions.json
│   ├── terms.json
│   └── study_guides.json
├── assets/
│   └── icon.svg
├── manifest.json
├── service-worker.js
└── README.md
```

## Uso rápido

### Opción 1: abrir directamente

Abre `index.html` en Chrome, Edge o Firefox. En modo `file://`, la aplicación usa un respaldo embebido de los datos de ejemplo para evitar las restricciones CORS que algunos navegadores aplican a archivos JSON locales.

### Opción 2: servidor local (recomendado)

Desde la carpeta del proyecto:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

Al servirse por HTTP/HTTPS se cargan los archivos JSON de `data/` y el Service Worker puede registrar el modo offline.

## Datos

- `data/terms.json`: vocabulario y ejemplos bilingües.
- `data/questions.json`: preguntas, opciones, respuesta correcta, explicación y seguimiento.
- `data/study_guides.json`: rutas temáticas de estudio.

Para ampliar el banco, conserva la misma estructura JSON y usa IDs únicos.

## Progreso

El progreso se guarda únicamente en `localStorage` del navegador/dispositivo actual. Borrar los datos del navegador también elimina el progreso.

## GitHub Pages

Cuando el repositorio esté publicado, activa GitHub Pages desde **Settings → Pages → Deploy from a branch → main / root**. La aplicación no requiere compilación.

## Contribuir

1. Crea una rama para el cambio.
2. Modifica HTML/CSS/JS o amplía los JSON.
3. Valida que los JSON sean correctos y que JavaScript no tenga errores de sintaxis.
4. Prueba flashcards, quiz, audio, progreso y navegación en escritorio y móvil.
5. Abre un Pull Request describiendo el cambio y, si se modifica contenido normativo, cita la edición de la norma usada.

## Nota sobre contenido normativo

El proyecto es una herramienta de estudio. Los requisitos del Canadian Electrical Code, CSA Z462 y cualquier regla de examen deben verificarse contra las ediciones oficiales vigentes antes de usarse como referencia profesional.

## Corrección de consistencia aplicada al contenido inicial

En la pregunta de ejemplo sobre un circuito de 100 A, el archivo fuente marcaba `correct: 2` (opción C), pero su propia explicación concluye que la opción suficiente es **D) #1 AWG**. Para evitar que el quiz calificara en contradicción con la explicación suministrada, esta implementación usa `correct: 3` (opción D). Esta corrección es únicamente de consistencia interna del material proporcionado y no sustituye una verificación normativa independiente.
