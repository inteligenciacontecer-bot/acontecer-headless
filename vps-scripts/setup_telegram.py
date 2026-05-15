#!/usr/bin/env python3
"""
Ejecutar UNA SOLA VEZ para autenticar la sesión de Telegram.
  /opt/venv/bin/python3 /opt/acontecer-ia/setup_telegram.py
Guarda la sesión en /opt/acontecer-ia/asamblea_session.session
"""
import asyncio
from telethon import TelegramClient
from config_asamblea import TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION

async def main():
    client = TelegramClient(TELEGRAM_SESSION, TELEGRAM_API_ID, TELEGRAM_API_HASH)
    await client.start()   # pide número + código interactivamente
    me = await client.get_me()
    print(f"✅ Sesión guardada como: {me.first_name} ({me.phone})")

    # Muestra grupos disponibles para verificar el nombre exacto
    print("\n📋 Grupos/canales a los que perteneces:")
    async for dialog in client.iter_dialogs():
        if dialog.is_group or dialog.is_channel:
            print(f"  [{dialog.id}] {dialog.name}")

    await client.disconnect()

asyncio.run(main())
