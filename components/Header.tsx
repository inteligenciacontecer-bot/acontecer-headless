'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { num: '01', name: 'Inicio',          href: '/' },
  { num: '02', name: 'Nacionales',      href: '/categoria/nacionales' },
  { num: '03', name: 'Internacionales', href: '/categoria/internacionales' },
  { num: '04', name: 'Deportes',        href: '/categoria/deportes' },
  { num: '05', name: 'Economía',        href: '/categoria/economia' },
  { num: '06', name: 'Entretenimiento', href: '/categoria/entretenimiento' },
  { num: '07', name: 'Tecnología',      href: '/categoria/tecnologia' },
  { num: '08', name: 'Opinión',         href: '/categoria/opinion' },
  { num: '09', name: 'Turismo',         href: '/categoria/turismo' },
];

/* ── SVG Icons ───────────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CloseIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{width:size,height:size}}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronRight = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:size,height:size}}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const MonitorIconSm = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const MonitorIconLg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
    <path d="M20.5 3.5A11 11 0 0 0 3.5 17l-1.4 5 5-1.4a11 11 0 0 0 13.4-17z"/>
  </svg>
);

export default function Header() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fecha,       setFecha]       = useState('');
  const [clima,       setClima]       = useState<{temp:number;icon:string;desc:string}|null>(null);
  const [tipoCambio,  setTipoCambio]  = useState<{compra:string;venta:string}|null>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    setFecha(new Date().toLocaleDateString('es-CR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }));
    fetch('https://api.open-meteo.com/v1/forecast?latitude=9.9281&longitude=-84.0907&current=temperature_2m,weathercode&timezone=America/Costa_Rica&forecast_days=1')
      .then(r => r.json())
      .then(d => {
        const icons: Record<number,string> = {
          0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
          51:'🌦️',53:'🌦️',55:'🌧️',61:'🌦️',63:'🌧️',65:'🌧️',
          80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',
        };
        const descs: Record<number,string> = {
          0:'DESPEJADO',1:'MAYORM. DESPEJADO',2:'PARC. NUBLADO',3:'NUBLADO',
          45:'NEBLINA',51:'LLOVIZNA',55:'LLOVIZNA',61:'LLUVIA LEVE',
          63:'LLUVIA',65:'LLUVIA',80:'CHUBASCOS',95:'TORMENTA',
        };
        const code = d.current?.weathercode ?? 0;
        setClima({ temp: Math.round(d.current?.temperature_2m ?? 24), icon: icons[code] ?? '🌡️', desc: descs[code] ?? 'VARIABLE' });
      }).catch(() => {});
    fetch('https://tipodecambio.paginasweb.cr/api')
      .then(r => r.json())
      .then(d => {
        if (d.compra && d.venta)
          setTipoCambio({ compra: parseFloat(d.compra).toFixed(2), venta: parseFloat(d.venta).toFixed(2) });
      }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push('/buscar?q=' + encodeURIComponent(searchQuery.trim()));
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* ── HEADER BAR — no modificar ────────────────────────────────────── */}
      <header style={{background:'#0000A2', padding:'0 15px', position:'sticky', top:0, zIndex:120, boxShadow:'0 2px 20px rgba(0,0,162,0.3)', width:'100%', boxSizing:'border-box'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px'}} className="header-inner">

          {searchOpen ? (
            /* ── MODO BÚSQUEDA: header completo se convierte en barra de búsqueda ── */
            <form onSubmit={handleSearch} style={{flex:1, display:'flex', gap:'8px', alignItems:'center', animation:'searchSlideDown 0.15s ease'}}>
              <button type="button" onClick={() => setSearchOpen(false)}
                style={{background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'36px', height:'36px', flexShrink:0, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
                <CloseIcon />
              </button>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar noticias..." autoFocus className="search-input"
                style={{flex:1, minWidth:0, padding:'9px 14px', borderRadius:'8px', border:'none', fontSize:'15px', outline:'none', background:'rgba(255,255,255,0.18)', color:'white'}} />
              <button type="submit"
                style={{background:'white', color:'#0000A2', border:'none', borderRadius:'8px', padding:'9px 16px', fontWeight:'700', cursor:'pointer', fontSize:'13px', display:'flex', alignItems:'center', gap:5, flexShrink:0, whiteSpace:'nowrap'}}>
                <SearchIcon /> <span className="search-btn-label">Buscar</span>
              </button>
            </form>
          ) : (
            /* ── MODO NORMAL ─────────────────────────────────────────────────── */
            <>
              <Link href="/">
                <Image src="/logo.png" alt="Acontecer.co.cr" width={204} height={32} style={{height:'32px', width:'auto', mixBlendMode:'screen'}} className="header-logo" />
              </Link>

              <nav style={{display:'flex', gap:'4px', alignItems:'center'}} className="desktop-nav">
                {NAV_ITEMS.slice(0, 6).map(item => (
                  <Link key={item.name} href={item.href}
                    style={{color:'rgba(255,255,255,0.85)', fontSize:'12px', fontWeight:'600', padding:'6px 10px', borderRadius:'4px', textTransform:'uppercase', textDecoration:'none'}}
                    className="nav-link">
                    {item.name}
                  </Link>
                ))}
                <Link href="/servicios"
                  style={{color:'rgba(255,255,255,0.85)', fontSize:'12px', fontWeight:'600', padding:'6px 10px', borderRadius:'4px', textTransform:'uppercase', textDecoration:'none'}}
                  className="nav-link">
                  Servicios
                </Link>
                <Link href="/asamblea"
                  style={{display:'flex', alignItems:'center', gap:'6px', color:'white', fontSize:'12px', fontWeight:'700', padding:'6px 12px', borderRadius:'6px', textDecoration:'none', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', marginLeft:'4px', whiteSpace:'nowrap'}}
                  className="nav-link nav-monitor">
                  <MonitorIconSm /> Monitor Legislativo
                </Link>
              </nav>

              <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <button onClick={() => setSearchOpen(true)}
                  style={{background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
                  <SearchIcon />
                </button>
                <button onClick={() => setMenuOpen(!menuOpen)}
                  style={{display:'flex', flexDirection:'column', justifyContent:'center', gap:'5px', cursor:'pointer', padding:'8px', background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'8px', width:'38px', height:'38px'}}
                  className="hamburger-btn" aria-label="Menú">
                  <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none'}}/>
                  <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', opacity: menuOpen ? 0 : 1}}/>
                  <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'}}/>
                </button>
              </div>
            </>
          )}

        </div>
      </header>

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)}
          style={{position:'fixed', inset:0, background:'rgba(0,0,40,.55)', zIndex:130, backdropFilter:'blur(8px)', animation:'fadeIn 0.3s ease'}} />
      )}

      {/* ── DRAWER ───────────────────────────────────────────────────────── */}
      <aside aria-modal={menuOpen} aria-label="Menú de navegación" style={{
        position:'fixed', top:0, right:0, bottom:0,
        width:'min(480px, 92vw)',
        background:'#fff', zIndex:140,
        display:'flex', flexDirection:'column',
        boxShadow:'-24px 0 64px rgba(0,0,30,.25)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.35s cubic-bezier(.22,.61,.36,1)',
        overflow:'hidden',
      }}>

        {/* HEAD */}
        <div className="mnu-head">
          <div className="mnu-head-row">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image src="/logo.png" alt="Acontecer.co.cr" width={166} height={28}
                style={{height:28, width:'auto', mixBlendMode:'screen', display:'block'}} />
            </Link>
            <button onClick={() => setMenuOpen(false)} className="mnu-close" aria-label="Cerrar menú">
              <CloseIcon size={16} />
            </button>
          </div>
          <div className="mnu-meta">
            <span className="mnu-meta-dot" />
            <span>EN VIVO</span>
            <span style={{opacity:.4}}>·</span>
            <strong>{fecha}</strong>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mnu-search">
          <form onSubmit={handleSearch} className="mnu-search-wrap">
            <SearchIcon />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar noticias, diputados, temas…" className="mnu-search-input" />
          </form>
        </div>

        {/* BODY */}
        <div className="mnu-body">

          {/* SECCIONES */}
          <div className="mnu-section">
            <div className="mnu-eyebrow">
              <span>Secciones</span>
              <span className="mnu-eyebrow-count">0{NAV_ITEMS.length}</span>
            </div>
            <nav className="mnu-nav">
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                    className={`mnu-nav-item${isActive ? ' is-active' : ''}`}>
                    <span className="mnu-nav-num">{item.num}</span>
                    <span className="mnu-nav-label">{item.name}</span>
                    <ChevronRight />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ACCESO RÁPIDO */}
          <div className="mnu-section">
            <div className="mnu-eyebrow"><span>Acceso rápido</span></div>
            <div className="mnu-cta-row">
              <Link href="/asamblea" onClick={() => setMenuOpen(false)} className="mnu-cta mnu-cta-monitor">
                <div className="mnu-cta-inner">
                  <div className="mnu-cta-icon"><MonitorIconLg /></div>
                  <div>
                    <div className="mnu-cta-title">Monitor Legislativo</div>
                    <div className="mnu-cta-sub">Diputados · Votaciones · En vivo</div>
                  </div>
                  <ChevronRight size={16} />
                </div>
              </Link>
              <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S"
                target="_blank" rel="noopener noreferrer"
                className="mnu-cta mnu-cta-wa" onClick={() => setMenuOpen(false)}>
                <div className="mnu-cta-inner">
                  <div className="mnu-cta-icon"><WaIcon /></div>
                  <div>
                    <div className="mnu-cta-title">Canal de WhatsApp</div>
                    <div className="mnu-cta-sub">Noticias al instante · Canal oficial</div>
                  </div>
                  <ChevronRight size={16} />
                </div>
              </a>
              <Link href="/servicios" onClick={() => setMenuOpen(false)} className="mnu-cta mnu-cta-svc">
                <div className="mnu-cta-inner">
                  <div className="mnu-cta-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>
                  <div>
                    <div className="mnu-cta-title">Servicios</div>
                    <div className="mnu-cta-sub">Tipo de cambio · Clima · Combustibles · Lotería</div>
                  </div>
                  <ChevronRight size={16} />
                </div>
              </Link>
            </div>
          </div>

          {/* SERVICIO EN VIVO */}
          {(clima || tipoCambio) && (
            <div className="mnu-section">
              <div className="mnu-eyebrow"><span>Servicio en vivo</span></div>
              <div className="mnu-live">
                {clima && (
                  <Link href="/clima" onClick={() => setMenuOpen(false)} className="mnu-live-card" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Ver el clima en Costa Rica por provincia y cantón">
                    <div className="mnu-live-eyebrow">Hoy · San José</div>
                    <div className="mnu-live-clima">
                      <span className="mnu-live-clima-icon">{clima.icon}</span>
                      <div>
                        <div className="mnu-live-clima-temp">{clima.temp}<sup>°C</sup></div>
                        <div className="mnu-live-clima-desc">{clima.desc}</div>
                      </div>
                    </div>
                    <div className="mnu-live-more">Ver pronóstico <span aria-hidden="true">→</span></div>
                  </Link>
                )}
                {tipoCambio && (
                  <Link href="/tipo-de-cambio" onClick={() => setMenuOpen(false)} className="mnu-live-card" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Ver tipo de cambio del dólar y convertidor de monedas">
                    <div className="mnu-live-eyebrow">BCCR · cierre</div>
                    <div className="mnu-live-row">
                      <span className="mnu-live-lbl">Venta</span>
                      <span className="mnu-live-val">₡{tipoCambio.venta}</span>
                    </div>
                    <div className="mnu-live-divider" />
                    <div className="mnu-live-row">
                      <span className="mnu-live-lbl">Compra</span>
                      <span className="mnu-live-val">₡{tipoCambio.compra}</span>
                    </div>
                    <div className="mnu-live-more">Convertidor <span aria-hidden="true">→</span></div>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* SÍGANOS */}
          <div className="mnu-section">
            <div className="mnu-eyebrow"><span>Síganos</span></div>
            <div className="mnu-social">
              <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}} aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.029H9.101z"/></svg>
                Facebook
              </a>
              <a href="https://twitter.com/acontecercocr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}} aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                X / Twitter
              </a>
              <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}} aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
              <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}} aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.08-.14 1.62.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                TikTok
              </a>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mnu-foot">
          <span>© 2026 Acontecer.co.cr</span>
          <div className="mnu-foot-links">
            <Link href="/contacto"   onClick={() => setMenuOpen(false)}>Contacto</Link>
            <Link href="/privacidad" onClick={() => setMenuOpen(false)}>Privacidad</Link>
          </div>
        </div>
      </aside>

      <style>{`
        .search-input::placeholder { color: rgba(255,255,255,0.55); }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes searchSlideDown {
          from { opacity:0; transform:translateY(-4px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @media (max-width: 380px) {
          .search-btn-label { display: none; }
        }
        @media (max-width: 992px) {
          .desktop-nav   { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 1100px) {
          .header-inner { height: 80px !important; max-width: 1500px !important; }
          .header-logo  { height: 44px !important; }
          .nav-link     { font-size: 13.5px !important; padding: 8px 14px !important; letter-spacing: 0.3px; }
        }

        /* ── DRAWER CSS ──────────────────────────────────────────────── */
        .mnu-head {
          position: relative;
          background: linear-gradient(135deg, #00006e 0%, #00009e 45%, #0a73ce 100%);
          padding: 22px 28px; color: #fff; overflow: hidden; flex-shrink: 0;
        }
        .mnu-head::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }
        .mnu-head-row { display: flex; align-items: center; justify-content: space-between; position: relative; }
        .mnu-close {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
          color: #fff; display: grid; place-items: center; cursor: pointer;
          transition: all .15s; flex-shrink: 0;
        }
        .mnu-close:hover { background: #fff; color: #0000A2; border-color: #fff; }
        .mnu-meta {
          display: flex; align-items: center; gap: 10px; margin-top: 16px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase;
          color: rgba(255,255,255,.7); position: relative; flex-wrap: wrap;
        }
        .mnu-meta strong { color: #fff; font-weight: 500; }
        .mnu-meta-dot {
          width: 6px; height: 6px; background: #00c853;
          border-radius: 50%; animation: mnu-pulse 1.4s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes mnu-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .35 } }

        .mnu-search { padding: 16px 22px; border-bottom: 1px solid #e5e7eb; flex-shrink: 0; }
        .mnu-search-wrap { position: relative; display: flex; align-items: center; }
        .mnu-search-wrap > svg { position: absolute; left: 16px; color: #6b7280; pointer-events: none; }
        .mnu-search-input {
          width: 100%; padding: 12px 16px 12px 44px;
          border: 1px solid #e5e7eb; border-radius: 999px;
          background: #f3f4f6; font-size: 14px; color: #0a0e1a;
          transition: all .15s; outline: none;
        }
        .mnu-search-input::placeholder { color: #6b7280; }
        .mnu-search-input:focus { background: #fff; border-color: #0000A2; box-shadow: 0 0 0 3px #e6f1fa; }

        .mnu-body { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
        .mnu-body::-webkit-scrollbar { width: 4px; }
        .mnu-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }

        .mnu-section { padding: 22px 28px 8px; }
        .mnu-section + .mnu-section { border-top: 1px solid #e5e7eb; margin-top: 8px; }
        .mnu-eyebrow {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
          color: #6b7280; margin-bottom: 14px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .mnu-eyebrow-count { color: #9ca3af; font-weight: 400; }

        .mnu-nav { display: flex; flex-direction: column; gap: 2px; padding-bottom: 14px; }
        .mnu-nav-item {
          display: grid; grid-template-columns: 32px 1fr 18px;
          gap: 14px; align-items: center;
          padding: 12px 14px; margin: 0 -14px; border-radius: 12px;
          text-decoration: none; color: inherit; transition: background .15s;
        }
        .mnu-nav-item:hover { background: #f3f4f6; }
        .mnu-nav-item:hover .mnu-nav-num,
        .mnu-nav-item:hover .mnu-nav-label { color: #0000A2; }
        .mnu-nav-item:hover svg { opacity: 1; transform: translateX(2px); color: #0000A2; }
        .mnu-nav-item.is-active { background: #e6f1fa; }
        .mnu-nav-item.is-active .mnu-nav-num,
        .mnu-nav-item.is-active .mnu-nav-label { color: #0000A2; }
        .mnu-nav-item.is-active svg { opacity: 1; color: #0000A2; }
        .mnu-nav-num {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; font-weight: 500; letter-spacing: .06em;
          color: #9ca3af; text-align: center; transition: color .15s;
        }
        .mnu-nav-label {
          font-size: 20px; line-height: 1.1; font-weight: 500;
          color: #0a0e1a; letter-spacing: -.01em; transition: color .15s;
        }
        .mnu-nav-item svg { opacity: 0; transition: opacity .15s, transform .15s; color: #9ca3af; }

        .mnu-cta-row { display: flex; flex-direction: column; gap: 10px; padding-bottom: 14px; }
        .mnu-cta {
          position: relative; padding: 18px 20px; border-radius: 14px;
          color: #fff; overflow: hidden; transition: transform .15s;
          text-decoration: none; display: block;
        }
        .mnu-cta:hover { transform: translateY(-2px); }
        .mnu-cta::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 24px 24px; pointer-events: none;
        }
        .mnu-cta-monitor { background: linear-gradient(135deg, #00006e 0%, #0a73ce 100%); }
        .mnu-cta-wa      { background: linear-gradient(135deg, #00a040 0%, #007c34 100%); }
        .mnu-cta-svc     { background: linear-gradient(135deg, #0a73ce 0%, #00c6ff 100%); }
        .mnu-cta-inner { display: flex; align-items: center; gap: 14px; position: relative; }
        .mnu-cta-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.22);
          display: grid; place-items: center; flex-shrink: 0;
        }
        .mnu-cta-title { font-size: 17px; font-weight: 600; line-height: 1.15; letter-spacing: -.01em; }
        .mnu-cta-sub {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          color: rgba(255,255,255,.75); margin-top: 4px;
        }
        .mnu-cta-inner > svg:last-child { margin-left: auto; opacity: .7; transition: transform .15s, opacity .15s; flex-shrink: 0; }
        .mnu-cta:hover .mnu-cta-inner > svg:last-child { opacity: 1; transform: translateX(2px); }

        .mnu-live { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-bottom: 14px; }
        .mnu-live-card { display: block; background: #f3f4f6; border-radius: 12px; padding: 14px 16px; min-width: 0; box-sizing: border-box; transition: background .15s; cursor: pointer; }
        .mnu-live-card:hover { background: #e5e7eb; }
        .mnu-live-more { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: #0a73ce; font-weight: 600; margin-top: 10px; }
        .mnu-live-eyebrow { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: #6b7280; margin-bottom: 8px; }
        .mnu-live-clima { display: flex; align-items: center; gap: 10px; }
        .mnu-live-clima-icon { font-size: 24px; line-height: 1; }
        .mnu-live-clima-temp { font-size: 22px; font-weight: 500; line-height: 1; letter-spacing: -.015em; color: #0a0e1a; }
        .mnu-live-clima-temp sup { font-size: 12px; color: #6b7280; margin-left: 1px; font-family: 'JetBrains Mono', ui-monospace, monospace; vertical-align: super; }
        .mnu-live-clima-desc { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 9.5px; letter-spacing: .08em; color: #6b7280; text-transform: uppercase; margin-top: 2px; }
        .mnu-live-row { display: flex; align-items: baseline; justify-content: space-between; }
        .mnu-live-row + .mnu-live-row { margin-top: 4px; }
        .mnu-live-divider { height: 1px; background: #e5e7eb; margin: 8px 0; }
        .mnu-live-val { font-size: 16px; font-weight: 500; color: #0a0e1a; letter-spacing: -.01em; }
        .mnu-live-lbl { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; color: #6b7280; letter-spacing: .08em; text-transform: uppercase; }

        .mnu-social { display: flex; gap: 8px; padding-bottom: 18px; flex-wrap: wrap; }
        .mnu-social a {
          display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px;
          border-radius: 999px; background: #f3f4f6; border: 1px solid #e5e7eb;
          font-size: 12px; font-weight: 600; color: #1f2937;
          transition: all .15s; text-decoration: none;
        }
        .mnu-social a:hover { background: #0000A2; color: #fff; border-color: #0000A2; }

        .mnu-foot {
          padding: 18px 28px 22px; border-top: 1px solid #e5e7eb; flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #6b7280;
        }
        .mnu-foot-links { display: flex; gap: 14px; }
        .mnu-foot-links a { color: #6b7280; text-decoration: none; }
        .mnu-foot-links a:hover { color: #0000A2; }

        @media (max-width: 480px) {
          .mnu-head    { padding: 18px 20px; }
          .mnu-search  { padding: 14px 18px; }
          .mnu-section { padding: 18px 20px 6px; }
          .mnu-nav-item { padding: 10px 12px; margin: 0 -12px; }
          .mnu-nav-label { font-size: 18px; }
          .mnu-foot    { padding: 16px 20px 18px; }
        }
      `}</style>
    </>
  );
}
