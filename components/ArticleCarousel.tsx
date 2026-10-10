'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import articles from '@/data/articles.json';

interface ArticleItem {
  id: string;
  slug: string;
  category: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
}

function ArticleArt({ index }: { index: number }) {
  const bgs = [
    ['#14694B', '#052A1F'],
    ['#0F5A41', '#031A13'],
    ['#1B7A55', '#062B20'],
    ['#0E4A37', '#02120D'],
  ];
  const [a, b] = bgs[index % bgs.length];
  const gradId = `ag${index}`;

  const renderLeaves = () => {
    switch (index % 4) {
      case 0:
        return (
          <>
            <path
              transform="translate(60 170) rotate(-60) scale(1.5)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.85"
            />
            <path
              transform="translate(120 190) rotate(-20) scale(1.2)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.5"
            />
            <path
              transform="translate(230 200) rotate(-120) scale(1.1)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.35"
            />
          </>
        );
      case 1:
        return (
          <>
            <path
              transform="translate(40 120) rotate(-10) scale(1.4)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.5"
            />
            <path
              transform="translate(150 200) rotate(-75) scale(1.6)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.85"
            />
            <path
              transform="translate(260 160) rotate(-150) scale(1.0)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.4"
            />
          </>
        );
      case 2:
        return (
          <>
            <path
              transform="translate(100 190) rotate(-95) scale(1.7)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.85"
            />
            <path
              transform="translate(180 190) rotate(-40) scale(1.2)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.45"
            />
            <path
              transform="translate(60 160) rotate(-150) scale(1.1)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.4"
            />
          </>
        );
      case 3:
      default:
        return (
          <>
            <path
              transform="translate(30 190) rotate(-30) scale(1.3)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.45"
            />
            <path
              transform="translate(170 200) rotate(-100) scale(1.5)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.85"
            />
            <path
              transform="translate(300 170) rotate(-160) scale(1.2)"
              d="M0 0C20-40 70-60 120-40 100 5 50 25 0 0Z"
              fill="#2BD66F"
              opacity="0.5"
            />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 340 190" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="340" height="190" fill={`url(#${gradId})`} />
      {renderLeaves()}
    </svg>
  );
}

export default function ArticleCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleArticleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setToastMsg('Halaman artikel dibuat di versi Next.js.');
    setShowToast(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3500);

    const toastEl = document.getElementById('toast');
    if (toastEl) {
      toastEl.textContent = 'Halaman artikel dibuat di versi Next.js.';
      toastEl.dataset.show = 'true';
      setTimeout(() => {
        toastEl.dataset.show = 'false';
      }, 3500);
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
          {(articles as ArticleItem[]).map((a, i) => (
            <article className="acard" key={a.id}>
              <div className="art">
                <ArticleArt index={i} />
              </div>
              <div className="acard-body">
                <div className="acard-meta">
                  <span>{a.category}</span>
                  <span>{a.date}</span>
                  <span>{a.read}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <a
                  className="stretch"
                  href={`/artikel/${a.slug}`}
                  data-article
                  onClick={handleArticleClick}
                >
                  Baca artikel<span className="sr-only">: {a.title}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        className="toast"
        id="toast"
        role="status"
        aria-live="polite"
        data-show={showToast ? 'true' : 'false'}
      >
        {toastMsg}
      </div>
    </section>
  );
}
