interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      '"Dikasih saran takaran pupuk dan obat yang pas lewat WhatsApp. Hasil panen cabai saya naik."',
    name: 'Pak Sukardi',
    role: 'Petani hortikultura, Balung',
    avatar: 'PS',
  },
  {
    id: 't2',
    quote:
      '"Barang selalu asli dan segel utuh. Pesanan ke Ambulu sampai dengan cepat."',
    name: 'H. Wahyudi',
    role: 'Ketua kelompok tani, Ambulu',
    avatar: 'HW',
  },
  {
    id: 't3',
    quote:
      '"Saya ambil sprayer dan sparepart untuk dijual lagi. Harganya bersaing dan adminnya cepat membalas."',
    name: 'Bambang Prasetyo',
    role: 'Reseller, Banyuwangi',
    avatar: 'BP',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section section--alt" id="testimoni" aria-labelledby="testiTitle">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id="testiTitle">Kata pelanggan</h2>
          </div>
        </div>

        <div className="quotes">
          {TESTIMONIALS.map((t) => (
            <figure key={t.id} className="quote">
              <blockquote>{t.quote}</blockquote>
              <figcaption className="who">
                <span className="avatar" aria-hidden="true">
                  {t.avatar}
                </span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="note">Contoh testimoni. Akan diganti dengan testimoni asli dari owner.</p>
      </div>
    </section>
  );
}
