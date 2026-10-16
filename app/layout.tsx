import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { config } from '@/lib/data';
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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.siteUrl}/#toko-induk`,
    name: 'Alan Tani Jaya - Toko Induk',
    image: `${config.siteUrl}/logo-alan-tani-jaya.png`,
    telephone: config.waDisplay,
    email: config.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.stores[0].address,
      addressLocality: 'Tanggul',
      addressRegion: 'Jawa Timur',
      addressCountry: 'ID',
    },
    openingHours: config.openingHoursSchema,
    hasMap: config.stores[0].mapsUrl,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${config.siteUrl}/#toko-cabang`,
    name: 'Alan Tani Jaya - Toko Cabang',
    image: `${config.siteUrl}/logo-alan-tani-jaya.png`,
    telephone: config.waDisplay,
    email: config.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.stores[1].address,
      addressLocality: 'Tanggul',
      addressRegion: 'Jawa Timur',
      addressCountry: 'ID',
    },
    openingHours: config.openingHoursSchema,
    hasMap: config.stores[1].mapsUrl,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${bricolage.variable} ${figtree.variable}`}>
        <a className="skip" href="#main">
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
