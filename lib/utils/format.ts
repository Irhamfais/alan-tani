/**
 * Currency formatter for Indonesian Rupiah (IDR).
 */
const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

/**
 * Formats a number to Indonesian Rupiah currency string (e.g. 24000 -> "Rp 24.000").
 * @param amount Numeric value
 * @returns Formatted string "Rp 24.000"
 */
export function formatRupiah(amount: number): string {
  return idrFormatter.format(amount).replace(/\u00a0/g, ' ');
}

export default formatRupiah;
