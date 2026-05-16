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
            <Link href="/asamblea"
              style={{display:'flex', alignItems:'center', gap:'6px', color:'white', fontSize:'12px', fontWeight:'700', padding:'6px 12px', borderRadius:'6px', textDecoration:'none', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', marginLeft:'4px', whiteSpace:'nowrap'}}
              className="nav-link nav-monitor">
              <MonitorIconSm /> Monitor Legislativo
            </Link>
          </nav>

          <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
            <button onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
              aria-expanded={searchOpen}
              style={{background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{display:'none', flexDirection:'column', justifyContent:'center', gap:'5px', cursor:'pointer', padding:'8px', background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'8px', width:'38px', height:'38px'}}
              className="hamburger-btn" aria-label="Menú">
              <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none'}}/>
              <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', opacity: menuOpen ? 0 : 1}}/>
              <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'}}/>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div style={{borderTop:'1px solid rgba(255,255,255,0.15)', padding:'12px 15px'}}>
            <form onSubmit={handleSearch} style={{maxWidth:'1200px', margin:'0 auto', display:'flex', gap:'8px'}}>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar noticias..." autoFocus className="search-input"
                style={{flex:1, padding:'10px 16px', borderRadius:'8px', border:'none', fontSize:'15px', outline:'none', background:'rgba(255,255,255,0.15)', color:'white'}} />
              <button type="submit" style={{background:'rgba(255,255,255,0.2)', color:'white', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'8px', padding:'10px 18px', fontWeight:'600', cursor:'pointer', fontSize:'13px', display:'flex', alignItems:'center', gap:6}}>
                <SearchIcon /> Buscar
              </button>
              <button type="button" onClick={() => setSearchOpen(false)}
                style={{background:'transparent', color:'rgba(255,255,255,0.6)', border:'none', borderRadius:'8px', padding:'10px 12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <CloseIcon />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)}
          style={{position:'fixed', inset:0, background:'rgba(0,0,40,.55)', zIndex:130, backdropFilter:'blur(8px)', animation:'fadeIn 0.3s ease'}} />
      )}

      {/* ── DRAWER ───────────────────────────────────────────────────────── */}
      <aside
        role={menuOpen ? 'dialog' : undefined}
        aria-modal={menuOpen ? true : undefined}
        aria-label="Menú de navegación"
        aria-hidden={!menuOpen}
        {...(!menuOpen && { inert: '' as unknown as boolean })}
        style={{
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
            </div>
          </div>

          {/* SERVICIO EN VIVO */}
          {(clima || tipoCambio) && (
            <div className="mnu-section">
              <div className="mnu-eyebrow"><span>Servicio en vivo</span></div>
              <div className="mnu-live">
                {clima && (
                  <div className="mnu-live-card">
                    <div className="mnu-live-eyebrow">Hoy · San José</div>
                    <div className="mnu-live-clima">
                      <span className="mnu-live-clima-icon">{clima.icon}</span>
                      <div>
                        <div className="mnu-live-clima-temp">{clima.temp}<sup>°C</sup></div>
                        <div className="mnu-live-clima-desc">{clima.desc}</div>
                      </div>
                    </div>
                  </div>
                )}
                {tipoCambio && (
                  <div className="mnu-live-card">
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
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SÍGANOS */}
          <div className="mnu-section">
            <div className="mnu-eyebrow"><span>Síganos</span></div>
            <div className="mnu-social">
              <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <a href="https://twitter.com/acontecercocr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" style={{width:14,height:14}}><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>
                X / Twitter
              </a>
              <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}><polygon points="5 3 19 12 5 21"/></svg>
                YouTube
              </a>
              <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}><circle cx="12" cy="12" r="9"/><path d="M9 9.5a3 3 0 0 1 5 2.5v3"/></svg>
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
        .mnu-live-card { background: #f3f4f6; border-radius: 12px; padding: 14px 16px; min-width: 0; box-sizing: border-box; }
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
