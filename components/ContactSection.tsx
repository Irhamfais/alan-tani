import { MapPin, Clock, MessageCircle, Mail, Users, Truck } from 'lucide-react';
import { config } from '@/lib/data';

export default function ContactSection() {
  const waUrl = `https://wa.me/${config.waNumber}?text=${encodeURIComponent(
    'Halo, saya ingin bertanya tentang produk pertanian'
  )}`;

  return (
    <section className="section" id="kontak" aria-labelledby="kontakTitle">
      <div className="container contact">
        <div className="map">
          <svg
            viewBox="0 0 640 420"
            role="img"
            aria-label="Ilustrasi peta lokasi Alan Tani di Tanggul, Jember"
            xmlns="http://www.w3.org/2000/svg"
            id="mapArt"
          >
            <defs>
              <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#0E4A37" />
                <stop offset="1" stopColor="#0A3D2D" />
              </linearGradient>
            </defs>
            <rect width="640" height="420" fill="url(#mg)" />
            <g fill="none" stroke="#0F5A41" strokeLinecap="round">
              <path d="M-10 300C120 270 200 210 330 210S520 120 660 100" strokeWidth="16" />
              <path d="M200 -10C220 90 300 130 330 210S380 360 360 430" strokeWidth="12" />
              <path d="M-10 120C100 130 180 90 260 40" strokeWidth="8" />
              <path d="M420 430C450 330 540 290 660 300" strokeWidth="8" />
            </g>
            <g fill="none" stroke="#14694B" strokeWidth="2">
              <path d="M0 60H640M0 180H640M0 340H640M100 0V420M460 0V420" />
            </g>
            <path
              d="M330 150a26 26 0 0 1 26 26c0 26-26 56-26 56s-26-30-26-56a26 26 0 0 1 26-26Z"
              fill="#2BD66F"
            />
            <circle cx="330" cy="176" r="9" fill="#03180F" />
            <text
              x="330"
              y="262"
              textAnchor="middle"
              fontFamily="var(--font-display, 'Bricolage Grotesque', sans-serif)"
              fontWeight="600"
              fontSize="20"
              fill="#EAF6EF"
            >
              Tanggul
            </text>
          </svg>
          <div className="stores">
            <a
              className="btn btn-ghost btn-sm"
              href={config.stores.induk.mapUrl}
              target="_blank"
              rel="noopener"
            >
              <MapPin className="w-[18px] h-[18px]" aria-hidden="true" />
              Rute ke toko induk
            </a>
            <a
              className="btn btn-ghost btn-sm"
              href={config.stores.cabang.mapUrl}
              target="_blank"
              rel="noopener"
            >
              <MapPin className="w-[18px] h-[18px]" aria-hidden="true" />
              Rute ke toko cabang
            </a>
          </div>
          <p className="note">Peta di atas ilustrasi. Embed Google Maps dipasang saat implementasi.</p>
        </div>

        <div>
          <h2 id="kontakTitle">Ada pertanyaan? Hubungi kami</h2>
          <div className="rows">
            <div className="row">
              <MapPin aria-hidden="true" />
              <div>
                <strong>Toko induk</strong>
                <span>{config.stores.induk.address}</span>
              </div>
            </div>
            <div className="row">
              <MapPin aria-hidden="true" />
              <div>
                <strong>Toko cabang</strong>
                <span>{config.stores.cabang.address}</span>
              </div>
            </div>
            <div className="row">
              <Clock aria-hidden="true" />
              <div>
                <strong>Jam operasional</strong>
                <span>{config.operatingHours}</span>
              </div>
            </div>
            <div className="row">
              <MessageCircle aria-hidden="true" />
              <div>
                <strong>WhatsApp</strong>
                <a
                  className="text-link"
                  href={waUrl}
                  target="_blank"
                  rel="noopener"
                  id="waDisplay"
                >
                  {config.waDisplay}
                </a>
              </div>
            </div>
            <div className="row">
              <Mail aria-hidden="true" />
              <div>
                <strong>Email</strong>
                <a className="text-link" href={`mailto:${config.email}`}>
                  {config.email}
                </a>
              </div>
            </div>
            <div className="row">
              <Users aria-hidden="true" />
              <div>
                <strong>Media sosial</strong>
                <span>
                  <a
                    className="text-link"
                    href={config.social.facebook}
                    target="_blank"
                    rel="noopener"
                  >
                    Facebook: Alan Tani Jaya
                  </a>
                </span>
                <span>
                  <a
                    className="text-link"
                    href={config.social.tiktok}
                    target="_blank"
                    rel="noopener"
                  >
                    TikTok: Alan Tani Jaya
                  </a>
                </span>
              </div>
            </div>
            <div className="row">
              <Truck aria-hidden="true" />
              <div>
                <strong>Pengiriman</strong>
                <span>Jember, Jawa Timur, dan seluruh Indonesia.</span>
              </div>
            </div>
          </div>
          <div className="contact-cta">
            <a
              className="btn btn-primary"
              href={waUrl}
              target="_blank"
              rel="noopener"
            >
              <MessageCircle aria-hidden="true" />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
