import configData from '@/data/config.json';

// Public environment variables. NEXT_PUBLIC_* values are inlined at BUILD time, so after changing
// them in the hosting panel the site must be rebuilt (redeployed) for the change to take effect.
// See .env.example for the full list.

/** Site origin without trailing slash. Set NEXT_PUBLIC_SITE_URL; falls back to data/config.json. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || configData.siteUrl).replace(/\/+$/, '');

/** GA4 Measurement ID (G-XXXXXXX). Google Analytics is only loaded when this is set. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || undefined;
