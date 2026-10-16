import configData from '@/data/config.json';
import productsData from '@/data/products.json';
import testimonialsData from '@/data/testimonials.json';
import awardsData from '@/data/awards.json';
import { AppConfig, Award, Product, Testimonial, TestimonialSummary } from './types';

// Single entry point for site data: components import from here, never from data/*.json.
// Articles live in content/articles/*.md and are read server-side by lib/articles.ts.
// JSON imports widen string unions (e.g. category) to `string`, hence the assertions.
export const config = configData as AppConfig;
export const products = productsData as Product[];
export const testimonials = testimonialsData.testimonials as Testimonial[];
export const testimonialSummary = testimonialsData.summary as TestimonialSummary;
export const awards = awardsData as Award[];

export const CATEGORIES: Record<string, string> = {
  semua: 'Semua',
  pupuk: 'Pupuk',
  bibit: 'Bibit',
  pestisida: 'Pestisida',
  'alat-pertanian': 'Alat Pertanian',
};

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
