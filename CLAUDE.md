@AGENTS.md

# Protocolo de Seguridad — Acontecer.co.cr

> Este archivo es leído automáticamente por Claude Code al inicio de cada sesión.
> **Cumplimiento obligatorio. No negociable.**

---

## 1. Cero Exposición de Secretos

- **NUNCA** leer, mostrar ni incluir en contexto: `.env`, `.env.local`, `.env.*`, claves SSH, tokens de API.
- Si el usuario no lo pide explícitamente con nombre de archivo, no leer archivos de credenciales.
- Cualquier archivo nuevo que contenga credenciales → agregarlo a `.gitignore` **antes** del primer `git add`.
- Verificar con `git status` antes de cada commit que `.env*` no aparezca en la lista de archivos staged.

## 2. Build Obligatorio Antes de Producción

Antes de dar por finalizada **cualquier tarea** que modifique `app/`, `components/`, `lib/`, `middleware.ts` o `next.config.ts`:

```
1. npm run build
2a. Si FALLA  → git checkout -- .  y notificar error. NO reiniciar PM2.
2b. Si PASA   → pm2 reload acontecer-next
               git add -A && commit con formato de auditoría
```

## 3. Restricción de Ámbito

- Entorno de trabajo: **exclusivamente `/var/www/acontecer-headless/`**
- Requieren permiso explícito antes de modificar:
  - `/etc/nginx/`  → generar bloque de código para validación manual del usuario
  - `/etc/ssh/`    → solo lectura para diagnóstico, nunca escritura sin permiso
  - `/etc/fail2ban/` → idem
  - `/opt/acontecer-ia/` → con cuidado, es el bot de producción activo
  - Cualquier `crontab` del sistema

## 4. Formato de Commits (auditoría)

```
tipo: descripción breve | Impacto: bajo/medio/alto

- Detalle de cambio 1
- Detalle de cambio 2
```

Tipos: `feat` | `fix` | `perf` | `chore` | `backup`

Commit de respaldo **obligatorio** antes de cualquier cambio de impacto medio/alto:
```
git add -A && git commit -m "backup: antes de [descripción]"
```

## 5. Features Críticas — NUNCA Romper

> Diagnosticadas con costo alto. Están documentadas en el código con `⚠️ ZONA PROTEGIDA`.

### A. Overflow móvil en páginas de artículo (`nota.css`)
| Regla | Por qué existe |
|---|---|
| `.nv2-article-wrap { overflow-x: hidden }` | Crea BFC que contiene embeds/widgets anchos |
| `.nv2-article-wrap > main, > aside { min-width: 0 }` | CSS grid usa `min-width:auto` por defecto → sin esto el track se expande más allá del viewport |
| `blockquote.tiktok-embed, .twitter-tweet, .instagram-media, ins.adsbygoogle { display:none!important }` | Embeds con `min-width` fijo que no renderizan en headless |
| `blockquote[style*="min/max-width"] { overflow:hidden!important }` | El `!important` es OBLIGATORIO porque el pull-quote general tiene `overflow:visible!important` |

### B. Pipeline `limpiarContenido` (`app/[categoria]/[slug]/page.tsx`)
Strips que NO se pueden eliminar:
- `blockquote.tiktok-embed` — min-width:325px fijo
- `blockquote.twitter-tweet` — min-width fijo
- `blockquote.instagram-media` — min-width fijo
- `ins.adsbygoogle` — anuncios fluid que cargan iframes
- `<script>` en contenido — adsbygoogle.js, embed.js
- `data-src → src` — artículos 2021 con placeholder gif
- `<noscript>` — lazyload plugin duplica imágenes

### C. Features de artículo activos en producción
| Feature | Clase CSS | Ubicación en JSX |
|---|---|---|
| **Cita destacada** | `.nv2-cita-destacada` | `limpiarContenido` → párrafos con «» o "" tipográficas |
| **Banner canal WA** | `.nv2-wa-cta` | `insertarBannerWA()` → después del 3er párrafo |
| **Lea también** (mid-article, solo móvil) | `.nv2-lea-mas-wrap` | Entre p1 y p2 del artículo principal |
| **Paute inline** | `.nv2-paute-inline` | Antes del share bar final (ingreso publicitario) |

---

## 6. Estado de Seguridad del VPS (auditado 2026-05-27)

| Control | Estado | Notas |
|---|---|---|
| UFW Firewall | ✅ Activo | Puertos 80, 443 y **2847** (SSH) solamente — 22 bloqueado |
| SSH Password Auth | ✅ Desactivado | Solo publickey |
| SSH Root Login | ✅ Solo con llave | `permitrootlogin without-password` |
| Fail2Ban | ✅ Activo | 3 jails: sshd (ban 24h), nginx-auth, nginx-rate |
| IP VPS | `207.180.211.235` | Puerto SSH: 2847 · Llave: `id_ed25519_claude_vps` |
| Carpeta proyecto | ✅ `root:root` | Corregido de UIDs desconocidos |
| `.env.local` en git | ✅ Excluido | Regla `.env*` en `.gitignore` |
