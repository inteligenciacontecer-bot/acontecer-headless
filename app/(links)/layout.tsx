// Layout minimalista para páginas standalone tipo link-in-bio
// Sin Ticker, Header ni Footer del sitio principal
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://acontecer.co.cr'),
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
