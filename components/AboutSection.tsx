import React from 'react';
import Image from 'next/image';
import { Award, MapPin } from 'lucide-react';
import { config } from '@/lib/data';
import type { StoreLocation } from '@/lib/types';

function StorePhoto({ store }: { store: StoreLocation }) {
  return (
    <div className="store-photo">
      <Image
        src={store.photo}
        alt={`Tampak depan ${store.name.toLowerCase()} Alan Tani Jaya`}
        fill
        sizes="(min-width: 720px) 50vw, 100vw"
        quality={75}
      />
    </div>
  );
}

export default function AboutSection() {
  const storeInduk = config.stores[0];
  const storeCabang = config.stores[1];

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
            <StorePhoto store={storeInduk} />
            <figcaption>
              <div>
                <strong>{storeInduk.name}</strong>
                <span>{storeInduk.address}</span>
              </div>
              <a
                className="btn btn-ghost btn-sm"
                href={storeInduk.mapsUrl}
                target="_blank"
                rel="noopener"
              >
                <MapPin size={18} aria-hidden="true" />
                Rute ke toko induk
              </a>
            </figcaption>
          </figure>
          <figure>
            <StorePhoto store={storeCabang} />
            <figcaption>
              <div>
                <strong>{storeCabang.name}</strong>
                <span>{storeCabang.address}</span>
              </div>
              <a
                className="btn btn-ghost btn-sm"
                href={storeCabang.mapsUrl}
                target="_blank"
                rel="noopener"
              >
                <MapPin size={18} aria-hidden="true" />
                Rute ke toko cabang
              </a>
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

export { AboutSection as About };
