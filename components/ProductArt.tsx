import { Product } from '@/lib/types';

interface ProductArtProps {
  product: Product;
}

export default function ProductArt({ product }: ProductArtProps) {
  const g = 'g' + product.id;
  const g2 = 'h' + product.id;

  return (
    <svg viewBox="0 0 200 240" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="0" x2="1">
          <stop offset="0" stopColor="#F3FAF6" />
          <stop offset="1" stopColor="#B5D2C2" />
        </linearGradient>
        <linearGradient id={g2} x1="0" x2="1">
          <stop offset="0" stopColor="#4BE485" />
          <stop offset="1" stopColor="#17A15A" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="214" rx="64" ry="8" fill="#000" opacity="0.4" />

      {product.shape === 'sack' && (
        <>
          <path d="M54 76H146L152 198Q152 212 138 212H62Q48 212 48 198Z" fill={`url(#${g})`} />
          <path d="M60 58H140L146 76H54Z" fill="#CFE3D6" />
          <path d="M62 66H138" stroke="#93B7A1" strokeWidth="2" strokeDasharray="4 4" />
          <rect x="62" y="104" width="76" height="72" rx="8" fill="#0F5A41" />
          {product.tag1 && (
            <text x="100" y="140" textAnchor="middle" fontSize="24" fill="#EAF6EF">
              {product.tag1}
            </text>
          )}
          {product.tag2 && (
            <text x="100" y="160" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#A9CBB8">
              {product.tag2}
            </text>
          )}
        </>
      )}

      {product.shape === 'packet' && (
        <>
          <path d="M58 50l7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6 7-6 7 6V206Q142 214 134 214H66Q58 214 58 206Z" fill={`url(#${g})`} />
          <rect x="58" y="62" width="84" height="64" fill="#0F5A41" />
          {product.tag1 && (
            <text x="100" y="98" textAnchor="middle" fontSize="22" fill="#EAF6EF">
              {product.tag1}
            </text>
          )}
          {product.tag2 && (
            <text x="100" y="116" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#A9CBB8">
              {product.tag2}
            </text>
          )}
          <path d="M100 192V164" stroke="#0F5A41" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 172C88 172 84 162 84 156C94 156 100 162 100 172Z" fill="#17A15A" />
          <path d="M100 166C112 166 116 156 116 150C106 150 100 156 100 166Z" fill="#17A15A" />
        </>
      )}

      {product.shape === 'bottle' && (
        <>
          <rect x="84" y="36" width="32" height="18" rx="4" fill="#2BD66F" />
          <rect x="90" y="54" width="20" height="14" fill="#CFE3D6" />
          <path d="M90 68Q64 80 64 104V200Q64 212 76 212H124Q136 212 136 200V104Q136 80 110 68Z" fill={`url(#${g})`} />
          <rect x="68" y="116" width="64" height="68" rx="6" fill="#0F5A41" />
          {product.tag1 && (
            <text x="100" y="148" textAnchor="middle" fontSize="18" fill="#EAF6EF">
              {product.tag1}
            </text>
          )}
          {product.tag2 && (
            <text x="100" y="166" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#A9CBB8">
              {product.tag2}
            </text>
          )}
        </>
      )}

      {product.shape === 'sprayer' && (
        <>
          <rect x="84" y="46" width="32" height="18" rx="4" fill="#0F5A41" />
          <rect x="52" y="62" width="96" height="140" rx="26" fill={`url(#${g2})`} />
          <path d="M60 88H140" stroke="#0F5A41" strokeOpacity="0.5" strokeWidth="3" />
          <rect x="66" y="108" width="68" height="46" rx="8" fill="#052A1F" />
          {product.tag1 && (
            <text x="100" y="140" textAnchor="middle" fontSize="22" fill="#EAF6EF">
              {product.tag1}
            </text>
          )}
          <path d="M148 122C178 122 178 170 162 192" fill="none" stroke="#CFE3D6" strokeWidth="5" strokeLinecap="round" />
          <rect x="154" y="190" width="14" height="10" rx="3" fill="#CFE3D6" />
        </>
      )}

      {product.shape === 'roll' && (
        <>
          <circle cx="100" cy="126" r="68" fill="none" stroke="#2BD66F" strokeWidth="10" />
          <circle cx="100" cy="126" r="53" fill="none" stroke="#1FAA5C" strokeWidth="9" />
          <circle cx="100" cy="126" r="39" fill="none" stroke="#168049" strokeWidth="9" />
          <circle cx="100" cy="126" r="17" fill="#CFE3D6" />
          <circle cx="100" cy="126" r="6" fill="#052A1F" />
          <path d="M152 170C172 192 152 208 122 208H72" fill="none" stroke="#2BD66F" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
