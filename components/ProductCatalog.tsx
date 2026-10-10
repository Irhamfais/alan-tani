'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import productsData from '@/data/products.json';
import config from '@/data/config.json';
import ProductArt from './ProductArt';
import ProductModal from './ProductModal';
import formatRupiah from '@/lib/utils/format';
import { waLink } from '@/lib/utils/whatsapp';
import { CATEGORIES } from '@/lib/data';

const products = productsData as unknown as Product[];

const FILTER_CATEGORIES = [
  { key: 'all', label: 'Semua' },
  { key: 'pupuk', label: 'Pupuk' },
  { key: 'bibit', label: 'Bibit' },
  { key: 'pestisida', label: 'Pestisida' },
  { key: 'alat-pertanian', label: 'Alat Pertanian' },
] as const;

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="section" id="produk" aria-labelledby="produkTitle">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id="produkTitle">Produk unggulan</h2>
            <p>Pilihan yang paling sering dicari petani. Daftar lengkapnya ada di marketplace kami.</p>
          </div>
        </div>

        <div className="chips" id="filters" role="group" aria-label="Filter kategori produk">
          {FILTER_CATEGORIES.map(({ key, label }) => {
            const count =
              key === 'all'
                ? products.length
                : products.filter((p) => p.category === key).length;
            const isPressed = activeCategory === key;
            return (
              <button
                key={key}
                type="button"
                className="chip"
                data-cat={key}
                aria-pressed={isPressed}
                onClick={() => setActiveCategory(key)}
              >
                {label}
                <small>{count}</small>
              </button>
            );
          })}
        </div>

        <p className="sr-only" id="resultCount" aria-live="polite">
          {filteredProducts.length} produk ditampilkan
        </p>

        <div className="grid-products" id="productGrid">
          {filteredProducts.map((p) => (
            <article className="pcard" key={p.id}>
              {p.isBestSeller && <span className="badge">Best seller</span>}
              <div className="art">
                <ProductArt product={p} />
              </div>
              <div className="pcard-body">
                <p className="pcard-cat">{CATEGORIES[p.category]}</p>
                <h3>
                  <button
                    type="button"
                    className="stretch"
                    data-detail={p.id}
                    onClick={() => setSelectedProduct(p)}
                  >
                    {p.name}
                  </button>
                </h3>
                <div className="pcard-foot">
                  <p className="price">{formatRupiah(p.price)}</p>
                  <a
                    className="icon-btn icon-btn--wa"
                    href={waLink(p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa
                    data-wa-loc="produk-kartu"
                    aria-label={`Tanya ${p.name} lewat WhatsApp`}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="more">
          <p>Mau lihat produk lainnya? Buka toko kami di:</p>
          <div className="more-links">
            <a
              className="btn btn-ghost btn-sm"
              href={config.marketplace.shopee}
              data-mp="shopee"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shopee
            </a>
            <a
              className="btn btn-ghost btn-sm"
              href={config.marketplace.tokopedia}
              data-mp="tokopedia"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tokopedia
            </a>
            <a
              className="btn btn-ghost btn-sm"
              href={config.marketplace.tiktokshop}
              data-mp="tiktokshop"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok Shop
            </a>
          </div>
        </div>
        <p className="note">
          Ilustrasi produk bersifat sementara. Foto asli dari owner dipasang saat implementasi.
        </p>

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}
