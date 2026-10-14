'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/types';
import ArticleModal from './ArticleModal';

interface ArticleCarouselProps {
  articles: Article[];
}

export default function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const slide = (dir: number) => {
    if (!carouselRef.current) return;
    const car = carouselRef.current;
    const card = car.querySelector('.acard') as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 340;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    car.scrollBy({
      left: dir * (cardWidth + 20),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      slide(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      slide(-1);
    }
  };

  return (
    <section className="section section--alt" id="artikel" aria-labelledby="artikelTitle">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id="artikelTitle">Tips dan edukasi pertanian</h2>
            <p>Panduan singkat soal pupuk, bibit, dan perawatan tanaman dari tim Alan Tani.</p>
          </div>
          <div className="carousel-nav">
            <button
              className="icon-btn icon-btn--ghost"
              id="prevArticle"
              aria-label="Artikel sebelumnya"
              onClick={() => slide(-1)}
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              className="icon-btn icon-btn--ghost"
              id="nextArticle"
              aria-label="Artikel berikutnya"
              onClick={() => slide(1)}
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className="carousel"
          id="articleCarousel"
          ref={carouselRef}
          role="region"
          aria-label="Daftar artikel, geser untuk melihat lebih banyak"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {articles.map((a) => (
            <article className="acard" key={a.id}>
              <div className="art">
                <div className="photo">
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    sizes="(min-width: 480px) 316px, 78vw"
                    quality={75}
                  />
                </div>
              </div>
              <div className="acard-body">
                <div className="acard-meta">
                  <span>{a.category}</span>
                  <time dateTime={a.publishedDate}>{a.dateLabel}</time>
                </div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <button
                  type="button"
                  className="stretch"
                  data-article={a.slug}
                  onClick={() => setSelectedArticle(a)}
                >
                  Baca artikel<span className="sr-only">: {a.title}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </section>
  );
}
