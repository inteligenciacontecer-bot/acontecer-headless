import type { Metadata } from 'next';
import PoliticasClient from './PoliticasClient';

export const metadata: Metadata = {
  title: 'Políticas Editoriales',
  description: 'Políticas de corrección, ética periodística y compromiso con la transparencia de Acontecer.co.cr.',
  alternates: { canonical: 'https://acontecer.co.cr/politicas' },
  openGraph: { url: 'https://acontecer.co.cr/politicas', images: [{ url: 'https://acontecer.co.cr/wp-content/uploads/2026/06/POLITICAS-PORTADA.webp', alt: 'Políticas y términos de uso Acontecer.co.cr' }] },
};

export default function PoliticasPage() {
  return <PoliticasClient />;
}
