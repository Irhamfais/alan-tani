'use client';

import Image from 'next/image';
import { awards } from '@/lib/data';
import { useCarousel } from '@/lib/hooks/useCarousel';

// Client component because the row is draggable; AboutSection itself stays a server component.
export default function AwardsCarousel() {
  const { trackRef, handleKeyDown, dragHandlers } = useCarousel('.award');

  return (
    <div
      className="carousel carousel-drag awards"
      id="awardsCarousel"
      ref={trackRef}
      role="region"
      aria-label="Daftar penghargaan, geser untuk melihat lebih banyak"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...dragHandlers}
    >
      {awards.map((a) => (
        <figure key={a.id} className="award">
          <div className="photo">
            <Image src={a.image} alt={a.alt} fill sizes="300px" quality={75} />
          </div>
          <figcaption>
            <strong>{a.title}</strong>
            <span>
              {a.issuer}
              {a.year && ` · ${a.year}`}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
