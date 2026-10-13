import { config } from '@/lib/data';

/**
 * Generates an official WhatsApp click-to-chat URL with prefilled text (PRD 4.4).
 * The number comes from data/config.json (`waNumber`).
 * @param productName Optional product name for product-specific inquiries.
 * @returns Official WhatsApp URL (https://wa.me/<waNumber>?text=...)
 */
export function waLink(productName?: string): string {
  const text = productName
    ? `Halo, saya ingin bertanya tentang produk: ${productName}`
    : 'Halo, saya ingin bertanya tentang produk pertanian';

  return `https://wa.me/${config.waNumber}?text=${encodeURIComponent(text)}`;
}

export default waLink;
