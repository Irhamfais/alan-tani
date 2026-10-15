export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  mapsUrl: string;
}

export interface AppConfig {
  storeName: string;
  tagline: string;
  established: string;
  /** WhatsApp number in international format without "+", used for wa.me links. */
  waNumber: string;
  /** Human-readable WhatsApp number shown on the page. */
  waDisplay: string;
  email: string;
  /** Opening hours as displayed to visitors. */
  operatingHours: string;
  operatingHoursShort: string;
  /** Opening hours in schema.org `openingHours` format, used for JSON-LD. */
  openingHoursSchema: string;
  stores: StoreLocation[];
  marketplace: {
    shopee: string;
    tokopedia: string;
    tiktokshop: string;
  };
  social: {
    facebook: string;
    tiktok: string;
  };
  coverage: {
    lokal: string;
    regional: string;
    nasional: string;
  };
  heroPoints: HeroPoint[];
}

export interface HeroPoint {
  id: string;
  icon: 'award' | 'truck' | 'message-circle' | 'check';
  bold?: string;
  text: string;
}

export type ProductCategory = 'pupuk' | 'bibit' | 'pestisida' | 'alat-pertanian';

export type ProductShape = 'sack' | 'packet' | 'bottle' | 'sprayer' | 'roll';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  /** Not displayed: visitors ask for prices over WhatsApp. Kept optional for future use. */
  price?: number;
  isBestSeller: boolean;
  description: string;
  /** Product photo under /public (square). Falls back to the SVG illustration (`shape`) when absent. */
  image?: string;
  shape: ProductShape;
  tag1: string;
  tag2: string;
}

export interface TestimonialSummary {
  platform: string;
  rating: number;
  ratingScale: number;
  /** Pre-formatted, e.g. "1.700+ ulasan". Re-check on the marketplace before changing. */
  reviewCountLabel: string;
}

export interface Testimonial {
  id: string;
  /** Masked buyer name as shown on the marketplace, e.g. "s*****a". */
  name: string;
  source: string;
  rating: number;
  product: string | null;
  /** ISO date (YYYY-MM-DD), or null when unknown. */
  date: string | null;
  text: string;
}

/** An article parsed from content/articles/<slug>.md (see lib/articles.ts). */
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Square (1:1) photo under /public. */
  image: string;
  /** ISO date, YYYY-MM-DD. */
  publishedDate: string;
  /** Display date, e.g. "14 Okt 2026". */
  dateLabel: string;
  readingTime: string;
  /** Article body rendered from markdown at build time. */
  html: string;
}
