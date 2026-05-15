import type { Metadata } from 'next';
import PoliticasClient from './PoliticasClient';

export const metadata: Metadata = {
  title: 'Políticas Editoriales | Acontecer.co.cr',
  description: 'Políticas de corrección, ética periodística y compromiso con la transparencia de Acontecer.co.cr.',
  alternates: { canonical: 'https://acontecer.co.cr/politicas' },
  openGraph: { url: 'https://acontecer.co.cr/politicas' },
};

export default function PoliticasPage() {
  return <PoliticasClient />;
}
