import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Navbar from '@/components/Navbar/Navbar';

export const metadata: Metadata = {
  title: 'MBST — Phone Store',
  description: 'Welcome to the MBST Phone Store',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
