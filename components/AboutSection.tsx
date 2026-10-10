import React from 'react';
import { Award } from 'lucide-react';
import config from '@/data/config.json';

function Shop1Art() {
  const stripes = [];
  for (let i = 0; i < 12; i++) {
    stripes.push(
      <rect
        key={i}
        x={110 + i * 35}
        y="100"
        width="35"
        height="56"
        fill={i % 2 ? '#EAF6EF' : '#2BD66F'}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label="Ilustrasi sementara Toko Induk Alan Tani"
      xmlns="http://www.w3.org/2000/svg"
      id="shop1"
    >
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E4A37" />
          <stop offset="1" stopColor="#052A1F" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#sg1)" />
      <rect y="330" width="640" height="70" fill="#031A13" />
      <rect x="120" y="150" width="400" height="180" fill="#0F5A41" />
      {stripes}
      <rect x="150" y="190" width="110" height="80" rx="6" fill="#0A3D2D" />
      <rect x="380" y="190" width="110" height="80" rx="6" fill="#0A3D2D" />
      <rect x="290" y="200" width="60" height="130" rx="4" fill="#052A1F" />
      <rect x="230" y="56" width="180" height="36" rx="8" fill="#031A13" />
      <text
        x="320"
        y="81"
        textAnchor="middle"
        fontFamily="Bricolage Grotesque, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="#2BD66F"
      >
        Alan Tani
      </text>
    </svg>
  );
}

function Shop2Art() {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    lines.push(
      <path
        key={i}
        d={`M250 ${198 + i * 22}H390`}
        stroke="#0A3D2D"
        strokeWidth="3"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label="Ilustrasi sementara Toko Cabang Alan Tani"
      xmlns="http://www.w3.org/2000/svg"
      id="shop2"
    >
      <defs>
        <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E4A37" />
          <stop offset="1" stopColor="#052A1F" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#sg2)" />
      <rect y="330" width="640" height="70" fill="#031A13" />
      <rect x="80" y="120" width="480" height="210" fill="#0F5A41" />
      <path d="M70 120L320 70L570 120Z" fill="#0A3D2D" />
      <rect x="230" y="180" width="180" height="150" rx="4" fill="#052A1F" />
      {lines}
      <rect x="104" y="270" width="52" height="60" rx="14" fill="#CFE3D6" />
      <rect x="164" y="282" width="44" height="48" rx="12" fill="#B5D2C2" />
      <rect x="440" y="270" width="52" height="60" rx="14" fill="#CFE3D6" />
      <rect x="498" y="282" width="44" height="48" rx="12" fill="#B5D2C2" />
      <rect x="260" y="96" width="120" height="30" rx="7" fill="#031A13" />
      <text
        x="320"
        y="117"
        textAnchor="middle"
        fontFamily="Bricolage Grotesque, sans-serif"
        fontWeight="700"
        fontSize="17"
        fill="#2BD66F"
      >
        Alan Tani
      </text>
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section className="section" id="tentang" aria-labelledby="tentangTitle">
      <div className="container">
        <div className="about">
          <div className="about-copy">
            <h2 id="tentangTitle">Tentang Alan Tani</h2>
            <p>
              Kami menyediakan berbagai kebutuhan pertanian berkualitas tinggi,
              mulai dari benih unggul, pupuk, pestisida, hingga perlengkapan
              pertanian yang menunjang produktivitas petani.
            </p>
            <p>
              Dengan komitmen pada pelayanan terbaik dan produk berkualitas, Alan
              Tani terus berupaya menjadi mitra utama bagi petani dan pelaku
              agribisnis di seluruh Indonesia. Sebagai R1 Seller, kami menjamin
              keaslian produk, pengiriman cepat, serta pelayanan ramah.
            </p>
          </div>

          <dl className="facts">
            <div className="fact">
              <dt>Berdiri</dt>
              <dd>
                2020<span>Lebih dari 6 tahun melayani petani</span>
              </dd>
            </div>
            <div className="fact">
              <dt>Status</dt>
              <dd>
                R1 Seller<span>Keaslian produk terjamin</span>
              </dd>
            </div>
            <div className="fact">
              <dt>Toko induk</dt>
              <dd>{config.stores.induk.address}</dd>
            </div>
            <div className="fact">
              <dt>Toko cabang</dt>
              <dd>{config.stores.cabang.address}</dd>
            </div>
            <div className="fact">
              <dt>Area layanan</dt>
              <dd>
                Jember<span>Lokal</span>
              </dd>
            </div>
            <div className="fact">
              <dt></dt>
              <dd>
                Jawa Timur<span>Regional</span>
              </dd>
            </div>
            <div className="fact">
              <dt></dt>
              <dd>
                Seluruh Indonesia<span>Nasional, lewat pengiriman</span>
              </dd>
            </div>
            <div className="fact">
              <dt>Belanja online</dt>
              <dd className="fact-links">
                <a
                  className="text-link"
                  href={config.marketplace.shopee}
                  data-mp="shopee"
                  target="_blank"
                  rel="noopener"
                >
                  Shopee
                </a>
                <a
                  className="text-link"
                  href={config.marketplace.tokopedia}
                  data-mp="tokopedia"
                  target="_blank"
                  rel="noopener"
                >
                  Tokopedia
                </a>
                <a
                  className="text-link"
                  href={config.marketplace.tiktokshop}
                  data-mp="tiktokshop"
                  target="_blank"
                  rel="noopener"
                >
                  TikTok Shop
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="gallery" id="galeri">
          <figure>
            <Shop1Art />
            <figcaption>
              <strong>Toko induk</strong>
              <span>Jl. Hoscokro Aminoto, Tanggul Kulon. Foto asli menyusul.</span>
            </figcaption>
          </figure>
          <figure>
            <Shop2Art />
            <figcaption>
              <strong>Toko cabang</strong>
              <span>Jl. Mawar (Pasar Tanggul), Tanggul. Foto asli menyusul.</span>
            </figcaption>
          </figure>
        </div>

        <div className="certs-head">
          <h3>Sertifikasi dan penghargaan</h3>
          <ul className="certs">
            <li className="cert">
              <span className="cert-icon">
                <Award className="w-[26px] h-[26px]" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <div>
                <strong>Sertifikat 1</strong>
                <span>File dari owner menyusul</span>
              </div>
            </li>
            <li className="cert">
              <span className="cert-icon">
                <Award className="w-[26px] h-[26px]" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <div>
                <strong>Sertifikat 2</strong>
                <span>File dari owner menyusul</span>
              </div>
            </li>
            <li className="cert">
              <span className="cert-icon">
                <Award className="w-[26px] h-[26px]" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <div>
                <strong>Penghargaan</strong>
                <span>File dari owner menyusul</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
