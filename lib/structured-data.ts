import { config } from '@/lib/data';
import { SITE_URL } from '@/lib/env';
import type { StoreLocation } from '@/lib/types';

// schema.org structured data (JSON-LD) for the home page, as one @graph so the nodes can reference
// each other by @id: the brand (Organization), the site (WebSite) and its two stores (LocalBusiness).
// No Product/Offer nodes: prices are intentionally not published, and offers without a price are invalid.

const ORG_ID = `${SITE_URL}/#organization`;
const LOGO = `${SITE_URL}/logo-alan-tani-jaya.png`;

function store(s: StoreLocation) {
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#toko-${s.id}`,
    name: s.schemaName,
    ...(s.alternateName && { alternateName: s.alternateName }),
    url: `${SITE_URL}/`,
    image: LOGO,
    telephone: config.waDisplay,
    email: config.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.streetAddress,
      addressLocality: 'Tanggul',
      addressRegion: 'Jawa Timur',
      addressCountry: 'ID',
    },
    geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng },
    openingHours: config.openingHoursSchema,
    hasMap: s.mapsUrl,
    ...(s.gbpUrl && { sameAs: [s.gbpUrl] }),
    parentOrganization: { '@id': ORG_ID },
  };
}

export function buildJsonLd() {
  const gbpUrls = config.stores.flatMap((s) => (s.gbpUrl ? [s.gbpUrl] : []));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: config.storeName,
        alternateName: 'UD. Alan Tani Jaya',
        url: `${SITE_URL}/`,
        logo: LOGO,
        email: config.email,
        telephone: config.waDisplay,
        sameAs: [
          config.social.facebook,
          config.social.tiktok,
          config.marketplace.shopee,
          config.marketplace.tokopedia,
          config.marketplace.tiktokshop,
          ...gbpUrls,
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: config.storeName,
        url: `${SITE_URL}/`,
        inLanguage: 'id-ID',
        publisher: { '@id': ORG_ID },
      },
      ...config.stores.map(store),
    ],
  };
}
