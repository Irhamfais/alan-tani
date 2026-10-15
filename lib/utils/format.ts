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

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Formats an ISO date as a short Indonesian date (e.g. "2026-10-14" -> "14 Okt 2026").
 * Parsed by hand rather than via Date so the result never shifts with the time zone.
 */
export function formatDateId(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
}

export default formatRupiah;
