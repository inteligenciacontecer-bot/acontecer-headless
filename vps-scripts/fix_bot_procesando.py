#!/usr/bin/env python3
"""
Patch whatsapp-bot.js: agrega flag procesandoClaude para evitar ejecuciones paralelas.
"""
RUTA = '/opt/acontecer-ia/whatsapp-bot.js'

with open(RUTA, 'r', encoding='utf-8') as f:
    src = f.read()

changes = 0

# 1. Agregar declaracion del flag global
OLD1 = 'let notasPendientesPrensaId = {};'
NEW1 = 'let notasPendientesPrensaId = {};\nlet procesandoClaude = false;  // evita ejecuciones paralelas de Claude'
if OLD1 in src and 'procesandoClaude' not in src:
    src = src.replace(OLD1, NEW1, 1)
    changes += 1
    print("OK 1: flag procesandoClaude declarado")
elif 'procesandoClaude' in src:
    print("INFO 1: flag ya existe, omitiendo")
else:
    print("WARN 1: no se encontro anchor para declaracion del flag")

# 2. Agregar guardia al inicio de procesarConClaude
OLD2 = 'async function procesarConClaude(chat, textoFuente, ts) {\n  // Guardar texto como transcripcion'
NEW2 = 'async function procesarConClaude(chat, textoFuente, ts) {\n  if (procesandoClaude) {\n    console.log(\'[Claude] ya procesando, ignorando solicitud duplicada\');\n    try { await chat.sendMessage(\'\\u23f3 Ya estoy redactando una nota, espere...\'); } catch(e) {}\n    return;\n  }\n  procesandoClaude = true;\n  // Guardar texto como transcripcion'

# También intentar con tildes
OLD2b = 'async function procesarConClaude(chat, textoFuente, ts) {\n  // Guardar texto como transcripción temporal'
NEW2b = 'async function procesarConClaude(chat, textoFuente, ts) {\n  if (procesandoClaude) {\n    console.log(\'[Claude] ya procesando, ignorando solicitud duplicada\');\n    try { await chat.sendMessage(\'\\u23f3 Ya estoy redactando una nota, espere...\'); } catch(e) {}\n    return;\n  }\n  procesandoClaude = true;\n  // Guardar texto como transcripción temporal'

if 'if (procesandoClaude)' not in src:
    if OLD2b in src:
        src = src.replace(OLD2b, NEW2b, 1)
        changes += 1
        print("OK 2: guardia insertada (version con tilde)")
    elif OLD2 in src:
        src = src.replace(OLD2, NEW2, 1)
        changes += 1
        print("OK 2: guardia insertada")
    else:
        # Intentar variantes
        import re
        m = re.search(r'async function procesarConClaude\(chat, textoFuente, ts\) \{', src)
        if m:
            insert_pos = m.end()
            guard = '\n  if (procesandoClaude) {\n    console.log(\'[Claude] ya procesando, ignorando solicitud duplicada\');\n    try { await chat.sendMessage(\'\\u23f3 Ya estoy redactando una nota, espere...\'); } catch(e) {}\n    return;\n  }\n  procesandoClaude = true;'
            src = src[:insert_pos] + guard + src[insert_pos:]
            changes += 1
            print("OK 2: guardia insertada via regex")
        else:
            print("WARN 2: no se encontro la funcion procesarConClaude")
else:
    print("INFO 2: guardia ya existe, omitiendo")

# 3. Resetear flag en los return tempranos y al final de la funcion
# Reemplazar returns dentro de procesarConClaude con reset + return
# Solo los que estan dentro del contexto de error de la funcion

OLD3a = "    await chat.sendMessage('Error redactando con Claude. Verifique logs del servidor.');\n    return;"
NEW3a = "    await chat.sendMessage('Error redactando con Claude. Verifique logs del servidor.');\n    procesandoClaude = false;\n    return;"

OLD3b = "    await chat.sendMessage('Claude no genero nota valida.');\n    return;"
NEW3b = "    await chat.sendMessage('Claude no genero nota valida.');\n    procesandoClaude = false;\n    return;"

OLD3c = "  await enviarNotaParaAprobacion(chat, nota);\n}"
NEW3c = "  procesandoClaude = false;\n  await enviarNotaParaAprobacion(chat, nota);\n}"

for old, new, label in [(OLD3a, NEW3a, '3a'), (OLD3b, NEW3b, '3b'), (OLD3c, NEW3c, '3c')]:
    if old in src and new not in src:
        src = src.replace(old, new, 1)
        changes += 1
        print(f"OK {label}: reset procesandoClaude agregado")
    elif new in src:
        print(f"INFO {label}: ya tiene reset, omitiendo")
    else:
        print(f"WARN {label}: no se encontro patron para reset")

with open(RUTA, 'w', encoding='utf-8') as f:
    f.write(src)

print(f"\nTotal cambios: {changes}")
print("Archivo guardado.")
