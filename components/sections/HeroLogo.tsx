'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import logoHero from '@/public/brand/logo-hero.png';

export default function HeroLogo() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;

    const section = el.closest('section');
    if (!section) return;

    // a) IntersectionObserver on closest section: toggle class "is-offscreen"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.remove('is-offscreen');
        } else {
          section.classList.add('is-offscreen');
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(section);

    // b) Check hover capability and reduced motion preference
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canHover || prefersReducedMotion) {
      return () => {
        observer.disconnect();
      };
    }

    // c) Pointermove and rAF loop with easing
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let rafId: number | null = null;
    let isRunning = false;

    const update = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${cx * 26}px, ${cy * 16}px, 0) rotateX(${-cy * 8}deg) rotateY(${cx * 10}deg)`;
      }

      if (Math.abs(tx - cx) >= 0.002 || Math.abs(ty - cy) >= 0.002) {
        rafId = requestAnimationFrame(update);
      } else {
        if (tx === 0 && ty === 0) {
          cx = 0;
          cy = 0;
          if (parallaxRef.current) {
            parallaxRef.current.style.transform = 'translate3d(0px, 0px, 0) rotateX(0deg) rotateY(0deg)';
          }
        }
        isRunning = false;
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      startLoop();
    };

    const handlePointerLeave = () => {
      tx = 0;
      ty = 0;
      startLoop();
    };

    section.addEventListener('pointermove', handlePointerMove);
    section.addEventListener('pointerleave', handlePointerLeave);

    // e) Cleanup
    return () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className="hero-art" aria-hidden="true">
      <div className="parallax" ref={parallaxRef}>
        <div className="bob">
          <Image
            src={logoHero}
            alt=""
            sizes="300px"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
