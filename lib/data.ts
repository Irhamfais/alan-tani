import configData from '@/data/config.json';
import productsData from '@/data/products.json';
import articlesData from '@/data/articles.json';
import { AppConfig, Product, Article } from './types';

export const config: AppConfig = configData as unknown as AppConfig;
export const products: Product[] = productsData as unknown as Product[];
export const articles: Article[] = articlesData as unknown as Article[];

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

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
