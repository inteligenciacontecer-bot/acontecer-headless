#!/usr/bin/env python3
"""
Patch redactar.py: reemplaza el bloque try/except JSONDecodeError simple
con un sistema de 3 intentos que limpia caracteres de control y re-extrae JSON.
"""
import re, sys

RUTA = '/opt/acontecer-ia/redactar.py'

with open(RUTA, 'r', encoding='utf-8') as f:
    src = f.read()

OLD = '''    try:
        nota = json.loads(respuesta)
        print(f"[✓] Nota redactada: {nota.get('titulo', 'Sin titulo')}")
        return nota
    except json.JSONDecodeError:
        print("[ERROR] Respuesta no es JSON valido")
        print(f"[DEBUG] Primeros 300 chars: {respuesta[:300]}")
        return {"error": True, "respuesta_cruda": respuesta}'''

NEW = '''    for _intento in range(3):
        try:
            nota = json.loads(respuesta)
            print(f"[\\u2713] Nota redactada: {nota.get('titulo', 'Sin titulo')}")
            return nota
        except json.JSONDecodeError:
            if _intento == 0:
                import unicodedata as _ud
                respuesta = ''.join(
                    c for c in respuesta
                    if _ud.category(c) != 'Cc' or c in '\\n\\r\\t'
                )
            elif _intento == 1:
                _m2 = re.search(r'\\{[\\s\\S]*\\}', respuesta, re.DOTALL)
                if _m2:
                    respuesta = _m2.group(0)
    print("[ERROR] Respuesta no es JSON valido tras 3 intentos")
    print(f"[DEBUG] Primeros 300 chars: {respuesta[:300]}")
    return {"error": True, "respuesta_cruda": respuesta[:500]}'''

if OLD in src:
    src = src.replace(OLD, NEW, 1)
    with open(RUTA, 'w', encoding='utf-8') as f:
        f.write(src)
    print("OK: redactar.py parcheado con exito")
else:
    print("ERROR: bloque original no encontrado - verificar manualmente")
    # Print lines around the area to help diagnose
    for i, line in enumerate(src.splitlines()):
        if 'json.loads' in line or 'JSONDecodeError' in line:
            print(f"  L{i+1}: {line}")
    sys.exit(1)
