import Link from 'next/link';
import Image from 'next/image';

const CONFIG = {
  waNumber: "6285875613333",
  waDisplay: "+62 858-7561-3333",
  email: "alantanijaya@gmail.com",
  marketplace: {
    shopee: "https://shopee.co.id/",
    tokopedia: "https://www.tokopedia.com/",
    tiktokshop: "https://www.tiktok.com/"
  },
  social: {
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/"
  },
  maps: {
    induk: "https://share.google/os4Ak9UN3mJQ9AGzL",
    cabang: "https://share.google/1ZGzgLxBJCIZ7WLDJ"
  }
};

export default function Footer() {
  return (
    <footer className="site-footer bg-[var(--bg-deep)] py-16 md:py-24 text-[var(--text-2)]">
      <div className="container mx-auto px-5">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="footer-brand">
            <Image
              src="/logo-alan-tani-jaya.png"
              alt="Alan Tani Jaya"
              width={150}
              height={150}
              className="logo h-[150px] w-auto mb-4"
            />
            <p className="mt-4 max-w-[36ch]">
              Menyediakan produk pertanian berkualitas untuk mendukung kesuksesan petani Indonesia. R1 Seller terpercaya di Jember.
            </p>
          </div>

          {/* Halaman Column */}
          <div>
            <h3 className="text-base text-[var(--text)] mb-3 font-semibold">Halaman</h3>
            <ul>
              <li className="py-[0.3rem]">
                <Link href="#home" className="inline-block transition-colors hover:text-[var(--accent)]">
                  Home
                </Link>
              </li>
              <li className="py-[0.3rem]">
                <Link href="#products" className="inline-block transition-colors hover:text-[var(--accent)]">
                  Produk
                </Link>
              </li>
              <li className="py-[0.3rem]">
                <Link href="#artikel" className="inline-block transition-colors hover:text-[var(--accent)]">
                  Artikel
                </Link>
              </li>
              <li className="py-[0.3rem]">
                <Link href="#tentang" className="inline-block transition-colors hover:text-[var(--accent)]">
                  Tentang Kami
                </Link>
              </li>
              <li className="py-[0.3rem]">
                <Link href="#kontak" className="inline-block transition-colors hover:text-[var(--accent)]">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak Column */}
          <div>
            <h3 className="text-base text-[var(--text)] mb-3 font-semibold">Kontak</h3>
            <ul>
              <li className="py-[0.3rem]">
                <a 
                  href={`https://wa.me/${CONFIG.waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  WA: {CONFIG.waDisplay}
                </a>
              </li>
              <li className="py-[0.3rem]">
                <a 
                  href={`mailto:${CONFIG.email}`}
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  {CONFIG.email}
                </a>
              </li>
              <li className="py-[0.3rem]">
                <a 
                  href={CONFIG.maps.induk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  Toko Induk: Tanggul Kulon
                </a>
              </li>
              <li className="py-[0.3rem]">
                <a 
                  href={CONFIG.maps.cabang}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  Toko Cabang: Pasar Tanggul
                </a>
              </li>
            </ul>
          </div>

          {/* Marketplace dan Sosial Column */}
          <div>
            <h3 className="text-base text-[var(--text)] mb-3 font-semibold">Marketplace dan sosial</h3>
            <ul>
              <li className="py-[0.3rem]">
                <a 
                  href={CONFIG.marketplace.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  Shopee
                </a>
              </li>
              <li className="py-[0.3rem]">
                <a 
                  href={CONFIG.marketplace.tokopedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  Tokopedia
                </a>
              </li>
              <li className="py-[0.3rem]">
                <a 
                  href={CONFIG.marketplace.tiktokshop}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  TikTok Shop
                </a>
              </li>
              <li className="py-[0.3rem]">
                <a 
                  href={CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  Facebook
                </a>
              </li>
              <li className="py-[0.3rem]">
                <a 
                  href={CONFIG.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-[var(--accent)]"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright mt-12 pt-6 border-t border-[var(--line)] text-sm text-[var(--text-3)]">
          <p>&copy; {new Date().getFullYear()} Alan Tani Jaya. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  );
}
