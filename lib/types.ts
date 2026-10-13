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

export interface Article {
  id: string;
  slug: string;
  category: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
}
