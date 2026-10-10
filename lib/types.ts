export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
  mapsAppUrl?: string;
}

export interface AppConfig {
  storeName: string;
  tagline: string;
  established: string;
  waNumber: string;
  waDisplay: string;
  email: string;
  operatingHours: string;
  operatingHoursShort: string;
  stores: {
    induk: StoreLocation;
    cabang: StoreLocation;
  };
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
  heroPoints?: HeroPoint[];
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
  price: number;
  isBestSeller: boolean;
  description: string;
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
