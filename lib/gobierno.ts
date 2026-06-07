/**
 * lib/gobierno.ts — Directorio del Poder Ejecutivo de Costa Rica 2026-2030.
 * Fuente: nombramientos oficiales. Centraliza los datos para el directorio
 * (/gobierno) y los perfiles individuales (/gobierno/[slug]).
 *
 * ⚠️ Un medio no puede tener funcionarios equivocados: el `cargo` proviene de
 * los nombramientos oficiales. Los campos `foto`, `fotoCredito` y `bio` son
 * OPCIONALES y solo deben llenarse con información verificada.
 */

export type Grupo = 'presidencia' | 'ministro' | 'presidencia-ejecutiva';

export interface Funcionario {
  nombre: string;
  cargo: string;          // título corto (tarjetas)
  institucion?: string;   // nombre completo del ministerio/institución (perfil)
  grupo: Grupo;
  foto?: string;          // URL de la foto (opcional)
  fotoCredito?: string;   // crédito: de dónde se tomó la foto (opcional)
  bio?: string;           // reseña / currículo verificado (opcional)
}

export const ACCENT: Record<Grupo, string> = {
  'presidencia': '#0000A2',
  'ministro': '#0a73ce',
  'presidencia-ejecutiva': '#0e9f6e',
};

export const GRUPO_LABEL: Record<Grupo, string> = {
  'presidencia': 'Presidencia de la República',
  'ministro': 'Gabinete · Ministerio',
  'presidencia-ejecutiva': 'Presidencia ejecutiva',
};

export function slugify(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const PRESIDENCIA: Funcionario[] = [
  { nombre: 'Laura Fernández Delgado', cargo: 'Presidenta de la República', institucion: 'Presidencia de la República', grupo: 'presidencia' },
  { nombre: 'Francisco Gamboa Soto', cargo: 'Primer vicepresidente', institucion: 'Vicepresidencia de la República', grupo: 'presidencia' },
  { nombre: 'Douglas Soto Campos', cargo: 'Segundo vicepresidente', institucion: 'Vicepresidencia de la República', grupo: 'presidencia' },
];

export const MINISTROS: Funcionario[] = [
  { nombre: 'Rodrigo Chaves Robles', cargo: 'Presidencia y Hacienda', institucion: 'Ministerio de la Presidencia y Ministerio de Hacienda', grupo: 'ministro' },
  { nombre: 'Manuel Tovar Rivera', cargo: 'Relaciones Exteriores y Culto', institucion: 'Ministerio de Relaciones Exteriores y Culto', grupo: 'ministro' },
  { nombre: 'Gerald Campos Valverde', cargo: 'Seguridad Pública y Gobernación', institucion: 'Ministerio de Seguridad Pública y Gobernación', grupo: 'ministro' },
  { nombre: 'Gabriel Aguilar Vargas', cargo: 'Justicia y Paz', institucion: 'Ministerio de Justicia y Paz', grupo: 'ministro' },
  { nombre: 'José Leonardo Sánchez Hernández', cargo: 'Educación Pública', institucion: 'Ministerio de Educación Pública (MEP)', grupo: 'ministro' },
  { nombre: 'Efraím Zeledón Leiva', cargo: 'Obras Públicas y Transportes', institucion: 'Ministerio de Obras Públicas y Transportes (MOPT)', grupo: 'ministro' },
  { nombre: 'María del Milagro Solórzano León', cargo: 'Economía, Industria y Comercio', institucion: 'Ministerio de Economía, Industria y Comercio (MEIC)', grupo: 'ministro' },
  { nombre: 'Juan Gabriel Ramírez Guillén', cargo: 'Agricultura y Ganadería', institucion: 'Ministerio de Agricultura y Ganadería (MAG)', grupo: 'ministro' },
  { nombre: 'Alexander Sánchez Cabo', cargo: 'Salud', institucion: 'Ministerio de Salud', grupo: 'ministro' },
  { nombre: 'Roy Thompson Chacón', cargo: 'Trabajo y Seguridad Social', institucion: 'Ministerio de Trabajo y Seguridad Social (MTSS)', grupo: 'ministro' },
  { nombre: 'Jorge Rodríguez Vives', cargo: 'Cultura y Juventud', institucion: 'Ministerio de Cultura y Juventud', grupo: 'ministro' },
  { nombre: 'Carla Morales Rojas', cargo: 'Planificación (MIDEPLAN)', institucion: 'Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)', grupo: 'ministro' },
  { nombre: 'Mónica Navarro del Valle', cargo: 'Ambiente y Energía', institucion: 'Ministerio de Ambiente y Energía (MINAE)', grupo: 'ministro' },
  { nombre: 'Guillermo Carazo Ramírez', cargo: 'Vivienda y Asentamientos Humanos', institucion: 'Ministerio de Vivienda y Asentamientos Humanos (MIVAH)', grupo: 'ministro' },
  { nombre: 'Indiana Trejos Gallo', cargo: 'Comercio Exterior', institucion: 'Ministerio de Comercio Exterior (COMEX)', grupo: 'ministro' },
  { nombre: 'Paula Bogantes Zamora', cargo: 'Ciencia, Innovación y Tecnología', institucion: 'Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones (MICITT)', grupo: 'ministro' },
  { nombre: 'Arnold Zamora Miranda', cargo: 'Comunicación', institucion: 'Ministerio de Comunicación', grupo: 'ministro' },
  { nombre: 'Carlos Andrés Robles Obando', cargo: 'Costas, Mares y Pesca', institucion: 'Ministerio de Costas, Mares y Pesca', grupo: 'ministro' },
  { nombre: 'Yorleny León Marchena', cargo: 'Desarrollo Humano e Inclusión Social', institucion: 'Ministerio de Desarrollo Humano e Inclusión Social', grupo: 'ministro' },
];

export const PRESIDENCIAS: Funcionario[] = [
  { nombre: 'Róger Madrigal López', cargo: 'Banco Central (BCCR)', institucion: 'Banco Central de Costa Rica (BCCR)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Mónica Taylor Hernández', cargo: 'Caja del Seguro Social (CCSS)', institucion: 'Caja Costarricense de Seguro Social (CCSS)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Marco Acuña Mora', cargo: 'Instituto de Electricidad (ICE)', institucion: 'Instituto Costarricense de Electricidad (ICE)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Gabriela Chacón Fernández', cargo: 'Instituto de Seguros (INS)', institucion: 'Instituto Nacional de Seguros (INS)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Karla Montero Víquez', cargo: 'Refinadora (RECOPE)', institucion: 'Refinadora Costarricense de Petróleo (RECOPE)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Lourdes Sáurez Barboza', cargo: 'Acueductos y Alcantarillados (AyA)', institucion: 'Instituto Costarricense de Acueductos y Alcantarillados (AyA)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Paola Nájera Abarca', cargo: 'Junta de Protección Social (JPS)', institucion: 'Junta de Protección Social (JPS)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Edgar Oviedo Blanco', cargo: 'Aprendizaje (INA)', institucion: 'Instituto Nacional de Aprendizaje (INA)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'José David Córdoba Rodríguez', cargo: 'Consejo de Producción (CNP)', institucion: 'Consejo Nacional de Producción (CNP)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'María José Vega Sanabria', cargo: 'Patronato de la Infancia (PANI)', institucion: 'Patronato Nacional de la Infancia (PANI)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Carolina Delgado Ramírez', cargo: 'Instituto de las Mujeres (INAMU)', institucion: 'Instituto Nacional de las Mujeres (INAMU)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Ricardo Quesada Salas', cargo: 'Desarrollo Rural (INDER)', institucion: 'Instituto de Desarrollo Rural (INDER)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Johnny Leiva Badilla', cargo: 'Vivienda y Urbanismo (INVU)', institucion: 'Instituto Nacional de Vivienda y Urbanismo (INVU)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Warner Quesada Céspedes', cargo: 'Puertos del Pacífico (INCOP)', institucion: 'Instituto Costarricense de Puertos del Pacífico (INCOP)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Álvaro Bermúdez Peña', cargo: 'Ferrocarriles (INCOFER)', institucion: 'Instituto Costarricense de Ferrocarriles (INCOFER)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Marcos Vargas Borges', cargo: 'Turismo (ICT)', institucion: 'Instituto Costarricense de Turismo (ICT)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'José Miguel Jiménez Araya', cargo: 'Fomento Municipal (IFAM)', institucion: 'Instituto de Fomento y Asesoría Municipal (IFAM)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Alejandro Picado Eduarte', cargo: 'Emergencias (CNE)', institucion: 'Comisión Nacional de Prevención de Riesgos y Atención de Emergencias (CNE)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Nelson Peña Navarro', cargo: 'Pesca y Acuicultura (INCOPESCA)', institucion: 'Instituto Costarricense de Pesca y Acuicultura (INCOPESCA)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Juan Diego López', cargo: 'Radio y Televisión (SINART)', institucion: 'Sistema Nacional de Radio y Televisión (SINART)', grupo: 'presidencia-ejecutiva' },
  { nombre: 'Martín Vargas Santamaría', cargo: 'Desarrollo Atlántico (JAPDEVA)', institucion: 'Junta de Administración Portuaria y de Desarrollo Económico de la Vertiente Atlántica (JAPDEVA)', grupo: 'presidencia-ejecutiva' },
];

export const FUNCIONARIOS: Funcionario[] = [...PRESIDENCIA, ...MINISTROS, ...PRESIDENCIAS];

export function getFuncionario(slug: string): Funcionario | undefined {
  return FUNCIONARIOS.find((f) => slugify(f.nombre) === slug);
}
