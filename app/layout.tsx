import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display-next',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body-next',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alan Tani Jaya, Solusi Terbaik Petani | Tanggul, Jember',
  description: 'Alan Tani Jaya, R1 Seller di Tanggul, Jember. Pupuk, bibit, pestisida, dan alat pertanian asli, dikirim cepat ke seluruh Indonesia. Pesan lewat WhatsApp atau marketplace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${bricolage.variable} ${figtree.variable}`}>
        <a className="skip" href="#main">
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
