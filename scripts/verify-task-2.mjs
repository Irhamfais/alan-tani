import assert from 'node:assert';
import config from '../data/config.json' with { type: 'json' };
import products from '../data/products.json' with { type: 'json' };
import articles from '../data/articles.json' with { type: 'json' };

console.log('Testing Task 2 Data and Utilities...');

// 1. Verify Config
assert.strictEqual(config.storeName, 'Alan Tani Jaya');
assert.strictEqual(config.tagline, 'Solusi Terbaik Petani');
assert.strictEqual(config.waNumber, '6285875613333');
assert.strictEqual(config.waDisplay, '+62 858-7561-3333');
assert.strictEqual(config.email, 'alantanijaya@gmail.com');
assert.strictEqual(config.stores.induk.name, 'Toko Induk');
assert.ok(config.stores.induk.address.includes('Hoscokro Aminoto'));
assert.strictEqual(config.stores.cabang.name, 'Toko Cabang');
assert.ok(config.stores.cabang.address.includes('Mawar'));

const configStr = JSON.stringify(config).toLowerCase();
assert.ok(!configStr.includes('balikpapan'), 'Config must not contain Balikpapan');
assert.ok(!configStr.includes('gresik'), 'Config must not contain Gresik');
console.log('✔ Config verification passed!');

// 2. Verify Products
assert.strictEqual(products.length, 8, 'Products must contain 8 items');
const expectedSlugs = [
  'pupuk-npk-mutiara-16-16-16',
  'benih-padi-inpari-32',
  'insektisida-regent-50-sc',
  'sprayer-elektrik-swan-16l',
  'pupuk-organik-cair-hayati',
  'benih-cabai-rawit-ori-212',
  'fungisida-dithane-m-45',
  'selang-drip-irigasi-100m'
];
assert.deepStrictEqual(products.map(p => p.slug), expectedSlugs);

const productsStr = JSON.stringify(products).toLowerCase();
assert.ok(!productsStr.includes('tuna sirip kuning'), 'Products must not contain seafood');
assert.ok(!productsStr.includes('salmon'), 'Products must not contain seafood');
assert.ok(!productsStr.includes('udang windu'), 'Products must not contain seafood');
assert.ok(!productsStr.includes('kepiting soka'), 'Products must not contain seafood');
assert.ok(!productsStr.includes('cumi-cumi'), 'Products must not contain seafood');
assert.ok(!productsStr.includes('hasil-tangkapan'), 'Products must not contain hasil-tangkapan');
console.log('✔ Products verification passed!');

// 3. Verify Articles
assert.strictEqual(articles.length, 5, 'Articles must contain 5 items');
assert.strictEqual(articles[0].slug, 'cara-memilih-pupuk-yang-tepat');
assert.strictEqual(articles[1].slug, 'tips-budidaya-tanaman-produktif');
assert.strictEqual(articles[2].slug, 'panduan-penggunaan-pestisida-aman');
assert.strictEqual(articles[3].slug, 'teknik-perawatan-tanaman-modern');
assert.strictEqual(articles[4].slug, 'memilih-bibit-unggul-berkualitas');
console.log('✔ Articles verification passed!');

// 4. Test waLink function
function waLink(productName) {
  const text = productName
    ? `Halo, saya ingin bertanya tentang produk: ${productName}`
    : 'Halo, saya ingin bertanya tentang produk pertanian';
  return `https://wa.me/${config.waNumber}?text=${encodeURIComponent(text)}`;
}

const generalWa = waLink();
assert.strictEqual(
  generalWa,
  'https://wa.me/6285875613333?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20produk%20pertanian'
);

const productWa = waLink('Pupuk NPK Mutiara 16-16-16 (1 kg)');
assert.strictEqual(
  productWa,
  'https://wa.me/6285875613333?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20produk%3A%20Pupuk%20NPK%20Mutiara%2016-16-16%20(1%20kg)'
);
console.log('✔ waLink verification passed!');

// 5. Test formatRupiah
const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});
function formatRupiah(amount) {
  return idrFormatter.format(amount).replace(/\u00a0/g, ' ');
}

assert.strictEqual(formatRupiah(24000), 'Rp 24.000');
assert.strictEqual(formatRupiah(85000), 'Rp 85.000');
assert.strictEqual(formatRupiah(495000), 'Rp 495.000');
console.log('✔ formatRupiah verification passed!');

console.log('ALL TASK 2 UNIT TESTS PASSED SUCCESSFULLY! 🚀');
