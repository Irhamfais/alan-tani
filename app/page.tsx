import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import ArticleCarousel from '@/components/ArticleCarousel';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ProductCatalog />
        <ArticleCarousel />

        {/* Anchor targets for intersection observer and navigation until upcoming sections are implemented */}
        <div id="tentang" style={{ minHeight: '30vh' }} />
        <div id="testimoni" style={{ minHeight: '30vh' }} />
        <div id="kontak" style={{ minHeight: '30vh' }} />
      </main>
    </>
  );
}
