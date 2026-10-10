import fs from 'fs';

const html = fs.readFileSync('../Project Files/Alan Tani Jaya, preview landing page v17.html', 'utf8');

const aboutMatch = html.match(/<section[^>]*id=["']tentang["'][\s\S]*?<\/section>/);
if (aboutMatch) {
  fs.writeFileSync('preview-about.html', aboutMatch[0]);
  console.log('Saved preview-about.html, length:', aboutMatch[0].length);
}

const contactMatch = html.match(/<section[^>]*id=["']kontak["'][\s\S]*?<\/section>/);
if (contactMatch) {
  fs.writeFileSync('preview-contact.html', contactMatch[0]);
  console.log('Saved preview-contact.html, length:', contactMatch[0].length);
}

// Also let's extract the CSS rules related to gallery, facts, contact
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const css = styleMatch[1];
  fs.writeFileSync('preview-css.css', css);
  console.log('Saved preview-css.css, length:', css.length);
}
