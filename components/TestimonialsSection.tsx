'use client';

import { config, testimonials, testimonialSummary } from '@/lib/data';
import { formatDateId } from '@/lib/utils/format';
import { useCarousel } from '@/lib/hooks/useCarousel';

function Stars({ rating, scale = 5 }: { rating: number; scale?: number }) {
  return (
    <span className="stars" role="img" aria-label={`Rating ${rating} dari ${scale}`}>
      {Array.from({ length: scale }, (_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          width="16"
          height="16"
          data-on={i < Math.round(rating) ? 'true' : 'false'}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

export default function TestimonialsSection() {
  // No arrow buttons: swipe/trackpad scroll natively, mouse users drag, keyboard users use ←/→.
  const { trackRef, handleKeyDown, dragHandlers } = useCarousel('.quote');
  const s = testimonialSummary;
  const ratingLabel = s.rating.toLocaleString('id-ID', { minimumFractionDigits: 1 });

  return (
    <section className="section section--alt" id="testimoni" aria-labelledby="testiTitle">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id="testiTitle">Kata pelanggan</h2>
            <p>Ulasan asli pembeli Alan Tani Jaya di {s.platform}.</p>
            <div className="rating-summary">
              <Stars rating={s.rating} scale={s.ratingScale} />
              <span>
                <strong>{ratingLabel} dari {s.ratingScale}</strong> · {s.reviewCountLabel} di {s.platform}
              </span>
              <a
                className="text-link"
                href={config.marketplace.shopee}
                target="_blank"
                rel="noopener noreferrer"
                data-mp="shopee"
              >
                Lihat semua ulasan<span className="sr-only"> di {s.platform}</span>
              </a>
            </div>
          </div>
        </div>

        <div
          className="carousel carousel-drag quotes"
          id="testiCarousel"
          ref={trackRef}
          role="region"
          aria-label="Testimoni pelanggan, geser untuk melihat lebih banyak"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          {...dragHandlers}
        >
          {testimonials.map((t) => (
            <figure key={t.id} className="quote">
              <Stars rating={t.rating} />
              <blockquote>{t.text}</blockquote>
              {t.product && <p className="quote-product">{t.product}</p>}
              <figcaption className="who">
                <span className="avatar" aria-hidden="true">
                  {t.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong>{t.name}</strong>
                  <span>
                    {t.source}
                    {t.date && (
                      <>
                        {' · '}
                        <time dateTime={t.date}>{formatDateId(t.date)}</time>
                      </>
                    )}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
