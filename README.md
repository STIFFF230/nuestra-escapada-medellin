# Nuestra escapada a Medellín ✨

Sitio estático para un viaje en pareja desde Bucaramanga, del **jueves 10 al lunes 14 de diciembre de 2026**. Incluye itinerario, decisión compartida del Peñol, favoritos, mapa, lista de preparativos y versión para imprimir. Los horarios son aproximados; la ubicación y los horarios de los alumbrados 2026 quedan pendientes de la programación oficial.

## Estructura

- `index.html`: contenido, estructura semántica, iconos SVG y ganchos de interacción.
- `styles.css`: diseño adaptable, accesibilidad, movimiento reducido e impresión.
- `script.js`: datos del viaje y módulos de interacción en JavaScript vanilla.
- `assets/img/`: fotografías locales WebP y `og.jpg` para compartir.
- `assets/credits.json`: atribuciones originales, también incrustadas como `CREDITS` en JavaScript.

No requiere npm, compilación, servidor de aplicación ni backend. Google Fonts y Leaflet 1.9.4 se cargan en tiempo de ejecución; el mapa usa las teselas libres de OpenStreetMap (con su atribución). Sin conexión, se mantienen las tipografías del sistema y la lista de enlaces a Google Maps; las fotografías son locales.

## Ver localmente

Desde la carpeta del proyecto:

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Para revisar la sintaxis, si tienes Node:

```sh
node --check script.js
```

## Publicar en GitHub Pages

Cuando los archivos estén en la rama `main` del repositorio de GitHub:

1. Abre **Settings → Pages**.
2. En **Build and deployment**, selecciona **Deploy from branch**.
3. Elige **main** y **/ (root)** y guarda.

URL pública esperada: https://stifff230.github.io/nuestra-escapada-medellin/

## Editar el viaje

Los datos están al inicio de `script.js`: `DAYS` contiene días, textos, franjas aproximadas, imágenes y variantes del viernes; `SPOTS` contiene los lugares de la galería y sus coordenadas; `PLACES` y `ROUTE_LINK` contienen las paradas y el enlace de ruta. `CHECKLIST` usa identificadores estables para sus 11 pendientes. `IMAGE_SIZES` e `IMAGE_ALTS` describen las imágenes de apoyo.

El viernes combina `variants[penol].morning` con los elementos de `items` que correspondan a `onlyIf`. Los alumbrados no tienen coordenadas confirmadas y no se coloca un marcador para ellos.

Cuando se definan el **hotel en Cisneros y el Airbnb en Medellín**, actualiza `stay` y los textos correspondientes de `DAYS`, las tarjetas generales de `index.html` y los datos generales en `renderPrint()`. Hasta entonces deben permanecer “por seleccionar” / “por definir”. Si se agregan ubicaciones, usa únicamente datos confirmados. Verifica la carretera Cisneros → Piedra del Peñol antes del viaje; las líneas del mapa son ilustrativas.

## Datos guardados en este navegador

Todo acceso a `localStorage` está protegido con `try/catch`; si el navegador lo bloquea, las funciones siguen disponibles durante la sesión. No se sincronizan entre dispositivos.

| Clave | Contenido |
| --- | --- |
| `escapada:penol` | Decisión `subir` o `directo` (por defecto `subir`). |
| `escapada:dia` | Índice del último día consultado, de 0 a 4. |
| `escapada:favs` | Array de identificadores de lugares favoritos. |
| `escapada:checklist` | Array de identificadores de pendientes marcados. |

Los valores se serializan como JSON. “Reiniciar lista” borra únicamente las casillas, después de confirmar. Para reiniciar todas las preferencias, elimina estas cuatro claves desde las herramientas del navegador.

## Fotografías

Imágenes de Wikimedia Commons, con licencias de dominio público, CC BY y CC BY-SA. Autores: Yussef90, Bernard Gagnon, Juan Gómez, Xemenendura, Alejandro Rojas (SajoR), Paco Godoy, william gil, José Luiz, Luis90f, XalD, Jaroslav Jelínek, Javier Perez Montes, laloking97 y JoranL.

El detalle por archivo, autor, licencia y enlace a la fuente está en el **footer del sitio** y en `assets/credits.json`; se incorpora como constante `CREDITS` en `script.js`, sin `fetch`. Las imágenes se presentan en WebP con recorte visual adaptable. Las fotos de alumbrados corresponden a años anteriores y sirven únicamente de referencia. Al sustituir imágenes, conserva la atribución y las condiciones de su licencia.
