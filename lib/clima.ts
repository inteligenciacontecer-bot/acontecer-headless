/**
 * lib/clima.ts — Datos y helpers de clima compartidos entre
 * /clima y /clima/[provincia]. Fuente: Open-Meteo (sin API key).
 */

export interface Provincia {
  slug: string;       // san-jose, guanacaste…
  provincia: string;  // "San José", "Guanacaste"
  ciudad: string;     // ciudad de referencia para las coordenadas
  lat: number;
  lon: number;
  intro: string;      // descripción corta del clima de la provincia (E-E-A-T)
}

// Las 7 provincias de Costa Rica + ciudad de referencia.
export const PROVINCIAS: Provincia[] = [
  { slug: 'san-jose', provincia: 'San José', ciudad: 'San José', lat: 9.9281, lon: -84.0907,
    intro: 'San José, en el Valle Central, tiene un clima templado de montaña: días agradables y noches frescas durante todo el año, con lluvias por la tarde en la estación lluviosa.' },
  { slug: 'alajuela', provincia: 'Alajuela', ciudad: 'Alajuela', lat: 10.0162, lon: -84.2116,
    intro: 'Alajuela, conocida como «la ciudad de los mangos», suele ser un poco más cálida que el resto del Valle Central por su menor altitud.' },
  { slug: 'cartago', provincia: 'Cartago', ciudad: 'Cartago', lat: 9.8644, lon: -83.9194,
    intro: 'Cartago es de las provincias más frescas del país por su altura. Son frecuentes la neblina y el «pelo de gato», sobre todo en la tarde y la noche.' },
  { slug: 'heredia', provincia: 'Heredia', ciudad: 'Heredia', lat: 9.9981, lon: -84.1169,
    intro: 'Heredia, «la ciudad de las flores», comparte el clima templado del Valle Central, con zonas altas como Barva aún más frescas.' },
  { slug: 'guanacaste', provincia: 'Guanacaste', ciudad: 'Liberia', lat: 10.6346, lon: -85.4377,
    intro: 'Guanacaste es la provincia más caliente y seca de Costa Rica. Su estación seca es marcada y soleada, ideal para el turismo de playa.' },
  { slug: 'puntarenas', provincia: 'Puntarenas', ciudad: 'Puntarenas', lat: 9.9763, lon: -84.8384,
    intro: 'Puntarenas, sobre el Pacífico, tiene un clima cálido y húmedo, con altas temperaturas y brisa marina durante casi todo el año.' },
  { slug: 'limon', provincia: 'Limón', ciudad: 'Limón', lat: 9.9907, lon: -83.0359,
    intro: 'Limón, en el Caribe, es húmedo y lluvioso casi todo el año, con un patrón distinto al resto del país: sus meses más secos suelen ser setiembre y octubre.' },
];

export function getProvincia(slug: string): Provincia | undefined {
  return PROVINCIAS.find((p) => p.slug === slug);
}

export interface Canton { slug: string; nombre: string; lat: number; lon: number; }

// Cantones por provincia (coordenadas de la cabecera). Se EXCLUYE el cantón
// central que coincide con la ciudad de referencia de la provincia (ya cubierto
// por /clima/[provincia]) para no duplicar contenido.
// Se agregan por bloques, una provincia a la vez.
export const CANTONES: Record<string, Canton[]> = {
  'san-jose': [
    { slug: 'escazu',              nombre: 'Escazú',             lat: 9.9189, lon: -84.1397 },
    { slug: 'desamparados',        nombre: 'Desamparados',       lat: 9.8997, lon: -84.0656 },
    { slug: 'puriscal',            nombre: 'Puriscal',           lat: 9.8456, lon: -84.3158 },
    { slug: 'tarrazu',             nombre: 'Tarrazú',            lat: 9.6536, lon: -84.0211 },
    { slug: 'aserri',              nombre: 'Aserrí',             lat: 9.8589, lon: -84.1031 },
    { slug: 'mora',                nombre: 'Mora',               lat: 9.9136, lon: -84.2386 },
    { slug: 'goicoechea',          nombre: 'Goicoechea',         lat: 9.9486, lon: -84.0494 },
    { slug: 'santa-ana',           nombre: 'Santa Ana',          lat: 9.9325, lon: -84.1822 },
    { slug: 'alajuelita',          nombre: 'Alajuelita',         lat: 9.9019, lon: -84.0986 },
    { slug: 'vazquez-de-coronado', nombre: 'Vázquez de Coronado', lat: 9.9831, lon: -84.0006 },
    { slug: 'acosta',              nombre: 'Acosta',             lat: 9.7964, lon: -84.1814 },
    { slug: 'tibas',               nombre: 'Tibás',              lat: 9.9550, lon: -84.0830 },
    { slug: 'moravia',             nombre: 'Moravia',            lat: 9.9658, lon: -84.0492 },
    { slug: 'montes-de-oca',       nombre: 'Montes de Oca',      lat: 9.9339, lon: -84.0533 },
    { slug: 'turrubares',          nombre: 'Turrubares',         lat: 9.8400, lon: -84.4300 },
    { slug: 'dota',                nombre: 'Dota',               lat: 9.6447, lon: -83.9633 },
    { slug: 'curridabat',          nombre: 'Curridabat',         lat: 9.9244, lon: -84.0331 },
    { slug: 'perez-zeledon',       nombre: 'Pérez Zeledón',      lat: 9.3736, lon: -83.7019 },
    { slug: 'leon-cortes',         nombre: 'León Cortés',        lat: 9.7000, lon: -84.0667 },
  ],
  'alajuela': [
    { slug: 'san-ramon',     nombre: 'San Ramón',     lat: 10.0897, lon: -84.4694 },
    { slug: 'grecia',        nombre: 'Grecia',        lat: 10.0717, lon: -84.3144 },
    { slug: 'san-mateo',     nombre: 'San Mateo',     lat: 9.9522,  lon: -84.5286 },
    { slug: 'atenas',        nombre: 'Atenas',        lat: 9.9794,  lon: -84.3814 },
    { slug: 'naranjo',       nombre: 'Naranjo',       lat: 10.0950, lon: -84.3789 },
    { slug: 'palmares',      nombre: 'Palmares',      lat: 10.0564, lon: -84.4361 },
    { slug: 'poas',          nombre: 'Poás',          lat: 10.0900, lon: -84.2350 },
    { slug: 'orotina',       nombre: 'Orotina',       lat: 9.9072,  lon: -84.5253 },
    { slug: 'san-carlos',    nombre: 'San Carlos',    lat: 10.3236, lon: -84.4278 },
    { slug: 'zarcero',       nombre: 'Zarcero',       lat: 10.1900, lon: -84.3917 },
    { slug: 'sarchi',        nombre: 'Sarchí',        lat: 10.0883, lon: -84.3719 },
    { slug: 'upala',         nombre: 'Upala',         lat: 10.8983, lon: -85.0156 },
    { slug: 'los-chiles',    nombre: 'Los Chiles',    lat: 11.0331, lon: -84.7072 },
    { slug: 'guatuso',       nombre: 'Guatuso',       lat: 10.6692, lon: -84.8378 },
    { slug: 'rio-cuarto',    nombre: 'Río Cuarto',    lat: 10.3417, lon: -84.2125 },
  ],
  'cartago': [
    { slug: 'paraiso',    nombre: 'Paraíso',    lat: 9.8383, lon: -83.8656 },
    { slug: 'la-union',   nombre: 'La Unión',   lat: 9.9072, lon: -83.9844 },
    { slug: 'jimenez',    nombre: 'Jiménez',    lat: 9.8967, lon: -83.7517 },
    { slug: 'turrialba',  nombre: 'Turrialba',  lat: 9.9047, lon: -83.6814 },
    { slug: 'alvarado',   nombre: 'Alvarado',   lat: 9.9322, lon: -83.7811 },
    { slug: 'oreamuno',   nombre: 'Oreamuno',   lat: 9.9006, lon: -83.8997 },
    { slug: 'el-guarco',  nombre: 'El Guarco',  lat: 9.8675, lon: -83.9525 },
  ],
  'heredia': [
    { slug: 'barva',         nombre: 'Barva',         lat: 10.0825, lon: -84.1175 },
    { slug: 'santo-domingo', nombre: 'Santo Domingo', lat: 10.0586, lon: -84.0883 },
    { slug: 'santa-barbara', nombre: 'Santa Bárbara', lat: 10.1031, lon: -84.1583 },
    { slug: 'san-rafael',    nombre: 'San Rafael',    lat: 10.0892, lon: -84.0758 },
    { slug: 'san-isidro',    nombre: 'San Isidro',    lat: 10.0314, lon: -84.0117 },
    { slug: 'belen',         nombre: 'Belén',         lat: 9.9803,  lon: -84.1717 },
    { slug: 'flores',        nombre: 'Flores',        lat: 9.9989,  lon: -84.1617 },
    { slug: 'san-pablo',     nombre: 'San Pablo',     lat: 9.9986,  lon: -84.0883 },
    { slug: 'sarapiqui',     nombre: 'Sarapiquí',     lat: 10.4500, lon: -83.9400 },
  ],
};

export function getCantones(provSlug: string): Canton[] {
  return CANTONES[provSlug] || [];
}
export function getCanton(provSlug: string, cantonSlug: string): Canton | undefined {
  return (CANTONES[provSlug] || []).find((c) => c.slug === cantonSlug);
}

export interface WmoInfo { icon: string; desc: string; }
export function wmo(code: number): WmoInfo {
  const m: Record<number, WmoInfo> = {
    0: { icon: '☀️', desc: 'Despejado' },
    1: { icon: '🌤️', desc: 'Mayormente despejado' },
    2: { icon: '⛅', desc: 'Parcialmente nublado' },
    3: { icon: '☁️', desc: 'Nublado' },
    45: { icon: '🌫️', desc: 'Neblina' },
    48: { icon: '🌫️', desc: 'Neblina con escarcha' },
    51: { icon: '🌦️', desc: 'Llovizna ligera' },
    53: { icon: '🌦️', desc: 'Llovizna' },
    55: { icon: '🌧️', desc: 'Llovizna intensa' },
    56: { icon: '🌧️', desc: 'Llovizna helada' },
    57: { icon: '🌧️', desc: 'Llovizna helada intensa' },
    61: { icon: '🌦️', desc: 'Lluvia ligera' },
    63: { icon: '🌧️', desc: 'Lluvia' },
    65: { icon: '🌧️', desc: 'Lluvia intensa' },
    66: { icon: '🌧️', desc: 'Lluvia helada' },
    67: { icon: '🌧️', desc: 'Lluvia helada intensa' },
    71: { icon: '❄️', desc: 'Nevada ligera' },
    73: { icon: '❄️', desc: 'Nevada' },
    75: { icon: '❄️', desc: 'Nevada intensa' },
    80: { icon: '🌦️', desc: 'Chubascos ligeros' },
    81: { icon: '🌧️', desc: 'Chubascos' },
    82: { icon: '⛈️', desc: 'Chubascos fuertes' },
    95: { icon: '⛈️', desc: 'Tormenta eléctrica' },
    96: { icon: '⛈️', desc: 'Tormenta con granizo' },
    99: { icon: '⛈️', desc: 'Tormenta fuerte con granizo' },
  };
  return m[code] || { icon: '🌡️', desc: 'Variable' };
}

export interface ClimaActual { temp: number; feels: number; humidity: number; wind: number; code: number; }
export interface ClimaDia { fecha: string; code: number; tmax: number; tmin: number; lluvia: number; }
export interface ClimaHora { hora: string; temp: number; icon: string; lluvia: number; }
export interface ClimaCompleto { current: ClimaActual; dias: ClimaDia[]; horas: ClimaHora[]; }

/** Trae clima actual + 7 días + 24 horas de una coordenada (una sola llamada). */
export async function getClimaCompleto(lat: number, lon: number): Promise<ClimaCompleto | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&hourly=temperature_2m,weather_code,precipitation_probability' +
      '&timezone=America/Costa_Rica&forecast_days=7';
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const d = await res.json();
    const c = d.current, dl = d.daily, h = d.hourly;
    if (!c || !dl) return null;

    const dias: ClimaDia[] = (dl.time || []).map((t: string, i: number) => ({
      fecha: t,
      code: dl.weather_code?.[i] ?? 0,
      tmax: Math.round(dl.temperature_2m_max?.[i] ?? 0),
      tmin: Math.round(dl.temperature_2m_min?.[i] ?? 0),
      lluvia: dl.precipitation_probability_max?.[i] ?? 0,
    }));

    let horas: ClimaHora[] = [];
    if (h && Array.isArray(h.time)) {
      const nowH = (c.time || '').slice(0, 13);
      let start = h.time.findIndex((t: string) => t.slice(0, 13) === nowH);
      if (start < 0) start = 0;
      horas = h.time.slice(start, start + 24).map((t: string, k: number) => ({
        hora: t.slice(11, 16),
        temp: Math.round(h.temperature_2m?.[start + k] ?? 0),
        icon: wmo(h.weather_code?.[start + k] ?? 0).icon,
        lluvia: h.precipitation_probability?.[start + k] ?? 0,
      }));
    }

    return {
      current: {
        temp: Math.round(c.temperature_2m ?? 0),
        feels: Math.round(c.apparent_temperature ?? c.temperature_2m ?? 0),
        humidity: Math.round(c.relative_humidity_2m ?? 0),
        wind: Math.round(c.wind_speed_10m ?? 0),
        code: c.weather_code ?? 0,
      },
      dias,
      horas,
    };
  } catch {
    return null;
  }
}

export function diaNombre(iso: string, idx: number): string {
  if (idx === 0) return 'Hoy';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CR', { weekday: 'short' }).replace('.', '');
}
