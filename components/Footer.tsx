import Image from 'next/image';
import Link from 'next/link';
import logoAlanTani from '@/public/logo-alan-tani-jaya.png';
import { config } from '@/lib/data';

export default function Footer() {
  const waUrl = `https://wa.me/${config.waNumber}?text=${encodeURIComponent(
    'Halo, saya ingin bertanya tentang produk pertanian'
  )}`;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Kolom 1: Brand & Logo */}
          <div className="footer-brand">
            <Link className="brand" href="#home" aria-label="Beranda Alan Tani Jaya">
              <Image
                className="logo"
                src={logoAlanTani}
                alt="Alan Tani Jaya, Pertanian"
                style={{ height: '150px', width: 'auto' }}
              />
            </Link>
            <p>
              Solusi Terbaik Petani. R1 Seller dengan keaslian produk terjamin, pengiriman cepat, dan pelayanan ramah.
            </p>
          </div>

          {/* Kolom 2: Halaman */}
          <div>
            <h3>Halaman</h3>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#produk">Produk</a>
              </li>
              <li>
                <a href="#artikel">Artikel</a>
              </li>
              <li>
                <a href="#tentang">Tentang Kami</a>
              </li>
              <li>
                <a href="#kontak">Kontak</a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3>Kontak</h3>
            <ul>
              <li>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Toko induk:</strong>{' '}
                {config.stores[0].address}
              </li>
              <li>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Toko cabang:</strong>{' '}
                {config.stores[1].address}
              </li>
              <li>{config.operatingHours}</li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener" data-wa data-wa-loc="footer">
                  Chat WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${config.email}`} data-email>
                  {config.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Marketplace dan sosial */}
          <div>
            <h3>Marketplace dan sosial</h3>
            <ul>
              <li>
                <a href={config.marketplace.shopee} target="_blank" rel="noopener" data-mp="shopee">
                  Shopee
                </a>
              </li>
              <li>
                <a href={config.marketplace.tokopedia} target="_blank" rel="noopener" data-mp="tokopedia">
                  Tokopedia
                </a>
              </li>
              <li>
                <a href={config.marketplace.tiktokshop} target="_blank" rel="noopener" data-mp="tiktokshop">
                  TikTok Shop
                </a>
              </li>
              <li>
                <a href={config.social.facebook} target="_blank" rel="noopener" data-social="facebook">
                  Facebook
                </a>
              </li>
              <li>
                <a href={config.social.tiktok} target="_blank" rel="noopener" data-social="tiktok">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="copyright">&copy; 2026 Alan Tani</p>
      </div>
    </footer>
  );
}
