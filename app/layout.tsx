import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DevBootstrap from '@/lib/DevBootstrap';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nuvra CRM - Sistema de Gestão de Relacionamento',
  description: 'CRM inteligente e portável para gestão de leads, produtos e insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <DevBootstrap />
        {children}
      </body>
    </html>
  );
}
