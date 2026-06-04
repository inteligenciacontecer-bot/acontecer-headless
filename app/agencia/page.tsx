import type { Metadata } from 'next';
import './agencia.css';
import AgenciaForm from '@/components/AgenciaForm';

export const metadata: Metadata = {
  title: 'Acontecer Studio · Agencia de Comunicación',
  description: 'Agencia de comunicación estratégica, asesoría política y media tech respaldada por la redacción de Acontecer.co.cr.',
  alternates: { canonical: 'https://acontecer.co.cr/agencia' },
  openGraph: { url: 'https://acontecer.co.cr/agencia', title: 'Acontecer Studio · Agencia de Comunicación' },
};

export default function AgenciaPage() {
  return (
    <div className="agencia-page">
      <section className="ag-hero">
      <div className="ag-hero-bg">
      </div>
      <div className="ag-hero-grid">
      </div>
      <div className="ag-hero-glow ag-glow-1">
      </div>
      <div className="ag-hero-glow ag-glow-2">
      </div>
      <div className="ag-hero-noise">
      </div>
      <div className="ag-hero-inner">
      <div className="ag-logo-row">
      <div className="ag-logo">
      <span className="ag-logo-text">acontecer<span className="ag-logo-studio">.co.cr</span>
      </span>
      </div>
      <div className="ag-logo-by">Agencia de Comunicación · <strong>acontecer.co.cr</strong>
      </div>
      </div>
      <div className="ag-hero-eyebrow">
      <span className="ag-hero-eyebrow-dot">
      </span>CONSULTORÍA ESTRATÉGICA · COMUNICACIÓN POLÍTICA · MEDIA TECH</div>
      <h1 className="ag-hero-title">Agencia de Comunicación Acontecer.co.cr</h1>
      <p className="ag-hero-sub">Una agencia respaldada por la redacción de Acontecer.co.cr. Hacemos comunicación estratégica, asesoría política y desplegamos la infraestructura técnica que un mundo que no se detiene exige.</p>
      <div className="ag-hero-ctas">
      <a className="ag-btn-primary" href="https://wa.me/50662889467?text=Hola%2C%20quiero%20un%20diagn%C3%B3stico%20estrat%C3%A9gico%20con%20la%20agencia%20de%20Acontecer.co.cr" target="_blank" rel="noopener">Diagnóstico por WhatsApp <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
      </a>
      <button className="ag-btn-ghost">Explorar infraestructura</button>
      </div>
      <div className="ag-hero-stats">
      <div className="ag-hero-stat">
      <div className="ag-hero-stat-n">+15 M</div>
      <div className="ag-hero-stat-l">Audiencia mensual</div>
      </div>
      <div className="ag-hero-stat">
      <div className="ag-hero-stat-n">15 años</div>
      <div className="ag-hero-stat-l">En comunicación</div>
      </div>
      <div className="ag-hero-stat">
      <div className="ag-hero-stat-n">100 %</div>
      <div className="ag-hero-stat-l">Infraestructura propia</div>
      </div>
      </div>
      </div>
      </section>
      <section className="ag-method">
      <div className="ag-section-head">
      <div className="ag-eyebrow ag-eyebrow-blue">NUESTRO ENFOQUE</div>
      <h2 className="ag-section-title">Ciencia antes que acción.</h2>
      <p className="ag-section-sub">Cuatro etapas no negociables que aplicamos a cada cuenta, sin excepción. Si una de ellas falta, no avanzamos.</p>
      </div>
      <div className="ag-method-grid">
      <div className="ag-method-card">
      <div className="ag-method-n">01</div>
      <h3 className="ag-method-title">Diagnóstico antes que acción</h3>
      <p className="ag-method-body">Análisis profundo de contexto, audiencias y brechas comunicacionales existentes. Auditoría reputacional, mapeo de stakeholders y benchmark sectorial. Nunca abrimos un canal sin saber qué medir.</p>
      <div className="ag-method-tags">
      <span className="ag-mini-tag">Auditoría reputacional</span>
      <span className="ag-mini-tag">Mapeo de audiencias</span>
      <span className="ag-mini-tag">Benchmark sectorial</span>
      </div>
      </div>
      <div className="ag-method-card">
      <div className="ag-method-n">02</div>
      <h3 className="ag-method-title">Mensajes con propósito</h3>
      <p className="ag-method-body">Plataformas de mensaje coherentes, diferenciadas y memorables para cada público objetivo. Narrativa institucional, manuales de voz y arquitectura de mensajes clave.</p>
      <div className="ag-method-tags">
      <span className="ag-mini-tag">Narrativa</span>
      <span className="ag-mini-tag">Manual de voz</span>
      <span className="ag-mini-tag">Mensajes clave</span>
      </div>
      </div>
      <div className="ag-method-card">
      <div className="ag-method-n">03</div>
      <h3 className="ag-method-title">Ejecución multicanal</h3>
      <p className="ag-method-body">Coordinación precisa de medios tradicionales, digitales y relacionales. Calendarios editoriales, vocería entrenada, contenido nativo por canal y placement con líderes de opinión.</p>
      <div className="ag-method-tags">
      <span className="ag-mini-tag">Media placement</span>
      <span className="ag-mini-tag">Vocería</span>
      <span className="ag-mini-tag">Contenido nativo</span>
      </div>
      </div>
      <div className="ag-method-card">
      <div className="ag-method-n">04</div>
      <h3 className="ag-method-title">Métricas y ajuste continuo</h3>
      <p className="ag-method-body">Medición del impacto en tiempo real para maximizar cada resultado. Dashboards propios, reportes ejecutivos quincenales y reasignación táctica con base en datos.</p>
      <div className="ag-method-tags">
      <span className="ag-mini-tag">Dashboards</span>
      <span className="ag-mini-tag">Reportes ejecutivos</span>
      <span className="ag-mini-tag">Optimización táctica</span>
      </div>
      </div>
      </div>
      </section>
      <section className="ag-services">
      <div className="ag-section-head">
      <div className="ag-eyebrow ag-eyebrow-blue">SERVICIOS CORE</div>
      <h2 className="ag-section-title">Estrategia, influencia, ejecución.</h2>
      <p className="ag-section-sub">Seis áreas operadas por equipos especializados. Trabajamos con marcas institucionales, candidatos y corporativos de la región.</p>
      </div>
      <div className="ag-bento">
      <article className="ag-svc ag-svc-lg">
      <div className="ag-svc-top">
      <div className="ag-svc-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>
      <circle cx="19" cy="6" r="2"/>
      </svg>
      </div>
      <span className="ag-svc-tag">PR &amp; RELACIONES PÚBLICAS</span>
      </div>
      <h3 className="ag-svc-title">Gestión de reputación institucional y personal</h3>
      <p className="ag-svc-desc">Construcción de relaciones sólidas con medios, líderes de opinión y reguladores. Posicionamiento de voceros, gestión de menciones y manejo de relaciones con stakeholders críticos.</p>
      <ul className="ag-svc-bullets">
      <li>
      <span className="ag-svc-check">✓</span>Relacionamiento con medios</li>
      <li>
      <span className="ag-svc-check">✓</span>Posicionamiento de voceros</li>
      <li>
      <span className="ag-svc-check">✓</span>Gestión de líderes de opinión</li>
      </ul>
      <div className="ag-svc-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
      </div>
      </article>
      <article className="ag-svc ag-svc-md">
      <div className="ag-svc-top">
      <div className="ag-svc-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="1.5"/>
      <path d="M9 8h2M9 12h2M9 16h2M13 8h2M13 12h2M13 16h2"/>
      </svg>
      </div>
      <span className="ag-svc-tag">ESTRATEGIA CORPORATIVA</span>
      </div>
      <h3 className="ag-svc-title">Identidad narrativa y comunicación interna</h3>
      <p className="ag-svc-desc">Diagnóstico, gestión de stakeholders y cultura interna/externa coherente. Plataformas narrativas que conectan ADN corporativo con percepción pública.</p>
      <div className="ag-svc-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
      </div>
      </article>
      <article className="ag-svc ag-svc-md">
      <div className="ag-svc-top">
      <div className="ag-svc-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5z"/>
      <path d="M8 9h7M8 13h7M8 17h4"/>
      </svg>
      </div>
      <span className="ag-svc-tag">PRENSA &amp; MEDIA PLACEMENT</span>
      </div>
      <h3 className="ag-svc-title">Comunicados con alto impacto en los medios más relevantes</h3>
      <p className="ag-svc-desc">Redacción y difusión estratégica de comunicados, declaraciones oficiales y notas con seguimiento de cobertura en tiempo real.</p>
      <div className="ag-svc-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
      </div>
      </article>
      <article className="ag-svc ag-svc-md">
      <div className="ag-svc-top">
      <div className="ag-svc-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>
      </svg>
      </div>
      <span className="ag-svc-tag">COMUNICACIÓN POLÍTICA</span>
      </div>
      <h3 className="ag-svc-title">Asesoría para el sector público y privado</h3>
      <p className="ag-svc-desc">Conferencias de prensa, producción de agendas y eventos políticos de alto nivel. Estrategia electoral, gestión gubernamental y diplomacia corporativa.</p>
      <div className="ag-svc-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
      </div>
      </article>
      <article className="ag-svc ag-svc-md">
      <div className="ag-svc-top">
      <div className="ag-svc-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>
      </svg>
      </div>
      <span className="ag-svc-tag">REDES &amp; COMMUNITY</span>
      </div>
      <h3 className="ag-svc-title">Comunidades digitales premium</h3>
      <p className="ag-svc-desc">Creación y optimización de comunidades digitales con contenido que genera conversación de valor. Estrategias por plataforma y respuesta editorial.</p>
      <div className="ag-svc-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
      </div>
      </article>
      <article className="ag-svc ag-svc-lg ag-svc-feat">
      <div className="ag-svc-top">
      <div className="ag-svc-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 18H2L12 2z"/>
      <path d="M12 9v5M12 17h.01"/>
      </svg>
      </div>
      <span className="ag-svc-tag">COMUNICACIÓN EN CRISIS</span>
      </div>
      <h3 className="ag-svc-title">Cuando el tiempo importa, la precisión salva.</h3>
      <p className="ag-svc-desc">Protocolos de respuesta inmediata, vocería estratégica y contención de contingencias reputacionales. Equipo de guardia 24/7 con sala de redacción propia respaldada por Acontecer.co.cr.</p>
      <ul className="ag-svc-bullets">
      <li>
      <span className="ag-svc-check">✓</span>Protocolos de respuesta &lt; 2 h</li>
      <li>
      <span className="ag-svc-check">✓</span>Vocería estratégica entrenada</li>
      <li>
      <span className="ag-svc-check">✓</span>Sala de guardia 24/7</li>
      </ul>
      <div className="ag-svc-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
      </div>
      </article>
      </div>
      </section>
      <section className="ag-tech">
      <div className="ag-tech-bg">
      </div>
      <div className="ag-tech-grid-lines">
      </div>
      <div className="ag-tech-inner">
      <div className="ag-section-head ag-section-head-dark">
      <div className="ag-eyebrow ag-eyebrow-cyan">CAPA TECNOLÓGICA · MEDIA TECH</div>
      <h2 className="ag-section-title ag-title-light">No somos una agencia. Dominamos la infraestructura.</h2>
      <p className="ag-section-sub ag-sub-light">Lo que nos diferencia: cada flujo de comunicación corre sobre tecnología propia, operada por nuestro equipo. Sin intermediarios, sin licencias rentadas, sin dependencias externas.</p>
      </div>
      <div className="ag-tech-list">
      <article className="ag-tech-card">
      <div className="ag-tech-card-l">
      <div className="ag-tech-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="6" rx="1"/>
      <rect x="2" y="14" width="20" height="6" rx="1"/>
      <path d="M6 7h.01M6 17h.01"/>
      </svg>
      </div>
      <span className="ag-tech-tag">INFRAESTRUCTURA</span>
      </div>
      <div className="ag-tech-card-c">
      <h3 className="ag-tech-title">Servidores propios de alto rendimiento</h3>
      <p className="ag-tech-desc">Infraestructura privada administrada por nuestro propio equipo, sin licencias rentadas ni dependencias externas. Disponibilidad, seguridad y control total de los entornos informativos.</p>
      </div>
      <div className="ag-tech-stack">
      <span className="ag-stack-chip">Servidores dedicados</span>
      <span className="ag-stack-chip">Cloud privado</span>
      <span className="ag-stack-chip">Alta disponibilidad</span>
      <span className="ag-stack-chip">Respaldo &amp; seguridad</span>
      </div>
      </article>
      <article className="ag-tech-card">
      <div className="ag-tech-card-l">
      <div className="ag-tech-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>
      </svg>
      </div>
      <span className="ag-tech-tag">DISEÑO &amp; DESARROLLO WEB</span>
      </div>
      <div className="ag-tech-card-c">
      <h3 className="ag-tech-title">Diseño web, SEO y performance</h3>
      <p className="ag-tech-desc">Diseño y desarrollo de sitios web profesionales: arquitectura, velocidad de carga, SEO técnico y experiencia de usuario. Sitios institucionales, portales de noticias y landings de campaña.</p>
      </div>
      <div className="ag-tech-stack">
      <span className="ag-stack-chip">Diseño web</span>
      <span className="ag-stack-chip">SEO</span>
      <span className="ag-stack-chip">Performance</span>
      <span className="ag-stack-chip">UX / UI</span>
      <span className="ag-stack-chip">CMS</span>
      </div>
      </article>
      <article className="ag-tech-card">
      <div className="ag-tech-card-l">
      <div className="ag-tech-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="m21 21-4.3-4.3M8 11h6M11 8v6"/>
      </svg>
      </div>
      <span className="ag-tech-tag">POSICIONAMIENTO</span>
      </div>
      <div className="ag-tech-card-c">
      <h3 className="ag-tech-title">Optimización para algoritmos exigentes</h3>
      <p className="ag-tech-desc">Auditorías técnicas, arquitectura limpia de dominios y estrategias de posicionamiento para dominar resultados de búsqueda de forma sostenida.</p>
      </div>
      <div className="ag-tech-stack">
      <span className="ag-stack-chip">Auditorías SEO</span>
      <span className="ag-stack-chip">Schema.org</span>
      <span className="ag-stack-chip">Core Web Vitals</span>
      <span className="ag-stack-chip">Analítica</span>
      </div>
      </article>
      <article className="ag-tech-card">
      <div className="ag-tech-card-l">
      <div className="ag-tech-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="3"/>
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>
      <circle cx="12" cy="12" r="2.5"/>
      </svg>
      </div>
      <span className="ag-tech-tag">AUTOMATIZACIÓN &amp; IA</span>
      </div>
      <div className="ag-tech-card-c">
      <h3 className="ag-tech-title">Flujos autónomos y bots a medida</h3>
      <p className="ag-tech-desc">Diseño de flujos de trabajo autónomos y bots de datos con WhatsApp API. Integración de IA generativa para flujos multimedia.</p>
      </div>
      <div className="ag-tech-stack">
      <span className="ag-stack-chip">WhatsApp API</span>
      <span className="ag-stack-chip">ChatGPT API</span>
      <span className="ag-stack-chip">Midjourney</span>
      <span className="ag-stack-chip">RunwayML</span>
      <span className="ag-stack-chip">n8n</span>
      </div>
      </article>
      <article className="ag-tech-card">
      <div className="ag-tech-card-l">
      <div className="ag-tech-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2"/>
      <path d="M16 10l6-3v10l-6-3z"/>
      </svg>
      </div>
      <span className="ag-tech-tag">PRODUCCIÓN AUDIOVISUAL</span>
      </div>
      <div className="ag-tech-card-c">
      <h3 className="ag-tech-title">Newsrooms bajo alta presión</h3>
      <p className="ag-tech-desc">Liderazgo de salas de redacción y producción audiovisual. Cámaras 4K profesionales, microfonía DJI, DSLR/Mirrorless y postproducción avanzada.</p>
      </div>
      <div className="ag-tech-stack">
      <span className="ag-stack-chip">DaVinci Resolve</span>
      <span className="ag-stack-chip">Adobe CC</span>
      <span className="ag-stack-chip">Cámaras 4K</span>
      <span className="ag-stack-chip">DJI Mic</span>
      <span className="ag-stack-chip">DSLR Pro</span>
      </div>
      </article>
      </div>
      </div>
      </section>
      <section className="ag-impact">
      <div className="ag-impact-item">
      <div className="ag-impact-n">15+</div>
      <div className="ag-impact-l">Años en comunicación estratégica</div>
      </div>
      <div className="ag-impact-item">
      <div className="ag-impact-n">+150 K</div>
      <div className="ag-impact-l">Audiencia activa propia</div>
      </div>
      <div className="ag-impact-item">
      <div className="ag-impact-n">+15 M</div>
      <div className="ag-impact-l">Alcance mensual Acontecer.co.cr</div>
      </div>
      <div className="ag-impact-item">
      <div className="ag-impact-n">100 %</div>
      <div className="ag-impact-l">Infraestructura privada</div>
      </div>
      <div className="ag-impact-item">
      <div className="ag-impact-n">&lt; 2 h</div>
      <div className="ag-impact-l">Respuesta de crisis</div>
      </div>
      <div className="ag-impact-item">
      <div className="ag-impact-n">24 / 7</div>
      <div className="ag-impact-l">Sala de guardia editorial</div>
      </div>
      </section>
      <section className="ag-team">
      <div className="ag-section-head">
      <div className="ag-eyebrow ag-eyebrow-blue">LIDERAZGO EJECUTIVO</div>
      <h2 className="ag-section-title">Los consultores colegiados detrás del estudio.</h2>
      <p className="ag-section-sub">Dos perfiles complementarios y colegiados: prensa y tecnología por un lado, estrategia institucional y crisis por el otro.</p>
      </div>
      <div className="ag-team-grid">
      <article className="ag-member">
      <div className="ag-member-head">
      <div className="ag-member-mono">CV</div>
      <div className="ag-member-head-r">
      <span className="ag-member-role-pill">Periodista &amp; Media Tech Director</span>
      <div className="ag-member-colegiado">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L3.2 7.7l5.4-.8z" fill="#0a73ce"/>
      </svg>Colegiado · Colegio de Periodistas y Comunicadores de Costa Rica</div>
      </div>
      </div>
      <div className="ag-member-body">
      <h3 className="ag-member-name">Carlos Valencia Durán</h3>
      <p className="ag-member-bio">Fundador de Acontecer.co.cr y director de la división tecnológica. Periodista con cobertura internacional acreditada (Europa, elecciones presidenciales) y SysAdmin especializado en infraestructura editorial.</p>
      <div className="ag-member-creds">
      <div className="ag-cred">
      <div className="ag-cred-l">PREMIO</div>
      <div className="ag-cred-v">Mención Honorífica · Premio Alberto Martén Chavarría (AMCHAM)</div>
      </div>
      <div className="ag-cred">
      <div className="ag-cred-l">DISTINCIÓN</div>
      <div className="ag-cred-v">Cum Laude Probatus · Academia</div>
      </div>
      <div className="ag-cred">
      <div className="ag-cred-l">COBERTURA</div>
      <div className="ag-cred-v">Europa · Elecciones internacionales</div>
      </div>
      <div className="ag-cred">
      <div className="ag-cred-l">EXPERTISE</div>
      <div className="ag-cred-v">SysAdmin · Consultor en casos judiciales de alto perfil</div>
      </div>
      </div>
      </div>
      </article>
      <article className="ag-member">
      <div className="ag-member-head">
      <div className="ag-member-mono">KC</div>
      <div className="ag-member-head-r">
      <span className="ag-member-role-pill">Directora de Estrategia &amp; Comunicación Política</span>
      <div className="ag-member-colegiado">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L3.2 7.7l5.4-.8z" fill="#0a73ce"/>
      </svg>Colegiada · Colegio de Profesionales en Comunicación</div>
      </div>
      </div>
      <div className="ag-member-body">
      <h3 className="ag-member-name">Licda. Karen Castro Barahona</h3>
      <p className="ag-member-bio">Más de 15 años liderando comunicación institucional y gubernamental en la región. Especialista en gestión de crisis y productora de debates presidenciales televisados.</p>
      <div className="ag-member-creds">
      <div className="ag-cred">
      <div className="ag-cred-l">EXPERIENCIA</div>
      <div className="ag-cred-v">+15 años · Comunicación institucional y gubernamental</div>
      </div>
      <div className="ag-cred">
      <div className="ag-cred-l">CERTIFICACIÓN</div>
      <div className="ag-cred-v">Gestión de Crisis · Beijing, China</div>
      </div>
      <div className="ag-cred">
      <div className="ag-cred-l">MAESTRÍA</div>
      <div className="ag-cred-v">Comunicación Política e Institucional · Universidad de Barcelona (UPF)</div>
      </div>
      <div className="ag-cred">
      <div className="ag-cred-l">TRAYECTORIA</div>
      <div className="ag-cred-v">Excoordinadora · CFIA / JUPEMA · Productora de debates presidenciales</div>
      </div>
      </div>
      </div>
      </article>
      </div>
      </section>
      <section className="ag-contact">
      <div className="ag-contact-bg">
      </div>
      <div className="ag-contact-grid-lines">
      </div>
      <div className="ag-contact-inner">
      <div className="ag-contact-l">
      <div className="ag-eyebrow ag-eyebrow-cyan">CONTACTO EJECUTIVO</div>
      <h2 className="ag-contact-title">Iniciemos un diagnóstico estratégico.</h2>
      <p className="ag-contact-sub">Cuéntanos brevemente del proyecto. Nuestro equipo responde en menos de 24 horas hábiles con una primera lectura de tu caso.</p>
      <div className="ag-contact-trust">
      <div className="ag-trust-item">
      <div className="ag-trust-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 18H2L12 2z"/>
      <path d="M12 9v5M12 17h.01"/>
      </svg>
      </div>
      <div>
      <div className="ag-trust-t">Respuesta en &lt; 24 h</div>
      <div className="ag-trust-d">Días hábiles, garantizado</div>
      </div>
      </div>
      <div className="ag-trust-item">
      <div className="ag-trust-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>
      </svg>
      </div>
      <div>
      <div className="ag-trust-t">Diagnóstico inicial sin costo</div>
      <div className="ag-trust-d">Primera lectura de tu caso</div>
      </div>
      </div>
      </div>
      </div>
      <AgenciaForm />
      </div>
      </section>
      <section className="ag-footer">
      <div className="ag-logo">
      <span className="ag-logo-text">acontecer<span className="ag-logo-studio">.co.cr</span>
      </span>
      </div>
      <div className="ag-footer-tagline">Agencia de comunicación estratégica, asesoría política y media tech de Acontecer.co.cr</div>
      </section>
    </div>
  );
}
