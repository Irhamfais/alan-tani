'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

const CONFIG = {
  waNumber: "6285875613333",
  waDisplay: "+62 858-7561-3333",
  marketplace: {
    shopee: "https://shopee.co.id/",
    tokopedia: "https://www.tokopedia.com/",
    tiktokshop: "https://www.tiktok.com/"
  }
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoHeight = isScrolled ? 'h-[62px]' : 'h-[84px] md:h-[100px]';

  return (
    <header
      className={`site-header sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-[rgba(3,26,19,0.84)]' : 'bg-[rgba(3,26,19,0.84)]'
      } backdrop-blur-[14px]`}
      data-open={isMobileMenuOpen}
    >
      <div className="container mx-auto">
        <div className="bar flex items-center gap-4 min-h-[76px] py-[0.35rem]">
          {/* Logo */}
          <Link href="#home" className="brand inline-flex items-center min-h-[44px]" aria-label="Beranda Alan Tani Jaya">
            <Image
              src="/logo-alan-tani-jaya.png"
              alt="Alan Tani Jaya"
              width={100}
              height={100}
              className={`logo w-auto flex-none transition-all duration-300 ${logoHeight}`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav ml-auto hidden md:flex gap-1" aria-label="Navigasi utama">
            <Link
              href="#home"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
            >
              Home
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
            >
              Produk
            </Link>
            <Link
              href="#artikel"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
            >
              Artikel
            </Link>
            <Link
              href="#tentang"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
            >
              Tentang Kami
            </Link>
            <Link
              href="#kontak"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
            >
              Kontak
            </Link>
          </nav>

          {/* Desktop Marketplace Dropdown */}
          <details className="mp relative hidden md:block">
            <summary className="list-none inline-flex items-center gap-[0.35rem] min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium cursor-pointer transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]">
              Beli online
              <ChevronDown className="w-4 h-4 transition-transform" />
            </summary>
            <div className="mp-menu absolute right-0 top-[calc(100%+0.5rem)] min-w-[200px] bg-[var(--surface)] rounded-2xl p-2 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]">
              <a
                href={CONFIG.marketplace.shopee}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center min-h-[44px] px-[0.9rem] py-2 rounded-[10px] transition-all hover:bg-[var(--surface-hi)] hover:text-[var(--accent)]"
              >
                Shopee
              </a>
              <a
                href={CONFIG.marketplace.tokopedia}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center min-h-[44px] px-[0.9rem] py-2 rounded-[10px] transition-all hover:bg-[var(--surface-hi)] hover:text-[var(--accent)]"
              >
                Tokopedia
              </a>
              <a
                href={CONFIG.marketplace.tiktokshop}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center min-h-[44px] px-[0.9rem] py-2 rounded-[10px] transition-all hover:bg-[var(--surface-hi)] hover:text-[var(--accent)]"
              >
                TikTok Shop
              </a>
            </div>
          </details>

          {/* Header Actions */}
          <div className="header-actions ml-auto md:ml-0 flex items-center gap-2">
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${CONFIG.waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn--wa w-11 h-11 rounded-full grid place-items-center flex-none bg-[var(--accent)] text-[var(--on-accent)] transition-all hover:bg-[var(--accent-hi)]"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>
            <span className="wa-label hidden sm:inline text-[var(--text-2)] text-sm">{CONFIG.waDisplay}</span>

            {/* Mobile Menu Button */}
            <button
              className="menu-btn grid place-items-center w-11 h-11 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="nav flex flex-col md:hidden bg-[var(--bg)] px-5 pb-6 pt-2" aria-label="Navigasi mobile">
            <Link
              href="#home"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produk
            </Link>
            <Link
              href="#artikel"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Artikel
            </Link>
            <Link
              href="#tentang"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="#kontak"
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>

            {/* Mobile Marketplace Section */}
            <div className="nav-mp mt-4 pt-4 border-t border-[var(--line)]">
              <p className="text-[var(--text-3)] text-sm px-4 mb-2">Belanja di marketplace:</p>
              <a
                href={CONFIG.marketplace.shopee}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              >
                Shopee
              </a>
              <a
                href={CONFIG.marketplace.tokopedia}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              >
                Tokopedia
              </a>
              <a
                href={CONFIG.marketplace.tiktokshop}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-[var(--text-2)] font-medium transition-all hover:text-[var(--text)] hover:bg-[rgba(234,246,239,0.08)]"
              >
                TikTok Shop
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
