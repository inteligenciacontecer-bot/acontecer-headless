'use client';

import { usePathname } from 'next/navigation';

// Oculta el footer global del sitio SOLO en la página de la agencia (/agencia),
// que tiene su propio cierre de diseño. El resto del sitio lo conserva.
export default function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/agencia') return null;
  return <>{children}</>;
}
