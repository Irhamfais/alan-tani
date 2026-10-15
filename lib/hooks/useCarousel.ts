'use client';

import { useRef } from 'react';

/**
 * Shared behaviour for the horizontal scroll-snap carousels (articles, testimonials):
 * arrow buttons move one card at a time, and ←/→ keys work while the track has focus.
 * `itemSelector` picks a card so the step matches the real card width.
 * `dragHandlers` add click-and-drag scrolling for mouse users (touch and trackpads scroll natively).
 */
export function useCarousel(itemSelector: string, gap = 20) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);

  const slide = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(itemSelector) as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : 340;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({
      left: dir * (cardWidth + gap),
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

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    e.currentTarget.classList.remove('is-dragging'); // re-enables scroll-snap, which settles on a card
  };

  const dragHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      e.preventDefault(); // no text selection while dragging
      dragRef.current = { startX: e.clientX, startScroll: e.currentTarget.scrollLeft };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.classList.add('is-dragging');
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      e.currentTarget.scrollLeft = dragRef.current.startScroll - (e.clientX - dragRef.current.startX);
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };

  return { trackRef, slide, handleKeyDown, dragHandlers };
}
