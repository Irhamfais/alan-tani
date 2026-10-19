import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/env';

// Single-page site: only the home page is indexable (articles open in a dialog, not on their own URL).
// No lastModified: reading the clock is not allowed during prerender with Cache Components,
// and a made-up date is worse than none.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 }];
}
