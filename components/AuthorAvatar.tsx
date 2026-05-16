'use client';

import { useState } from 'react';

/**
 * AuthorAvatar — client component reutilizable
 * Muestra la foto real de Gravatar cuando existe; si no, muestra la inicial
 * con el gradiente azul de Acontecer.
 *
 * Usamos d=404 en la URL de Gravatar: devuelve HTTP 404 cuando el usuario
 * no tiene foto real. onError lo captura y muestra las iniciales.
 */
export default function AuthorAvatar({
  src,
  name,
  size = 44,
  className,
}: {
  src:        string | null;
  name:       string;
  size?:      number;
  className?: string;
}) {
  const [imgOk, setImgOk] = useState(true);

  const initial = (name || 'A').charAt(0).toUpperCase();
  // Gravatar: reemplaza d=mm (mystery-man siempre visible) por d=404 (falla si no hay foto real)
  const safeSrc = src ? src.replace('d=mm', 'd=404') : null;

  if (safeSrc && imgOk) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={safeSrc}
        alt={name}
        width={size}
        height={size}
        className={className}
        style={{
          width:        size,
          height:       size,
          borderRadius: '50%',
          objectFit:    'cover',
          display:      'block',
        }}
        onError={() => setImgOk(false)}
      />
    );
  }

  return (
    <span
      className={className}
      style={{ fontSize: Math.round(size * 0.38), fontWeight: 700 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
