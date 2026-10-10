import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import ArticleCarousel from '@/components/ArticleCarousel';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ProductCatalog />
        <ArticleCarousel />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
