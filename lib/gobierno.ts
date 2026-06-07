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
  fuenteUrl?: string;     // fuente del currículo / perfil oficial
  fuenteNombre?: string;  // nombre visible de la fuente
  fuentes?: Array<{ nombre: string; url: string }>;
  bio?: string;           // reseña / currículo verificado (opcional)
  aliases?: string[];     // slugs históricos o variantes del nombre
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
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function funcionarioSlug(f: Pick<Funcionario, 'nombre'>): string {
  return slugify(f.nombre);
}

export const PRESIDENCIA: Funcionario[] = [
  {
    "nombre": "Laura Fernández Delgado",
    "cargo": "Presidenta de la República",
    "institucion": "Presidencia de la República",
    "grupo": "presidencia",
    "foto": "/gobierno/fotos/laura-fernandez-delgado.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/index.php/su-presidente/presidente-de-la-republica",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Es Presidenta de la República de Costa Rica para el periodo 2026-2030. Cuenta con una amplia trayectoria en la función pública y experiencia en gestión institucional, planificación estratégica y políticas públicas. Antes de asumir la Presidencia de la República, se desempeñó como Ministra de la Presidencia y Ministra de Planificación Nacional y Política Económica.\nSu administración impulsa una visión enfocada en el fortalecimiento del Estado, el desarrollo económico, la seguridad ciudadana y la generación de oportunidades para todos los costarricenses."
  },
  {
    "nombre": "Francisco Ernesto Gamboa Soto",
    "cargo": "Primer vicepresidente",
    "institucion": "Vicepresidencia de la República",
    "grupo": "presidencia",
    "foto": "/gobierno/fotos/francisco-ernesto-gamboa-soto.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/su-presidente/primer-vicepresidente-de-la-republica",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Es economista y funcionario público costarricense con una amplia trayectoria en desarrollo económico, competitividad y gestión institucional. Ha ocupado cargos en entidades públicas, organismos de promoción económica y sectores vinculados al desarrollo productivo del país, además de desempeñarse como Ministro de Economía, Industria y Comercio.\nEn mayo de 2026 asumió como Primer Vicepresidente de la República en el Gobierno de Laura Fernández Delgado para el período 2026-2030. Desde su cargo impulsa iniciativas orientadas al crecimiento económico, el fortalecimiento de oportunidades para las regiones, la competitividad y el desarrollo estratégico de Costa Rica.",
    "aliases": [
      "francisco-gamboa-soto"
    ]
  },
  {
    "nombre": "Douglas Soto Campos",
    "cargo": "Segundo vicepresidente",
    "institucion": "Vicepresidencia de la República",
    "grupo": "presidencia",
    "foto": "/gobierno/fotos/douglas-soto-campos.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/node/633",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Es administrador de empresas y ejecutivo costarricense con una amplia trayectoria en liderazgo empresarial, banca y desarrollo estratégico. A lo largo de su carrera ha ocupado cargos de alta dirección en el sector financiero y corporativo, impulsando iniciativas relacionadas con innovación, competitividad y crecimiento económico. En mayo de 2026 asumió como Segundo Vicepresidente de la República en el Gobierno de Laura Fernández Delgado para el período 2026-2030.\nDesde su cargo trabaja en iniciativas orientadas al fortalecimiento de la economía, la atracción de inversión, la generación de oportunidades y la articulación de proyectos estratégicos para el desarrollo de Costa Rica."
  }
];

export const MINISTROS: Funcionario[] = [
  { nombre: "Rodrigo Chaves Robles", cargo: "Presidencia y Hacienda", institucion: "Ministerio de la Presidencia y Ministerio de Hacienda", grupo: 'ministro', foto: "/gobierno/fotos/rodrigo-chaves-robles.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-la-presidencia-y-ministerio-de-hacienda", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Es economista y político costarricense. Fue Presidente de la República de Costa Rica entre 2022 y 2026. En mayo de 2026, fue nombrado por la presidenta Laura Fernández Delgado como Ministro de la Presidencia y Ministro de Hacienda para el período 2026-2030.\nCon una trayectoria en organismos internacionales y en la gestión pública, ha liderado iniciativas enfocadas en el fortalecimiento de las finanzas públicas, la modernización del Estado y la ejecución de proyectos estratégicos para el desarrollo del país. Desde sus cargos actuales, coordina la articulación política y económica del Gobierno, impulsando políticas orientadas a la eficiencia institucional, la inversión y el crecimiento de Costa Rica." },
  { nombre: "Manuel Tovar Rivera", cargo: "Relaciones Exteriores y Culto", institucion: "Ministerio de Relaciones Exteriores y Culto", grupo: 'ministro', foto: "/gobierno/fotos/manuel-tovar-rivera.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-relaciones-exteriores-y-culto-mrec", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Licenciado en Derecho por la Universidad Autónoma de Centroamérica, es Máster en Derecho Internacional y Relaciones Internacionales de la Universidad Complutense de Madrid y Doctorado en Ciencias Políticas por la Universidad de Salamanca, entidad en la cual estudió un posgrado en Derecho Administrativo. Ha realizado estudios de actualización profesional en la Universidad de Harvard y London School of Economics and Political Science.\nEn mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Relaciones Exteriores y Culto para el período 2026-2030.\nA lo largo de su trayectoria ha trabajado en el fortalecimiento de las relaciones diplomáticas de Costa Rica, la atracción de inversión y la promoción del país en el ámbito internacional. Como Canciller de la República, lidera la política exterior costarricense, impulsando la cooperación internacional, el diálogo diplomático y la defensa de los intereses del país ante la comunidad internacional." },
  { nombre: "Gerald Campos Valverde", cargo: "Seguridad Pública y Gobernación", institucion: "Ministerio de Seguridad Pública y Gobernación", grupo: 'ministro', foto: "/gobierno/fotos/gerald-campos-valverde.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-gobernacion-policia-y-seguridad-publica", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con una amplia trayectoria en seguridad, investigación criminal y administración pública. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Seguridad Pública para el período 2026-2030.\nA lo largo de su carrera ha ocupado distintos cargos vinculados al fortalecimiento institucional, la seguridad ciudadana y la lucha contra el crimen organizado. Desde el Ministerio de Seguridad Pública lidera las estrategias nacionales orientadas a la protección de la ciudadanía, el fortalecimiento de los cuerpos policiales y la coordinación de acciones para preservar el orden y la seguridad en Costa Rica." },
  { nombre: "Gabriel Aguilar Vargas", cargo: "Justicia y Paz", institucion: "Ministerio de Justicia y Paz", grupo: 'ministro', foto: "/gobierno/fotos/gabriel-aguilar-vargas.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-justicia-y-paz-mjp", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Es abogado y funcionario público costarricense con experiencia en derecho, gestión institucional y políticas públicas. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Justicia y Paz para el período 2026-2030.\nA lo largo de su trayectoria ha trabajado en iniciativas relacionadas con el fortalecimiento del sistema de justicia, la convivencia pacífica y la modernización institucional. Desde el Ministerio de Justicia y Paz lidera acciones orientadas a la administración del sistema penitenciario, la promoción de la paz social y el fortalecimiento de políticas enfocadas en la seguridad jurídica y los derechos de la ciudadanía." },
  { nombre: "José Leonardo Sánchez Hernández", cargo: "Educación Pública", institucion: "Ministerio de Educación Pública (MEP)", grupo: 'ministro', foto: "/gobierno/fotos/jose-leonardo-sanchez-hernandez.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-educacion-publica-mep", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con experiencia en gestión educativa, liderazgo académico y desarrollo de políticas públicas en el ámbito de la educación. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Educación Pública para el período 2026-2030.\nA lo largo de su trayectoria ha impulsado iniciativas orientadas al fortalecimiento del sistema educativo, la innovación académica y la mejora de las oportunidades de aprendizaje para la población estudiantil. Desde el Ministerio de Educación Pública lidera estrategias enfocadas en la calidad educativa, la modernización institucional y el acceso a una educación inclusiva y de excelencia para Costa Rica." },
  { nombre: "Efraím Zeledón Leiva", cargo: "Obras Públicas y Transportes", institucion: "Ministerio de Obras Públicas y Transportes (MOPT)", grupo: 'ministro', foto: "/gobierno/fotos/efraim-zeledon-leiva.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministro-de-obras-publicas-y-transportes-mopt", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con experiencia en infraestructura, planificación y gestión de proyectos de transporte y obra pública. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Obras Públicas y Transportes para el período 2026-2030.\nA lo largo de su trayectoria ha participado en iniciativas orientadas al fortalecimiento de la infraestructura nacional, la modernización del transporte y la mejora de la conectividad del país. Desde el Ministerio de Obras Públicas y Transportes lidera proyectos estratégicos enfocados en movilidad, desarrollo vial y modernización de la infraestructura pública para impulsar el crecimiento y la competitividad de Costa Rica." },
  { nombre: "María del Milagro Solórzano León", cargo: "Economía, Industria y Comercio", institucion: "Ministerio de Economía, Industria y Comercio (MEIC)", grupo: 'ministro', foto: "/gobierno/fotos/maria-del-milagro-solorzano-leon.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-economia-industria-y-comercio-meic", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con más de 20 años de experiencia profesional en el sector privado, con énfasis en la defensa de los derechos de los consumidores, la simplificación de trámites y los procedimientos administrativos y de contratación pública. Asimismo, brindó asesoría en temas relevantes a la Cámara de Industria y Comercio Costa Rica-México y a la Cámara Costarricense de la Construcción. En mayo de 2026 fue nombrada por la presidenta Laura Fernández Delgado como Ministra de Economía, Industria y Comercio (MEIC) para el período 2026-2030.\nDesde el Ministerio de Economía, Industria y Comercio lidera iniciativas orientadas al fortalecimiento del sector productivo, el impulso al emprendimiento, la competitividad y la modernización de políticas que promuevan el desarrollo económico y empresarial del país." },
  { nombre: "Juan Gabriel Ramírez Guillén", cargo: "Agricultura y Ganadería", institucion: "Ministerio de Agricultura y Ganadería (MAG)", grupo: 'ministro', foto: "/gobierno/fotos/juan-gabriel-ramirez-guillen.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-agricultura-y-ganaderia-mag", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Es ingeniero en agronegocios y funcionario costarricense con más de 19 años de experiencia en producción, exportación, innovación y mercados internacionales. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Agricultura y Ganadería para el período 2026-2030.\nA lo largo de su trayectoria ha trabajado en proyectos relacionados con el fortalecimiento del sector agropecuario y el desarrollo de cadenas productivas, además de colaborar con organismos como la Organización de las Naciones Unidas para la Alimentación y la Agricultura (FAO) y la Promotora del Comercio Exterior de Costa Rica (PROCOMER). Desde el Ministerio de Agricultura y Ganadería lidera estrategias orientadas a impulsar la productividad, la sostenibilidad y la competitividad del agro costarricense, fortaleciendo el acompañamiento a las personas productoras y el desarrollo del sector agrícola nacional." },
  { nombre: "Alexander Sánchez Cabo", cargo: "Salud", institucion: "Ministerio de Salud", grupo: 'ministro', foto: "/gobierno/fotos/alexander-sanchez-cabo.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-salud", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con experiencia en gestión de servicios de salud y administración hospitalaria. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Salud para el período 2026-2030. Previamente se desempeñó como gerente médico interino de la Caja Costarricense de Seguro Social (CCSS), donde participó en iniciativas orientadas al fortalecimiento de la atención médica, la formación de especialistas y la modernización de servicios de salud.\nDesde el Ministerio de Salud lidera estrategias enfocadas en fortalecer el sistema sanitario nacional, impulsar una gestión más eficiente, promover la prevención y garantizar el acceso a servicios de salud de calidad para la población costarricense." },
  { nombre: "Roy Thompson Chacón", cargo: "Trabajo y Seguridad Social", institucion: "Ministerio de Trabajo y Seguridad Social (MTSS)", grupo: 'ministro', foto: "/gobierno/fotos/roy-thompson-chacon.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-trabajo-y-seguridad-social-mtss", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con experiencia en asuntos legislativos, derecho, gestión pública y políticas regulatorias. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Trabajo y Seguridad Social para el período 2026-2030.\nA lo largo de su trayectoria ha participado en procesos relacionados con legislación, desarrollo institucional y coordinación entre sectores públicos y privados. Desde el Ministerio de Trabajo y Seguridad Social lidera iniciativas orientadas a promover el empleo, fortalecer las condiciones laborales, impulsar el diálogo social y generar mayores oportunidades para el desarrollo económico y bienestar de las personas trabajadoras del país." },
  { nombre: "Jorge Rodríguez Vives", cargo: "Cultura y Juventud", institucion: "Ministerio de Cultura y Juventud", grupo: 'ministro', foto: "/gobierno/fotos/jorge-rodriguez-vives.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-cultura-y-juventud-mcj", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Lidera el Ministerio de Cultura y Juventud con el compromiso de fortalecer la identidad cultural y promover el bienestar de la población costarricense. Su labor se centra en diseñar e implementar políticas públicas que impulsen la creatividad, la diversidad cultural y el acceso equitativo a las expresiones artísticas y culturales. Bajo su dirección, el ministerio trabaja para garantizar que la cultura y la juventud sean pilares fundamentales en el desarrollo social y económico del país." },
  { nombre: "Carla Morales Rojas", cargo: "Planificación (MIDEPLAN)", institucion: "Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)", grupo: 'ministro', foto: "/gobierno/fotos/carla-morales-rojas.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-planificacion-nacional-y-politica-economica-mideplan", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Es una politóloga con más de 25 años de experiencia en el diseño, implementación y evaluación de políticas públicas. Posee una sólida formación académica que incluye una Maestría en Derechos Humanos de la Universidad Estatal a Distancia, así como una Licenciatura y un Bachillerato en Ciencias Políticas por la Universidad de Costa Rica. Se especializa en áreas de descentralización, desarrollo local y participación ciudadana, destacando por su capacidad de articulación política, negociación y dirección de equipos técnicos para la generación de resultados con impacto social. En mayo de 2026 fue nombrada por la presidenta Laura Fernández Delgado como Ministra de Planificación Nacional y Política Económica para el período 2026-2030. \nA lo largo de su trayectoria ha ocupado puestos de liderazgo en planificación estratégica y gestión pública, además de desempeñarse como consultora para organismos internacionales y docente universitaria. Desde el Ministerio de Planificación Nacional y Política Económica lidera acciones orientadas a fortalecer la modernización del Estado, la planificación estratégica y la articulación de políticas públicas enfocadas en el desarrollo y bienestar del país." },
  { nombre: "Mónica Navarro del Valle", cargo: "Ambiente y Energía", institucion: "Ministerio de Ambiente y Energía (MINAE)", grupo: 'ministro', foto: "/gobierno/fotos/monica-navarro-del-valle.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-ambiente-y-energia-minae", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Es abogada y especialista en políticas públicas ambientales, con una trayectoria vinculada a la sostenibilidad, la gestión ambiental y el desarrollo estratégico. En mayo de 2026 fue nombrada por la presidenta Laura Fernández Delgado como Ministra de Ambiente y Energía para el período 2026-2030.\nA lo largo de su carrera ha trabajado en iniciativas relacionadas con la protección ambiental, el desarrollo sostenible y la articulación entre sectores públicos y privados. Desde el Ministerio de Ambiente y Energía lidera estrategias orientadas a la conservación de los recursos naturales, la transición energética, la sostenibilidad y el fortalecimiento de políticas ambientales para el desarrollo de Costa Rica." },
  { nombre: "Guillermo Carazo Ramírez", cargo: "Vivienda y Asentamientos Humanos", institucion: "Ministerio de Vivienda y Asentamientos Humanos (MIVAH)", grupo: 'ministro', foto: "/gobierno/fotos/guillermo-carazo-ramirez.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/index.php/gabinete/ministerio-de-vivienda-y-asentamientos-humanos", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con una trayectoria vinculada al desarrollo urbano, la infraestructura y la planificación territorial. Antes de asumir funciones en el Gobierno, se desempeñó como Director Ejecutivo del Colegio Federado de Ingenieros y de Arquitectos (CFIA), impulsando iniciativas relacionadas con el crecimiento urbano, la construcción y el desarrollo sostenible. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Ministro de Vivienda y Asentamientos Humanos para el período 2026-2030.\nDesde el Ministerio de Vivienda y Asentamientos Humanos lidera estrategias orientadas a ampliar el acceso a vivienda digna, fortalecer el desarrollo urbano ordenado y promover proyectos que contribuyan a mejorar la calidad de vida de las familias costarricenses." },
  { nombre: "Indiana Trejos Gallo", cargo: "Comercio Exterior", institucion: "Ministerio de Comercio Exterior (COMEX)", grupo: 'ministro', foto: "/gobierno/fotos/indiana-trejos-gallo.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-comercio-exterior-comex", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Es especialista en comercio exterior y funcionaria pública costarricense con más de dos décadas de experiencia en negociaciones comerciales, facilitación del comercio y gestión pública. En mayo de 2026 fue nombrada por la presidenta Laura Fernández Delgado como Ministra de Comercio Exterior para el período 2026-2030. Previamente se desempeñó como Viceministra de Comercio Exterior y Presidenta del Consejo Nacional de Facilitación del Comercio, liderando iniciativas orientadas a fortalecer la competitividad y la modernización de procesos comerciales del país.\nDesde el Ministerio de Comercio Exterior impulsa estrategias enfocadas en la atracción de inversión, el fortalecimiento de las exportaciones, la apertura de oportunidades para las empresas costarricenses y el posicionamiento de Costa Rica en los mercados internacionales." },
  { nombre: "Paula Bogantes Zamora", cargo: "Ciencia, Innovación y Tecnología", institucion: "Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones (MICITT)", grupo: 'ministro', foto: "/gobierno/fotos/paula-bogantes-zamora.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministerio-de-ciencia-innovacion-tecnologia-y-telecomunicaciones-micitt", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Costarricense, máster en Comercio y Mercados Internacionales de LEAD University, así como Bachiller en Administración de Negocios por la Universidad Internacional de las Américas. La señora Bogantes cuenta con una especialidad en liderazgo organizacional por la Universidad de Georgetown y cursa un diplomado en Transformación Digital del Massachusetts Institute of Technology (MIT).\nPrevio a su designación como Ministra de Ciencia, Innovación, Tecnología y Telecomunicaciones (MICITT), la señora Bogantes Zamora se desempeñó como Viceministra de Comercio Exterior de Costa Rica y fue presidenta del Consejo Nacional de Facilitación del Comercio (CONAFAC).\nAdemás, laboró en la Coalición Costarricense de Iniciativas de Desarrollo (CINDE) como gerente de los sectores de Tecnologías Digitales, y Manufactura Avanzada y Tecnologías Limpias. Adicionalmente, se ha desempeñado como consultora para organismos internacionales como el Banco Interamericano de Desarrollo (BID) en materia de políticas públicas en temas como competitividad, innovación y tecnología, en colaboración con el MICITT, la academia y el sector privado.\nAsimismo, colaboró en la elaboración de una propuesta país para la creación de una Agencia de Innovación y un Laboratorio de Innovación Pública.\nBogantes Zamora cuenta con una amplia experiencia en el desarrollo de estrategias de atracción de inversión extranjera para industrias como computación de la nube, ciberseguridad, aeroespacial, automotriz y dispositivos médicos. Habla español e inglés." },
  { nombre: "Arnold Zamora Miranda", cargo: "Comunicación", institucion: "Ministerio de Comunicación", grupo: 'ministro', foto: "/gobierno/fotos/arnold-zamora-miranda.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministro-de-comunicacion-y-enlace", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Lidera el Ministerio de Comunicación y Enlace con el compromiso de fortalecer la transparencia, la rendición de cuentas y la comunicación efectiva entre el Gobierno y la ciudadanía. Su labor se centra en garantizar que la información pública sea accesible, clara y oportuna, promoviendo una cultura de participación y confianza en las instituciones del Estado. Bajo su dirección, el ministerio trabaja para mejorar los canales de comunicación, facilitando el acceso a la información y fomentando un diálogo constructivo entre el Gobierno y la sociedad costarricense." },
  { nombre: "Carlos Andrés Robles Obando", cargo: "Costas, Mares y Pesca", institucion: "Ministerio de Costas, Mares y Pesca", grupo: 'ministro', foto: "/gobierno/fotos/carlos-andres-robles-obando.jpg", fotoCredito: "Asamblea Legislativa de Costa Rica", fuenteUrl: "https://asamblea.go.cr/Diputados/robles_obando/SitePages/Proyectos.aspx", fuenteNombre: "Asamblea Legislativa de Costa Rica", bio: "Es administrador de empresas y exdiputado por Puntarenas en la Asamblea Legislativa durante el periodo 2022-2026. En el Gobierno de Laura Fernández Delgado fue designado Ministro de Costas, Mares y Pesca, una cartera orientada a la atención de los territorios costeros, el sector pesquero y los asuntos marítimos." },
  { nombre: "Yorleni León Marchena", cargo: "Desarrollo Humano e Inclusión Social", institucion: "Ministerio de Desarrollo Humano e Inclusión Social", grupo: 'ministro', foto: "/gobierno/fotos/yorleni-leon-marchena.jpg", fotoCredito: "Presidencia de la República de Costa Rica (CC BY-SA 4.0)", fuenteUrl: "https://www.presidencia.go.cr/gabinete/ministra-de-desarrollo-humano-e-inclusion-social", fuenteNombre: "Presidencia de la República de Costa Rica", bio: "Cuenta con la Licenciatura en Administración de Negocios de la Universidad Interamericana de Costa Rica, es Máster en Desarrollo Económico Local de la Facultad Latinoamericana en Ciencias Sociales (Flacso).\nParticipó en diversos seminarios de postgrado en: Evaluación de Proyectos de FOCEVAL, GIZ y UCR; gerencia de la sostenibilidad y Liderazgo de Incae y Proyectos de Desarrollo de ICAP.\nImpulsó proyectos comunales en materia de infraestructura, competitividad, educación y seguridad con un enfoque de alianzas público-privadas, a través de su actividad como Directora Ejecutiva en la Agencia para el Desarrollo de Pococí.\nFue docente visitante, impartiendo cursos de Experiencia Comunitaria y Comunicación para el Desarrollo y como miembro del equipo técnico del programa de Desarrollo Comunitario de la EARTH.\nEntre sus experiencias laborales trabajó como empresaria y consultora en diversos campos, fue Directora Ejecutiva de la Agencia para el Desarrollo Local de Pococí, fue Asesora de la Presidencia de JAPDEVA y profesora Universitaria de la Universidad de Costa Rica (UCR) y la Universidad Nacional Estatal a Distancia (UNED).\nFue líder activa, apoyó a las comunidades limonenses. En 2016 participó como aspirante a la Vicealcaldía en Pococí. En 2017 alcanzó la candidatura al primer lugar como diputada de la provincia de Limón por el Partido Liberación Nacional (PLN).\nDesde la Asamblea Legislativa trabajó en áreas de interés para el desarrollo de la salud pública y saneamiento ambiental, emprendedurismo, reactivación económica y de la infraestructura, generación de empleo, la mejora en la calidad de la educación, el deporte y la seguridad.", aliases: ['yorleny-leon-marchena'] }
];

export const PRESIDENCIAS: Funcionario[] = [
  {
    "nombre": "Róger Madrigal López",
    "cargo": "Banco Central (BCCR)",
    "institucion": "Banco Central de Costa Rica (BCCR)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/roger-madrigal-lopez.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/banco-central-de-costa-rica-bccr",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Su carrera profesional ha estado estrechamente ligada al Banco Central de Costa Rica, donde inició en 1984; luego de ocupar varios cargos, se desempeñó por casi catorce años (2008-2022) como Economista jefe (director de la División Económica). Además, tiene conocimientos en política monetaria y técnicas cuantitativas. En el ámbito académico ha impartido cursos de econometría y macroeconomía en la Universidad de Costa Rica y la Universidad Nacional de Costa Rica.\nEl Sr. Madrigal López tiene una licenciatura en Economía (1987) y un bachillerato en Estadística (1988) de la Universidad de Costa Rica. También tiene un doctorado de la Universidad Estatal de Ohio (2004).\nSu tesis doctoral abordó la elección óptima de los instrumentos de política monetaria en el contexto de una economía pequeña y abierta bajo un esquema de meta de inflación."
  },
  {
    "nombre": "Mónica Taylor Hernández",
    "cargo": "Caja del Seguro Social (CCSS)",
    "institucion": "Caja Costarricense de Seguro Social (CCSS)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/monica-taylor-hernandez.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/caja-costarricense-de-seguro-social-ccss",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Lidera la Caja Costarricense de Seguro Social con el compromiso de fortalecer el sistema de salud pública del país. Su labor se centra en garantizar el acceso universal a servicios de salud de calidad, promoviendo la eficiencia, la transparencia y la sostenibilidad en la gestión institucional. Bajo su dirección, la CCSS trabaja para mejorar la atención a la población asegurada, optimizar los recursos disponibles y enfrentar los desafíos del sistema de salud, contribuyendo al bienestar y desarrollo de Costa Rica."
  },
  {
    "nombre": "Marco Vinicio Acuña Mora",
    "cargo": "Instituto de Electricidad (ICE)",
    "institucion": "Instituto Costarricense de Electricidad (ICE)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/marco-vinicio-acuna-mora.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-costarricense-de-electricidad-ice",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Es Ingeniero Eléctrico, posee una Maestría en Sistemas de Energía Eléctrica de la Universidad de Costa Rica.\nTambién cuenta con una Maestría en Administración de Negocios de la Universidad Heriot-Watt.\nFue Gerente de Electricidad del Instituto Costarricense de Electricidad (ICE). Laboró como consultor en temas de energía y fue profesor universitario.\nComo Presidente Ejecutivo del Instituto Costarricense de Electricidad, trabajará en el fortalecimiento de la infraestructura energética y de telecomunicaciones del país, impulsando la modernización institucional, la sostenibilidad y el acceso a servicios de calidad para todos los costarricenses.",
    "aliases": [
      "marco-acuna-mora"
    ]
  },
  {
    "nombre": "Gabriela Chacón Fernández",
    "cargo": "Instituto de Seguros (INS)",
    "institucion": "Instituto Nacional de Seguros (INS)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/gabriela-chacon-fernandez.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-nacional-de-seguros-ins",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Lidera el Instituto Nacional de Seguros con el compromiso de fortalecer la seguridad social y promover el bienestar de la población costarricense. Su labor se centra en garantizar la sostenibilidad financiera de la institución, mejorar la calidad de los servicios ofrecidos y fomentar una cultura de prevención y responsabilidad social. Bajo su dirección, el INS trabaja para consolidarse como una institución moderna, eficiente y transparente, al servicio de todos los costarricenses."
  },
  {
    "nombre": "Karla Montero Víquez",
    "cargo": "Refinadora (RECOPE)",
    "institucion": "Refinadora Costarricense de Petróleo (RECOPE)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/karla-montero-viquez.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/refinadora-costarricense-de-petroleo-recope",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Experiencia de 20 años en materia de regulación de los servicios públicos y mercados energéticos. En su perfil se destaca que laboró 16 años en la Autoridad Reguladora de los Servicios Públicos en temas relativos a las fijaciones tarifarias, elaboración de metodologías tarifarias y reglamentos sectoriales, asesoría a la Junta Directiva, al Intendente de Energía y la Comisión Regional de Interconexión Eléctrica y representación en foros y comisiones interinstitucionales. Además, laboró 2 años en AT&T, una empresa de telecomunicaciones en la cual realizaba negociación de contratos, seguimiento de mercados y análisis financiero. Como Gerenta General de RECOPE (2022-2024), con el recargo de la Gerencia de Innovación, coordinó la elaboración del Plan Estratégico empresarial y la reorganización administrativa de Recope. También fue responsable de ejecutar, dirigir, coordinar, supervisar y evaluar la ejecución de todas las operaciones empresariales y de las resoluciones de la Junta Directiva y de la Presidencia con las Gerencias de área. Además, generó acciones de reinvención, transformación, innovación, comunicación y la mejora continua de los procesos empresariales, con el aprovechamiento de las tecnologías emergentes, coordinando los proyectos que potencian los procesos y nuevos productos, para el fortalecimiento de las ventajas competitivas de la Empresa.\nFormación académica:\n• Licenciada en Economía\n• Maestría en Economía de la Regulación\nEspecialidades en:\n• Derecho y Políticas de Competencia\n• Combustibles Limpios\n• Planificación Energética."
  },
  {
    "nombre": "Lourdes Sáurez Barboza",
    "cargo": "Acueductos y Alcantarillados (AyA)",
    "institucion": "Instituto Costarricense de Acueductos y Alcantarillados (AyA)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/lourdes-saurez-barboza.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-costarricense-de-acueductos-y-alcantarillados-aya",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "En su gestión al frente del AyA, Lourdes Sáurez Barboza impulsa el fortalecimiento de la cobertura de agua potable y saneamiento, la modernización de los sistemas de acueductos y alcantarillados, así como la implementación de proyectos que garanticen un servicio oportuno, eficiente y sostenible. Su visión se centra en mejorar la calidad de vida de las comunidades, proteger las fuentes hídricas y garantizar el acceso universal al agua como un derecho humano esencial."
  },
  {
    "nombre": "Paola Nájera Abarca",
    "cargo": "Junta de Protección Social (JPS)",
    "institucion": "Junta de Protección Social (JPS)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/paola-najera-abarca.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/junta-de-proteccion-social-jps",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Cuenta con experiencia en gestión pública, asesoría política y trabajo con comunidades. Se desempeñó como diputada de la República durante el período 2022-2026, impulsando iniciativas relacionadas con el fortalecimiento institucional y el desarrollo social. En mayo de 2026 fue nombrada por la presidenta Laura Fernández Delgado como Presidenta Ejecutiva de la Junta de Protección Social (JPS) para el período 2026-2030. Desde la institución lidera acciones orientadas a fortalecer los programas sociales, impulsar la innovación institucional y garantizar que los recursos generados contribuyan al bienestar y apoyo de miles de personas en Costa Rica."
  },
  {
    "nombre": "Edgar Oviedo Blanco",
    "cargo": "Aprendizaje (INA)",
    "institucion": "Instituto Nacional de Aprendizaje (INA)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/edgar-oviedo-blanco.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-nacional-de-aprendizaje-ina",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Cuenta con una amplia trayectoria en tecnologías de la información, transformación digital, innovación y gestión estratégica. Cuenta con más de 22 años de experiencia como consultor, investigador y docente universitario, además de formación especializada en administración, ingeniería de software y gobierno digital. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Presidente Ejecutivo del Instituto Nacional de Aprendizaje (INA) para el período 2026-2030.\nDesde el INA lidera estrategias orientadas al fortalecimiento de la educación técnica y la formación profesional, impulsando la innovación, la transformación digital y el desarrollo de capacidades que respondan a las necesidades del mercado laboral y al crecimiento económico del país."
  },
  {
    "nombre": "José David Córdoba Rodríguez",
    "cargo": "Consejo de Producción (CNP)",
    "institucion": "Consejo Nacional de Producción (CNP)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/jose-david-cordoba-rodriguez.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/consejo-nacional-de-produccion-cnp",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Lidera el Consejo Nacional de Producción con el compromiso de fortalecer el desarrollo agropecuario y la seguridad alimentaria del país. Su labor se centra en promover políticas y programas que impulsen la producción nacional, fomenten la inclusión de pequeños y medianos productores en los mercados y contribuyan al bienestar social y económico de Costa Rica. Bajo su dirección, el CNP trabaja para garantizar un abastecimiento eficiente y sostenible de productos alimentarios, apoyando a los productores nacionales y asegurando el acceso de la población a alimentos de calidad.",
    "aliases": [
      "jose-david-cordoba"
    ]
  },
  {
    "nombre": "María José Vega Sanabria",
    "cargo": "Patronato de la Infancia (PANI)",
    "institucion": "Patronato Nacional de la Infancia (PANI)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/maria-jose-vega-sanabria.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/patronato-nacional-de-la-infancia-pani",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Es licenciada en Trabajo Social y cuenta con una Maestría en Gestión y Política Pública y una Maestría en Gerencia de Proyectos de Desarrollo. Posee más de 20 años de experiencia en la administración pública, desempeñándose en áreas vinculadas a la gestión social, coordinación interinstitucional y desarrollo de políticas públicas. En mayo de 2026 fue nombrada por la presidenta Laura Fernández Delgado como Presidenta Ejecutiva del Patronato Nacional de la Infancia (PANI) para el período 2026-2030.\nDesde el PANI lidera acciones orientadas a la protección integral de la niñez y adolescencia, el fortalecimiento de programas sociales y la promoción de políticas enfocadas en garantizar los derechos y el bienestar de las personas menores de edad en Costa Rica."
  },
  {
    "nombre": "Carolina Delgado Ramírez",
    "cargo": "Instituto de las Mujeres (INAMU)",
    "institucion": "Instituto Nacional de las Mujeres (INAMU)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/carolina-delgado-ramirez.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-nacional-de-las-mujeres-inamu",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Cuenta con experiencia en gestión pública, liderazgo político y desarrollo de políticas sociales. Se desempeñó como diputada de la República, impulsando iniciativas relacionadas con el fortalecimiento institucional, la igualdad de oportunidades y el desarrollo social. En mayo de 2026 fue nombrada por la presidenta Laura Fernández Delgado como Presidenta Ejecutiva del Instituto Nacional de las Mujeres (INAMU) para el período 2026-2030.\nDesde el INAMU lidera acciones orientadas a la promoción de los derechos de las mujeres, el fortalecimiento de la igualdad y equidad de género, así como el impulso de políticas y programas enfocados en el bienestar, la protección y el desarrollo integral de las mujeres en Costa Rica."
  },
  {
    "nombre": "Ricardo Quesada Salas",
    "cargo": "Desarrollo Rural (INDER)",
    "institucion": "Instituto de Desarrollo Rural (INDER)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/ricardo-quesada-salas.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-de-desarrollo-rural-inder",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Lidera el Instituto de Desarrollo Rural con el compromiso de impulsar el desarrollo integral de las comunidades rurales de Costa Rica. Su labor se centra en promover políticas y programas que fomenten la inclusión social, la seguridad alimentaria y el fortalecimiento de la economía local en las zonas rurales del país. Bajo su dirección, el INDER trabaja para garantizar el acceso equitativo a recursos y oportunidades para los habitantes de las comunidades rurales, contribuyendo al bienestar y desarrollo sostenible de estas regiones."
  },
  {
    "nombre": "Johnny Leiva Badilla",
    "cargo": "Vivienda y Urbanismo (INVU)",
    "institucion": "Instituto Nacional de Vivienda y Urbanismo (INVU)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/johnny-leiva-badilla.jpg",
    "fotoCredito": "Instituto Nacional de Vivienda y Urbanismo (INVU)",
    "fuenteUrl": "https://www.invu.go.cr/autoridades-institucionales",
    "fuenteNombre": "Instituto Nacional de Vivienda y Urbanismo",
    "bio": "Ingeniero Industrial y Máster en Administración de Empresas con énfasis en Banca y Finanzas, con más de 20 años de experiencia en desarrollo inmobiliario, gestión empresarial y función pública. Fue diputado de la República y cuenta con experiencia en comisiones de hacienda, control del gasto público y desarrollo productivo.\nComo Presidente Ejecutivo del Instituto Nacional de Vivienda y Urbanismo (INVU), su perfil institucional destaca la estructuración de proyectos inmobiliarios, financiamiento y articulación público-privada."
  },
  {
    "nombre": "Wagner Alberto Quesada Céspedes",
    "cargo": "Puertos del Pacífico (INCOP)",
    "institucion": "Instituto Costarricense de Puertos del Pacífico (INCOP)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/wagner-alberto-quesada-cespedes.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-costarricense-de-puertos-del-pacifico-incop-1",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Bachiller en Ciencias Políticas por la Universidad de Costa Rica (UCR) y Máster en Administración de Empresas con énfasis en Mercadeo por el Tecnológico de Costa Rica.\nEn mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como presidente ejecutivo del Instituto Costarricense de Puertos del Pacífico (INCOP) para el período 2026-2030.\nA lo largo de su trayectoria profesional, ha estado vinculado al desarrollo de proyectos comerciales y operativos relacionados con la logística y el comercio exterior, tanto en Costa Rica como en la región centroamericana. Asimismo, cuenta con experiencia en la gestión de equipos humanos en áreas de logística, aduanas y puertos, tanto en el sector público como privado.\nSe caracteriza por mantener una visión positiva y optimista, promoviendo el trabajo en equipo y la mejora continua como pilares para avanzar y alcanzar resultados.",
    "aliases": [
      "warner-quesada-cespedes",
      "wagner-quesada-cespedes"
    ]
  },
  {
    "nombre": "Álvaro Bermúdez Peña",
    "cargo": "Ferrocarriles (INCOFER)",
    "institucion": "Instituto Costarricense de Ferrocarriles (INCOFER)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/alvaro-bermudez-pena.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-costarricense-de-ferrocarriles-incofer",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Profesional en Ingeniería Civil, con especialidad en Sistemas de Transportes y Planificación Sectorial, con conocimiento de sistemas ferroviarios en grandes urbes de primer mundo. Con amplia experiencia en planificación, diseño y operación de soluciones en sistemas de transporte de diversa índole, tanto a nivel público como a nivel privado. Formación académica a nivel Internacional en las áreas de Planificación Urbana en Japón y sistemas de Transportes en Italia, así como pasantías en Madrid y Roma sobre Modelación de Transporte Público y Privado. Con experiencia en modelos de financiamiento de proyectos de obra pública y enfocado constantemente en la actualización de los marcos normativos y legislaciones vigentes tanto nacionales como internacionales. Claramente convencido de que las etapas de la planificación de los proyectos son críticas y que la gestión de proyectos a nivel nacional debe hacerse de manera sistemática, coordinada a nivel interinstitucional y con una clara hoja de ruta"
  },
  {
    "nombre": "Marcos Borges",
    "cargo": "Turismo (ICT)",
    "institucion": "Instituto Costarricense de Turismo (ICT)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/marcos-borges.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/instituto-costarricense-de-turismo-ict",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Es administrador de empresas con énfasis en mercadeo y funcionario costarricense con experiencia en gestión estratégica, administración y coordinación de proyectos. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Presidente Ejecutivo del Instituto Costarricense de Turismo (ICT) para el período 2026-2030.\nDesde el ICT lidera iniciativas orientadas al fortalecimiento del turismo como motor de desarrollo económico y social, impulsando estrategias para la promoción internacional de Costa Rica, la atracción de visitantes, la competitividad del sector y el posicionamiento del país como un destino sostenible y de clase mundial.",
    "aliases": [
      "marcos-vargas-borges"
    ]
  },
  {
    "nombre": "José Miguel Jiménez Araya",
    "cargo": "Fomento Municipal (IFAM)",
    "institucion": "Instituto de Fomento y Asesoría Municipal (IFAM)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/jose-miguel-jimenez-araya.jpg",
    "fotoCredito": "Municipalidad de Río Cuarto",
    "fuenteUrl": "https://www.muniriocuarto.go.cr/acaldia",
    "fuenteNombre": "Municipalidad de Río Cuarto",
    "fuentes": [
      {
        "nombre": "Municipalidad de Río Cuarto",
        "url": "https://www.muniriocuarto.go.cr/acaldia"
      },
      {
        "nombre": "Teletica",
        "url": "https://www.teletica.com/amp/nacional/ifam-abre-mesa-de-coordinacion-con-federaciones-municipales_408813"
      }
    ],
    "bio": "Abogado, especialista en derecho comercial. Fue alcalde de Río Cuarto y, según su perfil municipal, se desempeñó como asesor en Casa Presidencial entre 2006 y 2008, asesor jurídico de la Presidencia Ejecutiva del IMAS entre 2008 y 2010, jefe de proyectos del IMAS entre 2010 y 2014 y asesor de la Subgerencia de Desarrollo Social del IMAS.\nComo Presidente Ejecutivo del Instituto de Fomento y Asesoría Municipal (IFAM), participa en la coordinación con gobiernos locales, federaciones municipales y autoridades territoriales para impulsar proyectos de infraestructura, seguridad, desarrollo comunal y modernización institucional."
  },
  {
    "nombre": "Alejandro Picado Eduarte",
    "cargo": "Emergencias (CNE)",
    "institucion": "Comisión Nacional de Prevención de Riesgos y Atención de Emergencias (CNE)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/alejandro-picado-eduarte.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/comision-nacional-de-emergencias-cne",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Lidera la Comisión Nacional de Emergencias con el compromiso de fortalecer la gestión integral del riesgo y la respuesta oportuna ante situaciones de emergencia en Costa Rica. Su labor se centra en coordinar acciones interinstitucionales para proteger la vida y el bienestar de la población costarricense, promoviendo la resiliencia comunitaria y la preparación ante desastres naturales y emergencias. Bajo su dirección, la CNE trabaja para garantizar una respuesta eficiente y efectiva, contribuyendo al desarrollo sostenible y a la seguridad nacional."
  },
  {
    "nombre": "Nelson Peña Navarro",
    "cargo": "Pesca y Acuicultura (INCOPESCA)",
    "institucion": "Instituto Costarricense de Pesca y Acuicultura (INCOPESCA)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/nelson-pena-navarro.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/presidente-ejecutivo-de-pesca-y-acuicultura",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Instituto Costarricense de Pesca y Acuicultura (INCOPESCA), liderado por Nelson Peña Navarro, trabaja con el compromiso de promover una pesca y acuicultura sostenibles que contribuyan al desarrollo económico y social de Costa Rica. Su labor se centra en la implementación de políticas públicas que fomenten la conservación de los recursos marinos, el fortalecimiento de las comunidades pesqueras y la mejora de la competitividad del sector. Bajo su dirección, INCOPESCA trabaja para garantizar una gestión eficiente y transparente de los recursos pesqueros, promoviendo la equidad y el bienestar de los actores involucrados en la cadena productiva."
  },
  {
    "nombre": "Juan Diego López",
    "cargo": "Radio y Televisión (SINART)",
    "institucion": "Sistema Nacional de Radio y Televisión (SINART)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/juan-diego-lopez.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/sistema-nacional-de-radio-y-television-sinart",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Cuenta con una trayectoria en medios de comunicación, comunicación estratégica y gestión institucional. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Presidente Ejecutivo del Sistema Nacional de Radio y Televisión (SINART) para el período 2026-2030. A lo largo de su carrera se desempeñó como periodista, presentador y director de comunicación, además de ocupar funciones relacionadas con estrategia y comunicación pública.\nDesde el SINART lidera iniciativas orientadas al fortalecimiento de los medios públicos, la modernización de las plataformas de comunicación y el acceso a información oportuna y de interés para la ciudadanía."
  },
  {
    "nombre": "Martín Vargas Santamaría",
    "cargo": "Desarrollo Atlántico (JAPDEVA)",
    "institucion": "Junta de Administración Portuaria y de Desarrollo Económico de la Vertiente Atlántica (JAPDEVA)",
    "grupo": "presidencia-ejecutiva",
    "foto": "/gobierno/fotos/martin-vargas-santamaria.jpg",
    "fotoCredito": "Presidencia de la República de Costa Rica (CC BY-SA 4.0)",
    "fuenteUrl": "https://www.presidencia.go.cr/gabinete/junta-de-administracion-portuaria-y-de-desarrollo-economico-de-la-vertiente-atlantica",
    "fuenteNombre": "Presidencia de la República de Costa Rica",
    "bio": "Cuenta con experiencia en gestión institucional, administración y desarrollo estratégico. En mayo de 2026 fue nombrado por la presidenta Laura Fernández Delgado como Presidente Ejecutivo de la Junta de Administración Portuaria y de Desarrollo Económico de la Vertiente Atlántica (JAPDEVA) para el período 2026-2030.\nDesde JAPDEVA lidera iniciativas orientadas al fortalecimiento del desarrollo económico de la región Caribe, la modernización institucional y el impulso de proyectos estratégicos enfocados en infraestructura, competitividad y generación de oportunidades para las comunidades de la vertiente atlántica del país."
  }
];

export const FUNCIONARIOS: Funcionario[] = [...PRESIDENCIA, ...MINISTROS, ...PRESIDENCIAS];

export function getFuncionario(slug: string): Funcionario | undefined {
  return FUNCIONARIOS.find((f) => funcionarioSlug(f) === slug || f.aliases?.includes(slug));
}
