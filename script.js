'use strict';

const maps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

const PLACES = {
  bucaramanga: { name: 'Bucaramanga', q: 'Bucaramanga, Santander', ll: [7.1193, -73.1227] },
  cisneros:    { name: 'Cisneros', q: 'Cisneros, Antioquia', ll: [6.5378, -75.0880] },
  medellin:    { name: 'Medellín', q: 'Medellín, Antioquia', ll: [6.2442, -75.5812] },
};

// Galería: los 9 lugares (orden de la galería)
const SPOTS = [
  { id:'comuna13', name:'Comuna 13', day:'Domingo 13', img:'comuna13', q:'Escaleras eléctricas Comuna 13, Medellín', ll:[6.2560,-75.6205],
    alt:'Mural de un rostro en las escaleras de la Comuna 13', desc:'Grafitis, escaleras eléctricas y una historia de transformación que se cuenta en cada muro.' },
  { id:'provenza', name:'Provenza', day:'Viernes 11', img:'provenza', q:'Provenza, El Poblado, Medellín', ll:[6.2093,-75.5660],
    alt:'Calle de Provenza de noche, con terrazas iluminadas y gente', desc:'Calles arboladas, terrazas y restaurantes; el plan perfecto para nuestra primera noche.' },
  { id:'arvi', name:'Parque Arví', day:'Sábado 12', img:'arvi', q:'Parque Arví, Medellín', ll:[6.2807,-75.5032],
    alt:'Cabinas del Metrocable sobre el bosque del Parque Arví', desc:'Bosque, senderos y aire de montaña, al que se llega volando sobre la ciudad en Metrocable.' },
  { id:'pueblito', name:'Pueblito Paisa', day:'Domingo 13', img:'pueblito', q:'Pueblito Paisa, Cerro Nutibara, Medellín', ll:[6.2366,-75.5797],
    alt:'Plaza del Pueblito Paisa con casas blancas de balcones', desc:'Un pueblito antioqueño tradicional en la cima del Cerro Nutibara, con vista a la ciudad.' },
  { id:'poblado', name:'El Poblado', day:'Viernes 11', img:'poblado', q:'El Poblado, Medellín', ll:[6.2086,-75.5672],
    alt:'Edificios iluminados de El Poblado de noche', desc:'Parques, cafés y vida nocturna: nuestro primer paseo por Medellín.' },
  { id:'botero', name:'Plaza Botero', day:'Sábado 12', img:'botero', q:'Plaza Botero, Medellín', ll:[6.2522,-75.5687],
    alt:'Escultura de Fernando Botero en la Plaza Botero, con palmeras al fondo', desc:'Las esculturas monumentales del maestro Fernando Botero, al aire libre en el centro.' },
  { id:'picacho', name:'Mirador El Picacho', day:'Domingo 13', img:'picacho', q:'Cerro El Picacho, Medellín', ll:[6.2955,-75.5929],
    alt:'Vista panorámica del valle de Medellín desde el Cerro El Picacho', desc:'Uno de los cerros tutelares de la ciudad, con una vista enorme del valle de Aburrá.' },
  { id:'alumbrados', name:'Alumbrados navideños', day:'Sábado 12 · noche', img:'alumbrados', q:'Alumbrados navideños Medellín', ll:null, wide:true,
    alt:'Figuras de luces navideñas de colores en Medellín (foto de referencia de años anteriores)', desc:'La tradición decembrina que llena Medellín de luces. Ubicación y horarios 2026 por confirmar.' },
  { id:'penol', name:'Piedra del Peñol', day:'Viernes 11 · opcional', img:'penol', q:'Piedra del Peñol, Guatapé, Antioquia', ll:[6.2207,-75.1794], optional:true,
    alt:'La Piedra del Peñol con su escalera en zigzag bajo el cielo azul', desc:'Unos 740 escalones y una vista increíble sobre los embalses. Solo si ambos queremos subir.' },
];

const ROUTE_LINK = penol => {
  const wp = penol ? 'Cisneros, Antioquia|Piedra del Peñol, Guatapé' : 'Cisneros, Antioquia';
  return 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent('Bucaramanga, Santander')
    + '&destination=' + encodeURIComponent('Medellín, Antioquia') + '&waypoints=' + encodeURIComponent(wp) + '&travelmode=driving';
};

// Itinerario. `place` = id de SPOTS o de PLACES para el botón de Maps. `special` marca bloques especiales.
const DAYS = [
  { id:'jue', short:'Jue 10', emoji:'🚗', date:'Jueves 10 de diciembre', kicker:'Comienza la aventura',
    title:'El comienzo de nuestra historia', quote:'Todo gran viaje empieza con una buena canción y la carretera por delante.',
    stay:'Hotel en Cisneros · por seleccionar', imgs:['cisneros'],
    note:'Hoy es exclusivamente para viajar: sin actividades turísticas programadas.',
    items:[
      { time:'12:00 p. m.', title:'Salimos desde Bucaramanga', text:'Maletas en el baúl, playlist lista y nuestro carro rumbo a Antioquia.', place:'bucaramanga' },
      { time:'Tarde', title:'Carretera hacia Cisneros', text:'Kilómetros de paisaje, conversación y canciones a todo volumen.' },
      { time:'Durante el camino', title:'Paradas para descansar y comer', text:'Sin afanes: paramos cuando lo necesitemos para estirar las piernas, comer algo y disfrutar el viaje.' },
      { time:'5:00 – 8:00 p. m. aprox.', title:'Llegada a Cisneros', text:'La hora depende de las condiciones de la carretera.', place:'cisneros' },
      { time:'Noche', title:'Hotel, cena y descanso', text:'Check-in, una cena rica y a dormir: mañana empieza lo bueno.' },
    ] },
  { id:'vie', short:'Vie 11', emoji:'🪨', date:'Viernes 11 de diciembre', kicker:'Entre montañas y luces',
    title:'Nuestra primera gran aventura', quote:'Algunas vistas se merecen cada escalón… y otras, cada minuto de descanso.',
    stay:'Airbnb en Medellín · por definir',
    variants:{
      subir:{ imgs:['penol','provenza'], morning:[
        { time:'Mañana temprano', title:'Desayuno y salida', text:'Desayunamos temprano y salimos desde Cisneros hacia la Piedra del Peñol.', place:'cisneros' },
        { time:'Mañana', title:'Subimos la Piedra del Peñol', text:'Si ambos estamos de acuerdo, subimos los aproximadamente 740 escalones. Cada descanso es una excusa para mirar atrás.', place:'penol', special:'penol' },
        { time:'Mañana', title:'Mirador y fotos', text:'Arriba nos esperan los embalses y una vista que vale cada paso. Tiempo para fotos y para no hacer nada.', place:'penol' },
      ]},
      directo:{ imgs:['poblado','provenza'], morning:[
        { time:'Mañana', title:'Desayuno sin afán', text:'Despertamos con calma en Cisneros y desayunamos tranquilos.', place:'cisneros', special:'penol' },
        { time:'Mañana', title:'Rumbo directo a Medellín', text:'Una mañana de carretera más relajada, sin desvíos.', place:'medellin' },
        { time:'Mediodía', title:'Tiempo libre', text:'Llegamos con más tiempo: para descansar, dar una vuelta o simplemente no tener prisa.' },
      ]},
    },
    items:[
      { time:'Mediodía', title:'Viaje hacia Medellín y almuerzo', text:'Seguimos el camino y paramos a almorzar.', place:'medellin', onlyIf:'subir' },
      { time:'Mediodía', title:'Almuerzo', text:'Nuestro primer almuerzo en Medellín.', onlyIf:'directo' },
      { time:'Tarde', title:'Llegada al Airbnb', text:'Nos instalamos, nos duchamos y descansamos un rato (según la hora de check-in).' },
      { time:'Noche', title:'El Poblado y Provenza', text:'Caminamos por El Poblado y conocemos Provenza: calles arboladas, luces y buen ambiente.', place:'provenza' },
      { time:'Noche', title:'Cena y ambiente nocturno', text:'Cenamos en algún restaurante de la zona y disfrutamos la noche.', place:'poblado' },
    ] },
  { id:'sab', short:'Sáb 12', emoji:'🎄', date:'Sábado 12 de diciembre', kicker:'Naturaleza y Navidad',
    title:'Medellín desde las alturas', quote:'Desde arriba la ciudad se ve más pequeña, y el momento, más grande.',
    stay:'Airbnb en Medellín · por definir', imgs:['arvi','botero'],
    items:[
      { time:'Mañana', title:'Desayuno y Metro de Medellín', text:'Desayunamos y nos movemos en el Metro, el orgullo de la ciudad.' },
      { time:'Mañana', title:'Metrocable hacia Parque Arví', text:'Subimos en cabina sobre las montañas: una de las vistas más bonitas del viaje.', place:'arvi' },
      { time:'Mañana', title:'Parque Arví', text:'Naturaleza, caminatas entre el bosque y muchas fotos.', place:'arvi' },
      { time:'Mediodía', title:'Almuerzo y regreso al centro', text:'Almorzamos y bajamos hacia la zona central de Medellín.' },
      { time:'Tarde', title:'Plaza Botero', text:'Conocemos las esculturas del maestro Fernando Botero y recorremos los alrededores mientras todavía hay luz de día.', place:'botero' },
      { time:'Noche', title:'Los alumbrados navideños', text:'Caminamos entre las luces, tomamos fotos y disfrutamos el ambiente decembrino.', place:'alumbrados', special:'alumbrados' },
    ] },
  { id:'dom', short:'Dom 13', emoji:'🎨', date:'Domingo 13 de diciembre', kicker:'Cultura, colores y miradores',
    title:'Los colores de Medellín', quote:'Hay ciudades que se recorren y otras que se cuentan en colores.',
    stay:'Airbnb en Medellín · por definir', imgs:['comuna13','pueblito'],
    items:[
      { time:'Mañana', title:'Desayuno', text:'Energía para un día lleno de caminatas.' },
      { time:'Mañana', title:'Comuna 13', text:'Recorremos sus grafitis y escaleras eléctricas, conocemos su historia, su arte urbano y sus espacios culturales. Fotos y tiempo para disfrutar el sector.', place:'comuna13' },
      { time:'Mediodía', title:'Almuerzo', text:'Un almuerzo rico para recargar.' },
      { time:'Mediodía', title:'Cerro Nutibara y Pueblito Paisa', text:'Paseamos por sus calles tradicionales y disfrutamos las vistas de Medellín.', place:'pueblito' },
      { time:'Tarde', title:'Mirador El Picacho', text:'Caminamos por los sectores públicos habilitados del cerro, si el acceso y el clima lo permiten, y tomamos fotos de la vista panorámica antes de que oscurezca.', place:'picacho' },
      { time:'Noche', title:'Cena tranquila', text:'Una cena sin prisa, un último paseo opcional por Medellín y regreso al Airbnb.' },
    ] },
  { id:'lun', short:'Lun 14', emoji:'💗', date:'Lunes 14 de diciembre', kicker:'Hasta la próxima, Medellín',
    title:'El regreso, con nuevas historias', quote:'No es un adiós, es un «hasta la próxima».',
    stay:'De regreso a casa', imgs:['metrocable-noche'],
    items:[
      { time:'Mañana', title:'Desayuno', text:'El último desayuno paisa del viaje.' },
      { time:'Mañana', title:'Maletas y salida del Airbnb', text:'Organizamos todo y nos despedimos del apartamento.' },
      { time:'Después', title:'Viaje de regreso a Bucaramanga', text:'La carretera de vuelta, ahora con muchas historias para contar.', place:'bucaramanga' },
      { time:'En el camino', title:'Paradas de descanso', text:'Paramos las veces que haga falta.' },
      { time:'Al final del día', title:'Llegada a casa', text:'Cansados, felices y pensando en la próxima escapada.' },
    ],
    closing:'El viaje termina, pero los recuerdos apenas comienzan.' },
];
// Viernes = variants[penol].morning + items filtrados por onlyIf.


const CREDITS = {
 "hero": {
  "author": "Yussef90 at en.wikipedia",
  "license": "Public domain",
  "licenseUrl": "",
  "file": "View of Medellín at night.JPG",
  "source": "https://commons.wikimedia.org/wiki/File%3AView_of_Medell%C3%ADn_at_night.JPG"
 },
 "hero-sm": {
  "author": "Yussef90 at en.wikipedia",
  "license": "Public domain",
  "licenseUrl": "",
  "file": "View of Medellín at night.JPG",
  "source": "https://commons.wikimedia.org/wiki/File%3AView_of_Medell%C3%ADn_at_night.JPG"
 },
 "comuna13": {
  "author": "Bernard Gagnon",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Graffiti in Comuna 13, Medellín 04.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AGraffiti_in_Comuna_13%2C_Medell%C3%ADn_04.jpg"
 },
 "comuna13-calle": {
  "author": "Bernard Gagnon",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Graffiti in Comuna 13, Medellín 02.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AGraffiti_in_Comuna_13%2C_Medell%C3%ADn_02.jpg"
 },
 "escaleras": {
  "author": "Juan Gómez",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
  "file": "Escaleras eléctricas de la comuna 13, Medellín - 01.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AEscaleras_el%C3%A9ctricas_de_la_comuna_13%2C_Medell%C3%ADn_-_01.jpg"
 },
 "provenza": {
  "author": "Xemenendura",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Provenza, Medellín 1.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AProvenza%2C_Medell%C3%ADn_1.jpg"
 },
 "arvi": {
  "author": "Alejandro Rojas (SajoR)",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Metrocable del Parque Arví - Medellín.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AMetrocable_del_Parque_Arv%C3%AD_-_Medell%C3%ADn.jpg"
 },
 "arvi-bosque": {
  "author": "Paco Godoy",
  "license": "CC BY-SA 3.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
  "file": "Bosque Parque Arví.JPG",
  "source": "https://commons.wikimedia.org/wiki/File%3ABosque_Parque_Arv%C3%AD.JPG"
 },
 "pueblito": {
  "author": "SajoR",
  "license": "CC BY-SA 2.5",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5",
  "file": "Pueblito Paisa-Medellin.JPG",
  "source": "https://commons.wikimedia.org/wiki/File%3APueblito_Paisa-Medellin.JPG"
 },
 "poblado": {
  "author": "william gil",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
  "file": "El poblado, Medellín.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AEl_poblado%2C_Medell%C3%ADn.jpg"
 },
 "botero": {
  "author": "José Luiz",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Plaza Botero - Medellín - Colombia 2024.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3APlaza_Botero_-_Medell%C3%ADn_-_Colombia_2024.jpg"
 },
 "picacho": {
  "author": "Luis90f",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Panorámica de Medellín desde el Cerro El Picacho.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3APanor%C3%A1mica_de_Medell%C3%ADn_desde_el_Cerro_El_Picacho.jpg"
 },
 "alumbrados": {
  "author": "XalD",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Alumbrado navideño en Medellín, 2022 - Parques del Río Medellín - 90.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AAlumbrado_navide%C3%B1o_en_Medell%C3%ADn%2C_2022_-_Parques_del_R%C3%ADo_Medell%C3%ADn_-_90.jpg"
 },
 "alumbrados-2": {
  "author": "SajoR",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Alumbrados 2013 - Rio Medellin (2).jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AAlumbrados_2013_-_Rio_Medellin_%282%29.jpg"
 },
 "penol": {
  "author": "Jaroslav Jelínek",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "El Peñón de Guatapé 2014.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AEl_Pe%C3%B1%C3%B3n_de_Guatap%C3%A9_2014.jpg"
 },
 "penol-vista": {
  "author": "Javier Perez Montes",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Vista desde la Piedra del Penol - Colombia 01.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AVista_desde_la_Piedra_del_Penol_-_Colombia_01.jpg"
 },
 "cisneros": {
  "author": "laloking97",
  "license": "CC BY-SA 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
  "file": "Cisneros-Panoramica-Antioquia.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3ACisneros-Panoramica-Antioquia.jpg"
 },
 "metrocable": {
  "author": "Bernard Gagnon",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Línea K (Medellín Metrocable) 01.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AL%C3%ADnea_K_%28Medell%C3%ADn_Metrocable%29_01.jpg"
 },
 "metrocable-noche": {
  "author": "JoranL",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "file": "Metrocable in Medellín by night.jpg",
  "source": "https://commons.wikimedia.org/wiki/File%3AMetrocable_in_Medell%C3%ADn_by_night.jpg"
 }
};

const CHECKLIST = [
  { id:'carro', text:'Revisar el carro' },
  { id:'documentos', text:'Confirmar documentos y seguro del vehículo' },
  { id:'hotel', text:'Reservar hotel en Cisneros' },
  { id:'airbnb', text:'Reservar Airbnb en Medellín' },
  { id:'maletas', text:'Preparar maletas' },
  { id:'cargadores', text:'Llevar cargadores' },
  { id:'ropa', text:'Llevar ropa cómoda' },
  { id:'zapatos', text:'Llevar zapatos para caminar' },
  { id:'clima', text:'Revisar clima y estado de las vías' },
  { id:'musica', text:'Preparar música para el camino' },
  { id:'ganas', text:'¡Tener muchas ganas de viajar!' },
];
const IMAGE_SIZES = {
  alumbrados:[1400,1050], 'alumbrados-2':[1280,960], arvi:[1280,720],
  'arvi-bosque':[1280,960], botero:[1280,606], cisneros:[1280,960],
  comuna13:[1280,852], 'comuna13-calle':[1280,853], escaleras:[960,1538],
  hero:[1920,1446], 'hero-sm':[900,678], metrocable:[1280,852],
  'metrocable-noche':[1400,932], penol:[1280,968], 'penol-vista':[1280,853],
  picacho:[1280,720], poblado:[1280,853], provenza:[1280,960], pueblito:[1280,960],
};
const IMAGE_ALTS = {
  cisneros:'Cisneros entre las montañas de Antioquia',
  'metrocable-noche':'Cabina del Metrocable sobre Medellín de noche',
  'penol-vista':'Embalses y montañas vistos desde la Piedra del Peñol',
  'arvi-bosque':'Sendero entre los árboles del Parque Arví',
  'comuna13-calle':'Murales y calles de la Comuna 13 de Medellín',
  'alumbrados-2':'Luces navideñas de Medellín en 2013, foto de referencia',
};
const SCHEDULE_NOTE = 'Horarios aproximados: dependen de la carretera, el clima y de nosotros 😉';
const LIGHTS_NOTE = 'Ubicación y horarios 2026 por confirmar con la programación oficial.';
const OFFICIAL_LIGHTS = 'https://www.google.com/search?q=' + encodeURIComponent('Alumbrados navideños Medellín 2026 programación oficial');
const $ = (selector, root = document) => root.querySelector(selector);
// Número de WhatsApp de Stiven con indicativo (p. ej. '573001234567'). Vacío = ella elige el chat.
const STIVEN_WHATSAPP = '';
const ASK = {
  si:{ reply:'¡Me hiciste el día, Sweet! ✨ Entonces es una intención de los dos. Ahora nos toca lo más importante: pedir permiso y hacerlo bien.',
    message:'Hola, Stiven 💛 Vi nuestra escapada a Medellín y mi respuesta es: ¡sí, acepto! (falta pedir permiso 😉)', hero:'Dijiste que sí 💛' },
  hablemos:{ reply:'Me parece perfecto. Lo hablamos con calma y lo organizamos juntos, sin afán.',
    message:'Hola, Stiven 💛 Vi nuestra escapada a Medellín. Me encanta la idea, pero hablemos.', hero:'Ya respondiste la pregunta 💌' },
  pensar:{ reply:'Tómate tu tiempo, Sweet. La invitación sigue aquí, esperándote.',
    message:'Hola, Stiven ✨ Vi nuestra escapada a Medellín. Déjame pensarlo un poquito.', hero:'La pregunta te sigue esperando 💌' },
};

const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const behavior = () => reducedMotion() ? 'instant' : 'smooth';
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const external = (url, text, className = 'text-link', label = '') => `<a class="${className}" href="${escapeHTML(url)}" target="_blank" rel="noopener"${label ? ` aria-label="${escapeHTML(label)}"` : ''}>${escapeHTML(text)} ${icon('external')}</a>`;
const placeById = id => PLACES[id] || SPOTS.find(spot => spot.id === id);

// All storage operations are optional; private browsing must remain functional.
function readStorage(key, fallback) {
  try { const value = localStorage.getItem('escapada:' + key); return value === null ? fallback : JSON.parse(value); }
  catch { return fallback; }
}
function writeStorage(key, value) {
  try { localStorage.setItem('escapada:' + key, JSON.stringify(value)); } catch { /* In-memory state remains available. */ }
}
function storedIds(key, allowed) {
  const value = readStorage(key, []);
  return new Set(Array.isArray(value) ? value.filter(id => allowed.includes(id)) : []);
}
const savedDay = readStorage('dia', 0);
const state = {
  penol: readStorage('penol', 'subir') === 'directo' ? 'directo' : 'subir',
  day: Number.isInteger(savedDay) && savedDay >= 0 && savedDay < DAYS.length ? savedDay : 0,
  favs: storedIds('favs', SPOTS.map(spot => spot.id)),
  checks: storedIds('checklist', CHECKLIST.map(item => item.id)),
  mapView:'ruta',
  ask: Object.hasOwn(ASK, readStorage('aceptas', '')) ? readStorage('aceptas', '') : '',
};
let map, markerLayer, routeLine, markers = new Map();
let toastTimer;
function toast(message) {
  const node = $('[data-toast]');
  clearTimeout(toastTimer);
  node.textContent = message;
  node.classList.add('is-visible');
  toastTimer = setTimeout(() => node.classList.remove('is-visible'), 3600);
}
function imageFrame(id, name, className = '') {
  const [width, height] = IMAGE_SIZES[id];
  const alt = SPOTS.find(spot => spot.img === id)?.alt || IMAGE_ALTS[id] || name;
  return `<div class="img-frame ${className}" data-fallback="${escapeHTML(name)}"><img src="assets/img/${id}.webp" width="${width}" height="${height}" loading="lazy" decoding="async" alt="${escapeHTML(alt)}"></div>`;
}
function checkImages(root = document) {
  $$('img', root).forEach(img => {
    if (img.complete && img.naturalWidth === 0) img.closest('.img-frame')?.classList.add('is-fallback');
  });
}
function initImages() {
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) event.target.closest('.img-frame')?.classList.add('is-fallback');
  }, true);
  checkImages();
}
function initCountdown() {
  const start = new Date('2026-12-10T00:00:00-05:00').getTime();
  const end = new Date('2026-12-15T00:00:00-05:00').getTime();
  const root = $('[data-countdown]');
  const update = () => {
    const now = Date.now();
    const left = Math.max(0, Math.floor((start - now) / 1000));
    const values = {d:Math.floor(left / 86400), h:Math.floor(left / 3600) % 24, m:Math.floor(left / 60) % 60, s:left % 60};
    $('[data-countdown-done]', root).hidden = now < start;
    $('.countdown__grid', root).hidden = now >= start;
    $('#countdown-label').hidden = now >= start;
    $('[data-countdown-done]', root).textContent = now < end ? '¡La aventura ya comenzó! 🚗' : 'Qué viaje tan bonito fue ❤️';
    $$('[data-unit]', root).forEach(node => {
      const value = String(values[node.dataset.unit]).padStart(2, '0');
      if (node.textContent === value) return;
      node.textContent = value;
      if (!reducedMotion() && node.animate) node.animate([{opacity:.45, transform:'translateY(3px)'}, {opacity:1, transform:'translateY(0)'}], {duration:260});
    });
  };
  update();
  setInterval(update, 1000);
}
function initNavigation() {
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-scroll], [data-nav], .brand, .skip-link');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash?.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior:behavior(), block:'start'});
    target.setAttribute('tabindex', '-1');
    target.focus({preventScroll:true});
  });
  const updateTopbar = () => $('[data-topbar]').classList.toggle('is-solid', window.scrollY > 32);
  window.addEventListener('scroll', updateTopbar, {passive:true});
  updateTopbar();
  const select = section => $$('[data-nav]').forEach(link => {
    const key = section === 'viaje' && link.closest('.tabbar') ? 'inicio' : section;
    const active = link.dataset.nav === key;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
  select('inicio');
  if ('IntersectionObserver' in window) {
    const visible = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      const current = [...visible].sort((a,b) => Math.abs(a.getBoundingClientRect().top - 100) - Math.abs(b.getBoundingClientRect().top - 100))[0];
      if (current) select(current.dataset.section);
    }, {rootMargin:'-15% 0px -55% 0px', threshold:0});
    $$('[data-section]').forEach(section => observer.observe(section));
  }
}
function initReveal() {
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    $$('.reveal').forEach(node => node.classList.add('is-visible'));
    return;
  }
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), {threshold:.06});
  $$('.reveal').forEach(node => observer.observe(node));
}
function dayContent(day) {
  const variant = day.variants?.[state.penol];
  return {imgs:variant?.imgs || day.imgs, items:[...(variant?.morning || []), ...day.items.filter(item => !item.onlyIf || item.onlyIf === state.penol)]};
}
function garland() { return '<div class="garland" aria-hidden="true">' + '<i></i>'.repeat(16) + '</div>'; }
function lightsBlock() {
  return `<aside class="lights">${garland()}<div class="lights__photos">${imageFrame('alumbrados','Alumbrados de años anteriores')}${imageFrame('alumbrados-2','Luces de Medellín')}</div><div class="lights__body"><p class="eyebrow eyebrow--light">Una noche para recordar</p><h4 class="lights__title">Medellín se enciende ✨</h4><p>Caminar entre las luces, tomar fotos y dejarnos llevar por el ambiente decembrino. Es uno de los momentos más especiales del viaje.</p><p class="lights__notice">${LIGHTS_NOTE}</p>${external(OFFICIAL_LIGHTS,'Buscar la programación oficial','btn btn--gold')}<p class="lights__caption">Foto de referencia: alumbrados de años anteriores.</p></div></aside>`;
}
function miniDecision() {
  return `<div class="mini-decision"><p>Cambiar decisión</p><div class="segmented" role="radiogroup" aria-label="Decisión del Peñol para el viernes">${['subir','directo'].map(value => `<button type="button" role="radio" class="segmented__btn" data-penol-choice="${value}" aria-checked="${state.penol === value}" tabindex="${state.penol === value ? 0 : -1}">${value === 'subir' ? 'Subir al Peñol' : 'Directo a Medellín'}</button>`).join('')}</div></div>`;
}
function renderDay(day, index) {
  const {imgs, items} = dayContent(day);
  const extra = {vie:state.penol === 'subir' ? 'penol-vista' : null, sab:'arvi-bosque', dom:'comuna13-calle'}[day.id];
  return `<article class="day-panel" id="panel-${day.id}" role="tabpanel" aria-labelledby="tab-${day.id}" tabindex="0" ${index !== state.day ? 'hidden' : ''}>
    <div class="day-heading"><div class="day-collage">${imgs.map(id => imageFrame(id,placeById(id)?.name || day.title)).join('')}</div><div class="day-heading__text"><p class="eyebrow">${day.date} · 2026</p><p class="day-kicker">${day.kicker}</p><h3>${day.title}</h3><blockquote>“${day.quote}”</blockquote><p class="stay">${icon('bed')}${day.stay}</p></div></div>
    <p class="notice">${icon('info')}<span>${SCHEDULE_NOTE}</span></p>${day.note ? `<p class="day-note">${day.note}</p>` : ''}${day.variants ? miniDecision() : ''}
    <ol class="timeline" role="list">${items.map(item => `<li class="timeline__item"><span class="timeline__time">${item.time}</span><div class="timeline__body"><h4>${item.title}</h4><p>${item.text}</p>${item.place ? external(maps(placeById(item.place).q),'Abrir en Google Maps') : ''}${item.special === 'alumbrados' ? lightsBlock() : ''}</div></li>`).join('')}</ol>
    ${extra ? imageFrame(extra, IMAGE_ALTS[extra], 'day-detail') : ''}${day.closing ? `<p class="day-closing">${day.closing}</p>` : ''}</article>`;
}
function syncDay(scrollTab = false) {
  const tabs = $$('[role="tab"]', $('[data-day-tabs]'));
  tabs.forEach((tab,index) => {
    tab.setAttribute('aria-selected', String(index === state.day));
    tab.tabIndex = index === state.day ? 0 : -1;
  });
  $$('.day-panel').forEach((panel,index) => { panel.hidden = index !== state.day; });
  $('[data-day-label]').textContent = `Día ${state.day + 1} de ${DAYS.length}`;
  $('[data-day-bar]').style.transform = `scaleX(${(state.day + 1) / DAYS.length})`;
  $('[data-day-prev]').disabled = state.day === 0;
  $('[data-day-next]').disabled = state.day === DAYS.length - 1;
  const tab = tabs[state.day];
  const tablist = $('[data-day-tabs]');
  tablist.style.setProperty('--tab-left', `${tab.offsetLeft}px`);
  tablist.style.setProperty('--tab-width', `${tab.offsetWidth}px`);
  if (scrollTab) tablist.scrollTo({left:Math.max(0, tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2), behavior:behavior()});
}
function chooseDay(index, focusTab = false, reposition = false) {
  state.day = Math.max(0, Math.min(DAYS.length - 1, index));
  writeStorage('dia', state.day);
  syncDay(true);
  if (focusTab) $(`#tab-${DAYS[state.day].id}`).focus({preventScroll:true});
  if (reposition) $('[data-day-label]').scrollIntoView({behavior:behavior(), block:'start'});
}
function initItinerary() {
  $('[data-day-tabs]').innerHTML = DAYS.map((day,index) => `<button class="day-tab" type="button" id="tab-${day.id}" role="tab" aria-controls="panel-${day.id}" aria-selected="${index === state.day}" tabindex="${index === state.day ? 0 : -1}"><span class="day-tab__date">${day.emoji} ${day.short}</span><span class="day-tab__title">${day.kicker}</span></button>`).join('');
  $('[data-day-panels]').innerHTML = DAYS.map(renderDay).join('');
  const tabs = $$('[role="tab"]', $('[data-day-tabs]'));
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => chooseDay(index));
    tab.addEventListener('keydown', event => {
      const next = {ArrowRight:(index + 1) % 5, ArrowLeft:(index + 4) % 5, Home:0, End:4}[event.key];
      if (next !== undefined) { event.preventDefault(); chooseDay(next, true); }
    });
  });
  $('[data-day-prev]').addEventListener('click', () => chooseDay(state.day - 1, true, true));
  $('[data-day-next]').addEventListener('click', () => chooseDay(state.day + 1, true, true));
  let start;
  const panels = $('[data-day-panels]');
  panels.addEventListener('touchstart', event => {
    start = event.touches.length === 1 && !event.target.closest('a, button, input') ? {x:event.touches[0].clientX, y:event.touches[0].clientY} : null;
  }, {passive:true});
  panels.addEventListener('touchend', event => {
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) chooseDay(state.day + (dx < 0 ? 1 : -1), false, true);
    start = null;
  }, {passive:true});
  panels.addEventListener('touchcancel', () => { start = null; }, {passive:true});
  window.addEventListener('resize', () => syncDay());
  if (document.fonts) document.fonts.ready.then(() => syncDay());
  syncDay(true);
}
function syncPenol() {
  $$('[data-penol-choice]').forEach(button => {
    const selected = button.dataset.penolChoice === state.penol;
    button.setAttribute('aria-checked', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $('[data-penol-status]').textContent = state.penol === 'subir' ? 'Elegimos subir juntos. La Piedra del Peñol está incluida en el viernes.' : 'Elegimos ir directo a Medellín. Esta vez, la Piedra del Peñol espera.';
  $('[data-route-penol]').classList.toggle('is-skipped', state.penol === 'directo');
  $('[data-route-penol-label]').textContent = state.penol === 'subir' ? 'Vie 11 · opcional · incluido' : 'Omitido esta vez';
  const badge = $('#spot-penol .spot__status');
  if (badge) badge.textContent = state.penol === 'subir' ? 'Incluido' : 'Esta vez no';
  $$('[data-route-link]').forEach(link => { link.href = ROUTE_LINK(state.penol === 'subir'); });
}
function choosePenol(value) {
  if (!['subir','directo'].includes(value) || value === state.penol) return;
  const focused = document.activeElement;
  const restoreMiniFocus = focused?.closest('.mini-decision');
  state.penol = value;
  writeStorage('penol', value);
  $('#panel-vie').outerHTML = renderDay(DAYS[1], 1);
  syncPenol();
  renderMap();
  renderPrint();
  checkImages($('#panel-vie'));
  if (restoreMiniFocus) $(`#panel-vie [data-penol-choice="${value}"]`).focus({preventScroll:true});
  toast('Itinerario del viernes actualizado ✓');
}
function initPenol() {
  document.addEventListener('click', event => {
    const choice = event.target.closest('[data-penol-choice]');
    if (choice) choosePenol(choice.dataset.penolChoice);
  });
  document.addEventListener('keydown', event => {
    const choice = event.target.closest('[data-penol-choice]');
    if (!choice || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const group = choice.closest('[role="radiogroup"]');
    const value = event.key === 'Home' ? 'subir' : event.key === 'End' ? 'directo' : state.penol === 'subir' ? 'directo' : 'subir';
    choosePenol(value);
    // The Friday group is replaced while the main decision group stays in place.
    const liveGroup = group.isConnected ? group : $('#panel-vie [role="radiogroup"]');
    $(`[data-penol-choice="${value}"]`, liveGroup).focus({preventScroll:true});
  });
  $$('#penol .garland, #aceptas .garland').forEach(node => { node.innerHTML = '<i></i>'.repeat(16); });
  syncPenol();
}
function renderFavorites() {
  const selected = SPOTS.filter(spot => state.favs.has(spot.id));
  $('[data-fav-count]').textContent = selected.length;
  $('[data-fav-empty]').hidden = selected.length > 0;
  $('[data-fav-list]').innerHTML = selected.map(spot => `<li class="fav-item">${imageFrame(spot.img, spot.name)}<div><h3>${spot.name}</h3><p>${spot.day}</p></div><button class="icon-btn" type="button" value="${spot.id}" aria-label="Quitar ${escapeHTML(spot.name)} de favoritos">${icon('heart')}</button></li>`).join('');
  $$('button', $('[data-spots]')).forEach(button => {
    const selected = state.favs.has(button.value);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', `${selected ? 'Quitar' : 'Guardar'} ${placeById(button.value).name} ${selected ? 'de' : 'en'} favoritos`);
  });
  checkImages($('[data-fav-list]'));
}
function toggleFavorite(id) {
  if (!SPOTS.some(spot => spot.id === id)) return;
  state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
  writeStorage('favs', [...state.favs]);
  renderFavorites();
  toast(state.favs.has(id) ? 'Guardado en nuestros favoritos ♥' : 'Lugar quitado de favoritos');
}
function initGallery() {
  $('[data-spots]').innerHTML = SPOTS.map((spot,index) => `<li class="spot ${spot.wide ? 'spot--wide' : ''}" id="spot-${spot.id}">${imageFrame(spot.img,spot.name,'spot__media')}<div class="spot__top"><span class="spot__number">${String(index + 1).padStart(2,'0')}</span><button type="button" class="icon-btn spot__heart" value="${spot.id}" aria-pressed="false" aria-label="Guardar ${spot.name} en favoritos">${icon('heart')}</button></div><div class="spot__body"><div class="chips"><span class="chip">${spot.day}</span>${spot.optional ? '<span class="chip">Opcional</span><span class="chip chip--gold spot__status"></span>' : ''}</div><h3>${spot.name}</h3><p class="spot__desc">${spot.desc}</p>${external(maps(spot.q),'Ver ubicación')}${spot.id === 'alumbrados' ? `<p class="spot__reference">${LIGHTS_NOTE} Foto de referencia de años anteriores.</p>` : ''}</div></li>`).join('');
  $('[data-spots]').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) toggleFavorite(button.value);
  });
  $('[data-fav-list]').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const index = $$('button', $('[data-fav-list]')).indexOf(button);
    toggleFavorite(button.value);
    const remaining = $$('button', $('[data-fav-list]'));
    (remaining[Math.min(index, remaining.length - 1)] || $('a', $('[data-fav-empty]'))).focus({preventScroll:true});
  });
  renderFavorites();
}

function routePlaces() {
  return [{id:'bucaramanga', ...PLACES.bucaramanga, day:'Jueves 10 · salida / lunes 14 · regreso'},
    {id:'cisneros', ...PLACES.cisneros, day:'Jueves 10 · primera noche'},
    ...(state.penol === 'subir' ? [placeById('penol')] : []),
    {id:'medellin', ...PLACES.medellin, day:'Viernes 11 — lunes 14'}];
}
function visibleMapPlaces() {
  return state.mapView === 'ruta' ? routePlaces() : SPOTS.filter(spot => !spot.optional);
}
function renderMap() {
  const places = visibleMapPlaces();
  $$('[data-map-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapView === state.mapView)));
  $('[data-map-places]').innerHTML = places.map(place => `<li class="map-place">${place.ll ? `<button type="button" class="map-place__center" value="${place.id}" ${!map ? 'disabled' : ''}>${icon('pin')}${place.name}</button>` : `<span class="map-place__pending">${place.name} · ubicación 2026 por confirmar</span>`}${external(maps(place.q),'Abrir en Maps','text-link',`Abrir ${place.name} en Google Maps`)}</li>`).join('');
  if (!map) return;
  markerLayer.clearLayers();
  markers.clear();
  if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
  const points = places.filter(place => place.ll);
  points.forEach((place,index) => {
    const marker = window.L.marker(place.ll, {title:place.name, alt:place.name,
      icon:window.L.divIcon({className:'map-pin', html:`<span>${index + 1}</span>`, iconSize:[36,36], iconAnchor:[18,18]})})
      .bindPopup(`<div class="map-popup"><h3>${place.name}</h3><p>${place.day}</p>${external(maps(place.q),'Abrir en Google Maps')}</div>`).addTo(markerLayer);
    markers.set(place.id, marker);
  });
  if (state.mapView === 'ruta') routeLine = window.L.polyline(points.map(place => place.ll), {color:'#C9A45C', weight:3, dashArray:'5 10', opacity:.9, interactive:false}).addTo(map);
  map.invalidateSize();
  map.fitBounds(points.map(place => place.ll), {padding:[32,32], maxZoom:13, animate:!reducedMotion()});
}
function initMap() {
  const fallback = () => {
    $('[data-map]').hidden = true;
    $('[data-map-fallback]').hidden = false;
  };
  const mount = () => {
    if (map) return;
    if (!window.L) { fallback(); return; }
    try {
      map = window.L.map($('[data-map]'), {scrollWheelZoom:false});
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>', maxZoom:19,
      }).on('tileerror', () => { $('[data-map-fallback]').hidden = false; }).addTo(map);
      markerLayer = window.L.layerGroup().addTo(map);
      renderMap();
    } catch {
      if (map) map.remove();
      map = undefined;
      fallback();
      renderMap();
    }
  };
  renderMap();
  $$('[data-map-view]').forEach(button => button.addEventListener('click', () => {
    state.mapView = button.dataset.mapView;
    renderMap();
  }));
  $('[data-map-places]').addEventListener('click', event => {
    const button = event.target.closest('button');
    const marker = button && markers.get(button.value);
    if (!marker || !map) return;
    map.setView(marker.getLatLng(), 14, {animate:!reducedMotion()});
    marker.openPopup();
    $('[data-map]').scrollIntoView({behavior:behavior(), block:'center'});
  });
  if (!window.L) { fallback(); return; }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { mount(); observer.disconnect(); }
    }, {rootMargin:'350px'});
    observer.observe($('[data-map]'));
  } else mount();
}
function syncChecklist() {
  const count = state.checks.size;
  const percent = Math.round(count / CHECKLIST.length * 100);
  $('[data-progress-count]').textContent = `${count} de ${CHECKLIST.length}`;
  $('[data-progress-pct]').textContent = `${percent}%`;
  $('[data-progress-bar]').setAttribute('aria-valuenow', count);
  $('[data-progress-fill]').style.transform = `scaleX(${count / CHECKLIST.length})`;
  $('[data-progress-msg]').textContent = count === 11 ? '¡Listos para la aventura! ✨' : count === 0 ? 'Empecemos por aquí' : count < 6 ? 'Cada detalle nos acerca al viaje' : 'Ya casi tenemos todo listo';
  $('[data-progress]').classList.toggle('is-complete', count === 11);
  $$('input', $('[data-checklist]')).forEach(input => { input.checked = state.checks.has(input.value); });
}
function initChecklist() {
  $('[data-checklist]').innerHTML = CHECKLIST.map(item => `<li class="check"><label for="check-${item.id}"><input type="checkbox" id="check-${item.id}" value="${item.id}"><span class="check__box" aria-hidden="true">${icon('check')}</span><span class="check__text">${item.text}</span></label></li>`).join('');
  $('[data-checklist]').addEventListener('change', event => {
    const input = event.target;
    if (!input.matches('input[type="checkbox"]')) return;
    input.checked ? state.checks.add(input.value) : state.checks.delete(input.value);
    writeStorage('checklist', [...state.checks]);
    syncChecklist();
    if (state.checks.size === 11) toast('¡Listos para la aventura! ✨');
  });
  $('[data-checklist-reset]').addEventListener('click', () => {
    if (!window.confirm('¿Reiniciar la lista y desmarcar todos los pendientes?')) return;
    state.checks.clear();
    writeStorage('checklist', []);
    syncChecklist();
    toast('Lista reiniciada');
  });
  syncChecklist();
}
async function copyLink(url) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    const focused = document.activeElement;
    const input = document.createElement('textarea');
    input.className = 'clipboard-helper';
    input.value = url;
    input.setAttribute('readonly', '');
    input.setAttribute('aria-label', 'Enlace del viaje');
    document.body.append(input);
    input.select();
    input.setSelectionRange(0, input.value.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Offer manual copying below. */ }
    input.remove();
    focused?.focus({preventScroll:true});
    return copied;
  }
}
function initSharing() {
  const title = 'Sweet, esta escapada es para ti ✨';
  const text = '5 días, una ciudad llena de luces y muchas historias por vivir. 10 — 14 de diciembre, 2026.';
  const url = location.href;
  $$('[data-whatsapp]').forEach(link => { link.href = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url); });
  $$('[data-share]').forEach(button => button.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({title, text, url}); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    if (await copyLink(url)) toast('Enlace copiado ✓');
    else { toast('Puedes copiar el enlace desde esta ventana'); window.prompt('Copia el enlace de nuestra escapada:', url); }
  }));
}
function renderPrint() {
  $('[data-print-root]').innerHTML = `<h1>Nuestra escapada a Medellín ✨</h1><p><em>Para Dulce Trejos, mi Sweet.</em></p><p>Jueves 10 — lunes 14 de diciembre de 2026 · Sweet y Stiven</p><p>Bucaramanga → Cisneros → ${state.penol === 'subir' ? 'Piedra del Peñol → ' : ''}Medellín → Bucaramanga</p><p>Transporte: Chevrolet Onix Turbo RS 2023.<br>Hotel en Cisneros: por seleccionar.<br>Apartamento Airbnb en Medellín: por definir.</p><p>Decisión del Peñol: ${state.penol === 'subir' ? 'subir juntos' : 'ir directamente a Medellín'}.</p><p>${SCHEDULE_NOTE}</p><p>Ruta ilustrativa. Verificar el tramo Cisneros → Piedra del Peñol antes de viajar.</p>${DAYS.map(day => `<section class="print-day"><h2>${day.date} de 2026 — ${day.title}</h2><p><em>“${day.quote}”</em></p><p>${day.stay}</p>${day.note ? `<p>${day.note}</p>` : ''}${dayContent(day).items.map(item => `<div class="print-moment"><h3>${item.time} · ${item.title}</h3><p>${item.text}</p>${item.special === 'alumbrados' ? `<p>${LIGHTS_NOTE}</p>` : ''}</div>`).join('')}${day.closing ? `<p><strong>${day.closing}</strong></p>` : ''}</section>`).join('')}`;
}
function initPrint() {
  renderPrint();
  $$('[data-print]').forEach(button => button.addEventListener('click', () => { renderPrint(); window.print(); }));
  window.addEventListener('beforeprint', renderPrint);
}
function renderAsk(celebrate = false) {
  const answer = ASK[state.ask];
  $$('[data-ask-choice]').forEach(button => {
    const active = button.dataset.askChoice === state.ask;
    button.setAttribute('aria-checked', String(active));
    button.tabIndex = active || (!state.ask && button.dataset.askChoice === 'si') ? 0 : -1;
  });
  $('[data-ask-answer]').hidden = !answer;
  $('[data-hero-ask-text]').textContent = answer ? answer.hero : 'Al final te espera una pregunta';
  if (!answer) return;
  $('[data-ask-reply]').textContent = answer.reply;
  $('[data-ask-whatsapp]').href = `https://wa.me/${STIVEN_WHATSAPP}?text=` + encodeURIComponent(answer.message);
  const sparks = $('[data-ask-sparks]');
  sparks.innerHTML = '';
  if (celebrate && state.ask === 'si' && !reducedMotion()) {
    sparks.innerHTML = Array.from({length:18}, (_, i) => `<i style="--a:${i * 20}deg;--d:${60 + (i % 3) * 30}px;--t:${i * 25}ms"></i>`).join('');
  }
}
function initAsk() {
  const buttons = $$('[data-ask-choice]');
  const choose = (value, celebrate = true) => {
    state.ask = value;
    writeStorage('aceptas', value);
    renderAsk(celebrate);
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => choose(button.dataset.askChoice));
    button.addEventListener('keydown', event => {
      const step = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[event.key];
      if (!step) return;
      event.preventDefault();
      const next = buttons[(index + step + buttons.length) % buttons.length];
      next.focus();
      choose(next.dataset.askChoice, false);
    });
  });
  $('[data-ask-reset]').addEventListener('click', () => {
    state.ask = '';
    writeStorage('aceptas', '');
    renderAsk();
    buttons[0].focus();
  });
  renderAsk();
}
function initCredits() {
  $('[data-credits]').innerHTML = Object.entries(CREDITS).map(([id, credit]) => `<li><strong>${escapeHTML(id)}</strong> — ${escapeHTML(credit.author)} · ${credit.licenseUrl ? external(credit.licenseUrl, credit.license) : escapeHTML(credit.license)} · ${external(credit.source, credit.file)}</li>`).join('');
}
document.addEventListener('DOMContentLoaded', () => {
  initImages();
  initCountdown();
  initNavigation();
  initItinerary();
  initGallery();
  initPenol();
  initMap();
  initChecklist();
  initSharing();
  initPrint();
  initAsk();
  initCredits();
  initReveal();
  checkImages();
});
