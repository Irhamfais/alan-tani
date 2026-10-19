import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { config } from '@/lib/data';
import { GA_ID, SITE_URL } from '@/lib/env';
import { buildJsonLd } from '@/lib/structured-data';
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

const SITE_TITLE = 'Alan Tani Jaya, Solusi Terbaik Petani | Tanggul, Jember';
const SITE_DESCRIPTION =
  'Alan Tani Jaya, R1 Seller di Tanggul, Jember. Pupuk, bibit, pestisida, dan alat pertanian asli, dikirim cepat ke seluruh Indonesia. Pesan lewat WhatsApp atau marketplace.';

// The share image comes from app/opengraph-image.jpg and app/twitter-image.jpg (file conventions).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${config.storeName}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: config.storeName,
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

const jsonLd = buildJsonLd();

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
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
