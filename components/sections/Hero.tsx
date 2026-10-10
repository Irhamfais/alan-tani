import Image from 'next/image';
import { Award, Truck, MessageCircle, Check } from 'lucide-react';
import config from '@/data/config.json';
import { waLink } from '@/lib/utils/whatsapp';
import HeroLogo from './HeroLogo';

const heroIconMap = {
  award: Award,
  truck: Truck,
  'message-circle': MessageCircle,
  check: Check,
} as const;

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <Image
          src="/images/hero/bg-hero.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={70}
          fetchPriority="high"
          preload
        />
      </div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>Solusi Terbaik Petani</h1>
          <p className="lead">
            Mitra terpercaya petani sejak 2020. Pupuk, bibit, pestisida, dan alat pertanian pilihan, dikirim ke seluruh Indonesia.
          </p>
          <div className="hero-cta">
            <a
              className="btn btn-primary"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              data-wa
              data-wa-loc="hero"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Chat WhatsApp
              <span className="btn-dot">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
            <a className="btn btn-ghost" href="#produk">
              Lihat produk unggulan
            </a>
          </div>
          <ul className="hero-points">
            {config.heroPoints.map((point) => {
              const Icon = heroIconMap[point.icon as keyof typeof heroIconMap] || Check;
              return (
                <li key={point.id}>
                  <Icon size={20} aria-hidden="true" />
                  <span>
                    {point.bold ? <strong>{point.bold} </strong> : null}
                    {point.text}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="hero-mp">
            Juga tersedia di
            <a
              className="text-link"
              href={config.marketplace.shopee}
              target="_blank"
              rel="noopener noreferrer"
              data-mp="shopee"
            >
              Shopee
            </a>
            <a
              className="text-link"
              href={config.marketplace.tokopedia}
              target="_blank"
              rel="noopener noreferrer"
              data-mp="tokopedia"
            >
              Tokopedia
            </a>
            <a
              className="text-link"
              href={config.marketplace.tiktokshop}
              target="_blank"
              rel="noopener noreferrer"
              data-mp="tiktokshop"
            >
              TikTok Shop
            </a>
          </p>
        </div>
        <HeroLogo />
      </div>
    </section>
  );
}
