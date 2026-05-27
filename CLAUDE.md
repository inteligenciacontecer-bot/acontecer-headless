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

## 5. Estado de Seguridad del VPS (auditado 2026-05-27)

| Control | Estado | Notas |
|---|---|---|
| UFW Firewall | ✅ Activo | Puertos 80, 443 y **2847** (SSH) solamente — 22 bloqueado |
| SSH Password Auth | ✅ Desactivado | Solo publickey |
| SSH Root Login | ✅ Solo con llave | `permitrootlogin without-password` |
| Fail2Ban | ✅ Activo | 3 jails: sshd (ban 24h), nginx-auth, nginx-rate |
| IP VPS | `207.180.211.235` | Puerto SSH: 2847 · Llave: `id_ed25519_claude_vps` |
| Carpeta proyecto | ✅ `root:root` | Corregido de UIDs desconocidos |
| `.env.local` en git | ✅ Excluido | Regla `.env*` en `.gitignore` |
