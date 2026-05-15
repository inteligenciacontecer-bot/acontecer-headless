'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Inicio',          href: '/' },
  { name: 'Nacionales',      href: '/categoria/nacionales' },
  { name: 'Internacionales', href: '/categoria/internacionales' },
  { name: 'Deportes',        href: '/categoria/deportes' },
  { name: 'Economía',        href: '/categoria/economia' },
  { name: 'Entretenimiento', href: '/categoria/entretenimiento' },
  { name: 'Salud',           href: '/categoria/salud' },
  { name: 'Tecnología',      href: '/categoria/tecnologia' },
  { name: 'Opinión',         href: '/categoria/opinion' },
];

// SVG icons inline
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
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,opacity:0.3}}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const MonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

export default function Header() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router   = useRouter();
  const pathname = usePathname();

  // Cerrar menú al cambiar de ruta
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
      <header style={{background:'#0000A2', padding:'0 15px', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 20px rgba(0,0,162,0.3)', width:'100%', boxSizing:'border-box'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px'}} className="header-inner">
          <Link href="/">
            <Image src="/logo.png" alt="Acontecer.co.cr" width={204} height={32} style={{height:'32px', width:'auto', mixBlendMode:'screen'}} className="header-logo" />
          </Link>

          {/* Desktop nav */}
          <nav style={{display:'flex', gap:'4px', alignItems:'center'}} className="desktop-nav">
            {NAV_ITEMS.slice(0, 6).map(item => (
              <Link key={item.name} href={item.href}
                style={{color:'rgba(255,255,255,0.85)', fontSize:'12px', fontWeight:'600', padding:'6px 10px', borderRadius:'4px', textTransform:'uppercase', textDecoration:'none'}}
                className="nav-link">
                {item.name}
              </Link>
            ))}
            {/* Monitor Legislativo — destacado */}
            <Link href="/asamblea"
              style={{display:'flex', alignItems:'center', gap:'6px', color:'white', fontSize:'12px', fontWeight:'700', padding:'6px 12px', borderRadius:'6px', textDecoration:'none', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', marginLeft:'4px', whiteSpace:'nowrap'}}
              className="nav-link nav-monitor">
              <MonitorIcon /> Monitor Legislativo
            </Link>
          </nav>

          <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
            {/* Búsqueda */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              style={{background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>
            {/* Hamburguesa */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{display:'none', flexDirection:'column', justifyContent:'center', gap:'5px', cursor:'pointer', padding:'8px', background:'rgba(255,255,255,0.1)', border:'none', borderRadius:'8px', width:'38px', height:'38px'}}
              className="hamburger-btn" aria-label="Menú">
              <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none'}}/>
              <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', opacity: menuOpen ? 0 : 1}}/>
              <span style={{display:'block', width:'20px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.25s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'}}/>
            </button>
          </div>
        </div>

        {/* Barra de búsqueda expandible */}
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

      {/* ── Drawer backdrop ─────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:98, backdropFilter:'blur(2px)', animation:'fadeIn 0.2s ease'}}
        />
      )}

      {/* ── Drawer lateral ──────────────────────────────────────────────────── */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(320px, 88vw)',
        background:'white', zIndex:99, display:'flex', flexDirection:'column',
        boxShadow:'-8px 0 32px rgba(0,0,0,0.18)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY:'auto',
      }}>
        {/* Cabecera del drawer */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid #f0f0f0', background:'#0000A2', flexShrink:0}}>
          <Image src="/logo.png" alt="Acontecer" width={166} height={26} style={{height:26, width:'auto', mixBlendMode:'screen'}} />
          <button onClick={() => setMenuOpen(false)}
            style={{background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'8px', width:'34px', height:'34px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
            <CloseIcon />
          </button>
        </div>

        {/* Búsqueda en drawer */}
        <div style={{padding:'14px 16px', borderBottom:'1px solid #f5f5f5'}}>
          <form onSubmit={handleSearch} style={{display:'flex', gap:'8px'}}>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar noticias..." className="search-input-dark"
              style={{flex:1, padding:'9px 14px', borderRadius:'8px', border:'1px solid #e8e8e8', fontSize:'14px', outline:'none', background:'#f8f9fa', color:'#111'}} />
            <button type="submit"
              style={{background:'#0000A2', color:'white', border:'none', borderRadius:'8px', padding:'9px 14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <SearchIcon />
            </button>
          </form>
        </div>

        {/* Links de navegación */}
        <nav style={{flex:1, padding:'8px 0'}}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'13px 20px', textDecoration:'none',
                  color: isActive ? '#0000A2' : '#1a1a1a',
                  background: isActive ? '#f0f4ff' : 'transparent',
                  fontSize:'15px', fontWeight: isActive ? 700 : 500,
                  borderLeft: isActive ? '3px solid #0000A2' : '3px solid transparent',
                  transition:'background 0.15s',
                }}>
                {item.name}
                <ChevronRight />
              </Link>
            );
          })}
        </nav>

        {/* Monitor Legislativo CTA */}
        <div style={{padding:'16px', borderTop:'1px solid #f0f0f0', flexShrink:0}}>
          <Link href="/asamblea" onClick={() => setMenuOpen(false)}
            style={{display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'linear-gradient(135deg,#0000A2,#0a73ce)', borderRadius:10, textDecoration:'none', color:'white'}}>
            <MonitorIcon />
            <div>
              <div style={{fontSize:13, fontWeight:700}}>Monitor Legislativo</div>
              <div style={{fontSize:11, opacity:0.75}}>Asamblea de Costa Rica</div>
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        .search-input::placeholder { color: rgba(255,255,255,0.55); }
        .search-input-dark::placeholder { color: #aaa; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 1100px) {
          .header-inner { height: 80px !important; max-width: 1500px !important; }
          .header-logo { height: 44px !important; }
          .nav-link { font-size: 13.5px !important; padding: 8px 14px !important; letter-spacing: 0.3px; }
        }
      `}</style>
    </>
  );
}
