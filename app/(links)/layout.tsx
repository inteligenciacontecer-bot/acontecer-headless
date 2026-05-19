import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://acontecer.co.cr'),
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        header, footer, .ticker-sticky, #cookie-banner { display: none !important; }
        body { background: #050520 !important; overflow-x: hidden; }
      `}</style>
      {children}
    </>
  );
}
