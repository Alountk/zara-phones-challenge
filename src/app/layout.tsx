import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Navbar from '@/components/Navbar/Navbar';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'MBST — Phone Store',
  description: 'Welcome to the MBST Phone Store',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
