import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Image Placeholder */}
            <div className="relative">
              <div className="bg-green-800 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-green-200">Hero Image Placeholder</p>
              </div>
            </div>
            
            {/* Right: Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Solusi Pertanian Modern untuk Hasil Maksimal
              </h1>
              <p className="text-xl mb-8 text-green-50">
                Menyediakan produk berkualitas tinggi untuk mendukung kesuksesan usaha pertanian dan perikanan Anda
              </p>
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#products" 
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition"
                >
                  Lihat Produk
                </Link>
                <a 
                  href="https://wa.me/6285875613333?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Mengapa Memilih Alan Tani?
            </h2>
            <p className="text-lg text-gray-600">
              Komitmen kami untuk memberikan yang terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Produk Berkualitas', desc: 'Produk terpilih dengan standar kualitas tinggi', icon: '🌱' },
              { title: 'Harga Terjangkau', desc: 'Harga kompetitif untuk semua kalangan', icon: '💰' },
              { title: 'Pengiriman Cepat', desc: 'Layanan pengiriman cepat ke seluruh Indonesia', icon: '🚚' },
              { title: 'Konsultasi Gratis', desc: 'Tim ahli siap membantu kebutuhan Anda', icon: '💬' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Produk Unggulan Kami
            </h2>
            <p className="text-lg text-gray-600">
              Pilihan terbaik untuk kebutuhan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product cards will be dynamically loaded */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                <div className="relative overflow-hidden">
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-gray-400">Product Image {item}</span>
                  </div>
                  {/* Badge Best Seller */}
                  {item <= 3 && (
                    <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-600 uppercase">Kategori</span>
                    <span className="text-sm text-gray-500">Premium</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Produk {item}</h3>
                  <p className="text-gray-600 mb-4">Deskripsi produk singkat akan muncul di sini</p>
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="artikel" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Tips dan Edukasi Pertanian
              </h2>
              <p className="text-lg text-gray-600">
                Panduan singkat soal pupuk, bibit, dan perawatan tanaman dari tim Alan Tani.
              </p>
            </div>
          </div>

          {/* Horizontal Scroll Articles */}
          <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
            {[
              { title: 'Cara memilih pupuk yang tepat', category: 'Pupuk', date: '5 Okt 2026', read: '4 menit baca', excerpt: 'Kenali perbedaan pupuk majemuk, tunggal, dan organik, lalu sesuaikan dengan fase tanam dan jenis tanaman Anda.' },
              { title: 'Tips budidaya tanaman agar produktif', category: 'Budidaya', date: '4 Okt 2026', read: '5 menit baca', excerpt: 'Dari persiapan lahan sampai panen: kebiasaan sederhana yang membantu hasil tanam lebih maksimal.' },
              { title: 'Panduan penggunaan pestisida yang aman', category: 'Pestisida', date: '3 Okt 2026', read: '5 menit baca', excerpt: 'Baca label, takar dosis dengan benar, dan lindungi diri saat menyemprot. Panduan singkat untuk petani.' },
            ].map((article, idx) => (
              <div key={idx} className="flex-none w-80 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition snap-start">
                <div className="h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <span className="text-white text-6xl">📖</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="font-semibold text-green-600">{article.category}</span>
                    <span>{article.date}</span>
                    <span>{article.read}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <Link href="#" className="text-green-600 font-semibold hover:text-green-700">
                    Baca artikel →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: About Copy */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Tentang Alan Tani
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Kami menyediakan berbagai kebutuhan pertanian berkualitas tinggi, mulai dari benih unggul, pupuk, pestisida, hingga perlengkapan pertanian yang menunjang produktivitas petani.
              </p>
              <p className="text-lg text-gray-600">
                Dengan komitmen pada pelayanan terbaik dan produk berkualitas, Alan Tani terus berupaya menjadi mitra utama bagi petani dan pelaku agribisnis di seluruh Indonesia. Sebagai R1 Seller, kami menjamin keaslian produk, pengiriman cepat, serta pelayanan ramah.
              </p>
            </div>

            {/* Right: Facts */}
            <div className="space-y-6">
              <div className="border-t border-gray-200 pt-4">
                <dt className="text-gray-500 mb-2">Berdiri</dt>
                <dd className="text-lg font-semibold text-gray-800">2020 <span className="block text-base font-normal text-gray-600">Lebih dari 6 tahun melayani petani</span></dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="text-gray-500 mb-2">Status</dt>
                <dd className="text-lg font-semibold text-gray-800">R1 Seller <span className="block text-base font-normal text-gray-600">Keaslian produk terjamin</span></dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="text-gray-500 mb-2">Toko Induk</dt>
                <dd className="text-lg font-semibold text-gray-800">Jl. Hoscokro Aminoto, Tanggul Kulon, Kec. Tanggul, Kab. Jember</dd>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dt className="text-gray-500 mb-2">Toko Cabang</dt>
                <dd className="text-lg font-semibold text-gray-800">Jl. Mawar (Pasar Tanggul), Tanggul, Jember, Jawa Timur</dd>
              </div>
              <div className="border-t border-b border-gray-200 py-4">
                <dt className="text-gray-500 mb-2">Area Layanan</dt>
                <dd className="text-lg font-semibold text-gray-800">
                  Jember, Jawa Timur, dan Seluruh Indonesia
                </dd>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-400">Foto Toko Induk</span>
              </div>
              <div className="mt-4">
                <strong className="block text-lg font-semibold text-gray-800">Toko Induk</strong>
                <span className="text-gray-600">Jl. Hoscokro Aminoto, Tanggul Kulon. Foto asli menyusul.</span>
              </div>
            </div>
            <div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-400">Foto Toko Cabang</span>
              </div>
              <div className="mt-4">
                <strong className="block text-lg font-semibold text-gray-800">Toko Cabang</strong>
                <span className="text-gray-600">Jl. Mawar (Pasar Tanggul), Tanggul. Foto asli menyusul.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimoni" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Kata Pelanggan
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Pak Sukardi', role: 'Petani hortikultura, Balung', testimonial: 'Dikasih saran takaran pupuk dan obat yang pas lewat WhatsApp. Hasil panen cabai saya naik.', avatar: 'PS' },
              { name: 'H. Wahyudi', role: 'Ketua kelompok tani, Ambulu', testimonial: 'Barang selalu asli dan segel utuh. Pesanan ke Ambulu sampai dengan cepat.', avatar: 'HW' },
              { name: 'Bambang Prasetyo', role: 'Reseller, Banyuwangi', testimonial: 'Saya ambil sprayer dan sparepart untuk dijual lagi. Harganya bersaing dan adminnya cepat membalas.', avatar: 'BP' },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md">
                <blockquote className="text-gray-700 mb-6 text-lg italic">
                  "{testimonial.testimonial}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <strong className="block font-semibold text-gray-800">{testimonial.name}</strong>
                    <span className="text-sm text-gray-500">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            Contoh testimoni. Akan diganti dengan testimoni asli dari owner.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Map Placeholders */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                Lokasi Kami
              </h2>
              
              {/* Toko Induk Map */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Toko Induk</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                  <span className="text-gray-400">Google Maps Embed - Toko Induk</span>
                </div>
                <a 
                  href="https://share.google/os4Ak9UN3mJQ9AGzL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  📍 Buka di Google Maps →
                </a>
              </div>

              {/* Toko Cabang Map */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Toko Cabang</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
                  <span className="text-gray-400">Google Maps Embed - Toko Cabang</span>
                </div>
                <a 
                  href="https://share.google/1ZGzgLxBJCIZ7WLDJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  📍 Buka di Google Maps →
                </a>
              </div>
            </div>

            {/* Right: Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                Ada Pertanyaan? Hubungi Kami
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-green-600 text-2xl">📍</div>
                  <div>
                    <strong className="block font-semibold text-gray-800 mb-1">Toko Induk</strong>
                    <span className="text-gray-600">Jl. Hoscokro Aminoto, Tanggul Kulon, Kec. Tanggul, Kab. Jember</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-green-600 text-2xl">📍</div>
                  <div>
                    <strong className="block font-semibold text-gray-800 mb-1">Toko Cabang</strong>
                    <span className="text-gray-600">Jl. Mawar (Pasar Tanggul), Tanggul, Jember, Jawa Timur</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-green-600 text-2xl">🕐</div>
                  <div>
                    <strong className="block font-semibold text-gray-800 mb-1">Jam Operasional</strong>
                    <span className="text-gray-600">Senin sampai Minggu, 07.00 sampai 16.00 WIB</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-green-600 text-2xl">💬</div>
                  <div>
                    <strong className="block font-semibold text-gray-800 mb-1">WhatsApp</strong>
                    <a 
                      href="https://wa.me/6285875613333?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      +62 858-7561-3333
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-green-600 text-2xl">📧</div>
                  <div>
                    <strong className="block font-semibold text-gray-800 mb-1">Email</strong>
                    <a 
                      href="mailto:alantanijaya@gmail.com"
                      className="text-green-600 hover:text-green-700"
                    >
                      alantanijaya@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="https://wa.me/6285875613333?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Berbelanja?
          </h2>
          <p className="text-xl mb-8">
            Hubungi kami sekarang untuk konsultasi gratis
          </p>
          <a
            href="https://wa.me/6285875613333?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Hubungi via WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
