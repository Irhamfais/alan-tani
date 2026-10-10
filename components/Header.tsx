'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoAlanTani from '@/public/logo-alan-tani-jaya.png';
import config from '@/data/config.json';
import { waLink } from '@/lib/utils/whatsapp';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const mpRef = useRef<HTMLDetailsElement>(null);

  // Scroll listener for sticky header logo shrink (.is-scrolled)
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver to highlight current section in navigation
  useEffect(() => {
    const sections = ['home', 'produk', 'artikel', 'tentang', 'testimoni', 'kontak'];
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id === 'testimoni' ? 'tentang' : entry.target.id;
            setActiveSection(id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close dropdown on click outside & Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mpRef.current && mpRef.current.open && !mpRef.current.contains(e.target as Node)) {
        mpRef.current.open = false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        if (mpRef.current) mpRef.current.open = false;
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleWaClick = () => {
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer) {
      (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
        event: 'whatsapp_click',
        location: 'header',
      });
    }
  };

  return (
    <header
      className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}
      id="siteHeader"
      data-open={isMobileMenuOpen ? 'true' : 'false'}
    >
      <div className="container bar">
        <Link href="#home" className="brand" aria-label="Beranda Alan Tani Jaya" onClick={() => handleNavClick('home')}>
          <Image
            src={logoAlanTani}
            alt="Alan Tani Jaya"
            className="logo"
            priority
          />
        </Link>

        <nav className="nav" id="primaryNav" aria-label="Navigasi utama">
          <a
            href="#home"
            className="nav-link"
            aria-current={activeSection === 'home' ? 'true' : undefined}
            onClick={() => handleNavClick('home')}
          >
            Home
          </a>
          <a
            href="#produk"
            className="nav-link"
            aria-current={activeSection === 'produk' ? 'true' : undefined}
            onClick={() => handleNavClick('produk')}
          >
            Produk
          </a>
          <a
            href="#artikel"
            className="nav-link"
            aria-current={activeSection === 'artikel' ? 'true' : undefined}
            onClick={() => handleNavClick('artikel')}
          >
            Artikel
          </a>
          <a
            href="#tentang"
            className="nav-link"
            aria-current={activeSection === 'tentang' ? 'true' : undefined}
            onClick={() => handleNavClick('tentang')}
          >
            Tentang Kami
          </a>
          <a
            href="#kontak"
            className="nav-link"
            aria-current={activeSection === 'kontak' ? 'true' : undefined}
            onClick={() => handleNavClick('kontak')}
          >
            Kontak
          </a>

          {/* Desktop Marketplace Dropdown */}
          <details className="mp" id="mpMenu" ref={mpRef}>
            <summary className="nav-link">
              Beli online{' '}
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="mp-menu">
              <a href={config.marketplace.shopee} target="_blank" rel="noopener noreferrer">
                Shopee
              </a>
              <a href={config.marketplace.tokopedia} target="_blank" rel="noopener noreferrer">
                Tokopedia
              </a>
              <a href={config.marketplace.tiktokshop} target="_blank" rel="noopener noreferrer">
                TikTok Shop
              </a>
            </div>
          </details>

          {/* Mobile Marketplace Links */}
          <div className="nav-mp">
            <p>Belanja online di marketplace kami:</p>
            <a href={config.marketplace.shopee} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
              Shopee
            </a>
            <a href={config.marketplace.tokopedia} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
              Tokopedia
            </a>
            <a href={config.marketplace.tiktokshop} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
              TikTok Shop
            </a>
          </div>
        </nav>

        <div className="header-actions">
          <a
            className="btn btn-primary btn-sm"
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-wa
            data-wa-loc="header"
            id="headerWa"
            aria-label="Chat WhatsApp"
            onClick={handleWaClick}
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="wa-label">WhatsApp</span>
          </a>

          <button
            className="icon-btn icon-btn--ghost menu-btn"
            id="menuBtn"
            aria-expanded={isMobileMenuOpen}
            aria-controls="primaryNav"
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="i-open" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className="i-close" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
