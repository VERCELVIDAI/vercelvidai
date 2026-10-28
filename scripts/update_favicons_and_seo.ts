import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function updateFaviconsAndSeo() {
  console.log('🚀 Updating Favicons and SEO Assets for Fluvia Flow...');

  const iconSrc = 'C:/Users/zbook/.gemini/antigravity/brain/b2742e10-a39a-4d4e-b099-f2fe4349f72b/.user_uploaded/media_1793188149463_81816c92.jpg';
  const bannerSrc = 'C:/Users/zbook/.gemini/antigravity/brain/b2742e10-a39a-4d4e-b099-f2fe4349f72b/.user_uploaded/media_1793188149542_fb9ee5f0.png';

  if (!fs.existsSync(iconSrc)) {
    throw new Error(`Icon source file not found at ${iconSrc}`);
  }
  if (!fs.existsSync(bannerSrc)) {
    throw new Error(`Banner source file not found at ${bannerSrc}`);
  }

  // 1. Generate PNG Icons
  console.log('1. Generating PNG icon suite...');
  const iconSizes = [
    { name: 'public/favicon-16x16.png', size: 16 },
    { name: 'public/favicon-32x32.png', size: 32 },
    { name: 'public/apple-touch-icon.png', size: 180 },
    { name: 'public/icon-192.png', size: 192 },
    { name: 'public/icon-512.png', size: 512 },
  ];

  for (const item of iconSizes) {
    const dest = path.resolve(process.cwd(), item.name);
    await sharp(iconSrc)
      .resize(item.size, item.size, { fit: 'cover' })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(dest);
    console.log(`  ✓ Generated ${item.name} (${item.size}x${item.size})`);
  }

  // 2. Generate Multi-Resolution ICO File
  console.log('\n2. Generating multi-resolution ICO file...');
  const b16 = await sharp(iconSrc).resize(16, 16).png().toBuffer();
  const b32 = await sharp(iconSrc).resize(32, 32).png().toBuffer();
  const b48 = await sharp(iconSrc).resize(48, 48).png().toBuffer();

  const icoEntries = [
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 },
  ];

  const count = icoEntries.length;
  let offset = 6 + count * 16;
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // type 1 = ICO
  icoHeader.writeUInt16LE(count, 4); // count

  const dirHeaders: Buffer[] = [];
  for (const item of icoEntries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width, 0);
    entry.writeUInt8(item.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(item.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirHeaders.push(entry);
    offset += item.buffer.length;
  }

  const icoBuffer = Buffer.concat([icoHeader, ...dirHeaders, ...icoEntries.map(e => e.buffer)]);
  fs.writeFileSync(path.resolve(process.cwd(), 'public/favicon.ico'), icoBuffer);
  fs.writeFileSync(path.resolve(process.cwd(), 'src/app/favicon.ico'), icoBuffer);
  console.log(`  ✓ Generated public/favicon.ico & src/app/favicon.ico (${icoBuffer.length} bytes, 3 resolutions)`);

  // 3. Update public/favicon.svg
  console.log('\n3. Updating public/favicon.svg...');
  const svgContent = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="neonGlow" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F05BCE" />
      <stop offset="0.5" stop-color="#E046BD" />
      <stop offset="1" stop-color="#C026D3" />
    </linearGradient>
    <linearGradient id="glassBody" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2A142D" />
      <stop offset="1" stop-color="#140A17" />
    </linearGradient>
    <linearGradient id="fGrad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF7EE5" />
      <stop offset="0.5" stop-color="#F05BCE" />
      <stop offset="1" stop-color="#D926B5" />
    </linearGradient>
    <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#F05BCE" flood-opacity="0.8" />
    </filter>
  </defs>

  <!-- Outer Dark Midnight Plum Canvas -->
  <rect width="32" height="32" rx="7" fill="#100A12" />

  <!-- Glowing App Icon Shell with Neon Rim -->
  <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#glassBody)" stroke="url(#neonGlow)" stroke-width="1.5" filter="url(#pinkGlow)" />

  <!-- Top Glass Sheen -->
  <path d="M4 10C4 6.68629 6.68629 4 10 4H22C25.3137 4 28 6.68629 28 10C24 13 18 14 10 14C6 14 4 11 4 10Z" fill="white" fill-opacity="0.15" />

  <!-- Stylized F Backbone and Upper Wing -->
  <path d="M10 24V11.5C10 9 11.5 7.5 14 7.5H23C24 7.5 24.5 8.5 23.5 9.5L20 13C19.5 13.5 18.5 14 17.5 14H15V17H17C17.5 17 18 17.5 18 18V19C18 19.5 17.5 20 17 20H15V24C15 24.5 14.5 25 14 25H11C10.5 25 10 24.5 10 24Z" fill="url(#fGrad)" />

  <!-- Play Arrow Triangle -->
  <path d="M19 14.5L23.5 17.5C24.2 18 24.2 19 23.5 19.5L19 22.5C18.3 23 17.5 22.5 17.5 21.6V15.4C17.5 14.5 18.3 14 19 14.5Z" fill="url(#fGrad)" />
</svg>`;
  fs.writeFileSync(path.resolve(process.cwd(), 'public/favicon.svg'), svgContent, 'utf8');
  console.log('  ✓ Updated public/favicon.svg');

  // 4. Generate SEO Open Graph Social Banner (1200x630 JPEG, < 350KB)
  console.log('\n4. Generating Open Graph social banner (1200x630 JPEG)...');
  const bannerDest = path.resolve(process.cwd(), 'public/images/fluvia-flow-social-banner.jpg');
  const bannerDir = path.dirname(bannerDest);
  if (!fs.existsSync(bannerDir)) {
    fs.mkdirSync(bannerDir, { recursive: true });
  }

  await sharp(bannerSrc)
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 16, g: 10, b: 18, alpha: 1 } // #100A12
    })
    .jpeg({ quality: 90, progressive: true })
    .toFile(bannerDest);

  const bannerStats = fs.statSync(bannerDest);
  console.log(`  ✓ Generated ${bannerDest} (${(bannerStats.size / 1024).toFixed(1)} KB)`);

  console.log('\n🎉 ALL ICONS AND SEO ASSETS SUCCESSFULLY UPDATED!');
}

updateFaviconsAndSeo().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
