import config from '@/data/config.json';

/**
 * Generates an official WhatsApp click-to-chat URL with prefilled text (PRD 4.4).
 * @param productName Optional product name for product-specific inquiries.
 * @returns Official WhatsApp URL (https://wa.me/6285875613333?text=...)
 */
export function waLink(productName?: string): string {
  const text = productName
    ? `Halo, saya ingin bertanya tentang produk: ${productName}`
    : 'Halo, saya ingin bertanya tentang produk pertanian';

  const waNum = config.waNumber || '6285875613333';
  return `https://wa.me/${waNum}?text=${encodeURIComponent(text)}`;
}

export default waLink;
