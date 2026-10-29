import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SVG_FAVICON = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fluviaGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#5145CD" />
      <stop offset="0.5" stop-color="#4338CA" />
      <stop offset="1" stop-color="#312E81" />
    </linearGradient>
    <linearGradient id="shimmer" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.05" />
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#312E81" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Container Rounded Squircle -->
  <rect width="64" height="64" rx="16" fill="url(#fluviaGrad)" />
  <rect x="1" y="1" width="62" height="62" rx="15" stroke="white" stroke-opacity="0.18" stroke-width="1.5" />
  
  <!-- Subtle Ambient Top Shimmer -->
  <rect width="64" height="64" rx="16" fill="url(#shimmer)" />

  <!-- Centered Scaled Emblem -->
  <g transform="translate(11, 11) scale(1.1667)">
    <!-- Fluid F Spine -->
    <path
      d="M9.5 7.5C8.39543 7.5 7.5 8.39543 7.5 9.5V26.5C7.5 27.6046 8.39543 28.5 9.5 28.5H11.5C12.6046 28.5 13.5 27.6046 13.5 26.5V19.5H18.5C19.6046 19.5 20.5 18.6046 20.5 17.5C20.5 16.3954 19.6046 15.5 18.5 15.5H13.5V11.5H25.5C26.6046 11.5 27.5 10.6046 27.5 9.5C27.5 8.39543 26.6046 7.5 25.5 7.5H9.5Z"
      fill="#FFFFFF"
    />
    <!-- Upper Flow Ribbon Swoosh -->
    <path
      d="M17.5 7.5C22.5 7.5 27.5 10.5 28.5 15.5C25.5 14 21 14 17.5 15.5V7.5Z"
      fill="#FFFFFF"
      fill-opacity="0.5"
    />
    <!-- Kinetic Video Lens -->
    <circle
      cx="26"
      cy="23"
      r="3.5"
      fill="#FFFFFF"
    />
    <path
      d="M24.75 21.75L27.75 23L24.75 24.25V21.75Z"
      fill="#5145CD"
    />
  </g>
</svg>`;

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const appDir = path.join(process.cwd(), 'src', 'app');

  // 1. Write favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), SVG_FAVICON.trim());
  console.log('✅ Wrote public/favicon.svg');

  const svgBuffer = Buffer.from(SVG_FAVICON);

  // 2. Generate PNGs
  const targets = [
    { file: path.join(publicDir, 'favicon-16x16.png'), size: 16 },
    { file: path.join(publicDir, 'favicon-32x32.png'), size: 32 },
    { file: path.join(publicDir, 'apple-touch-icon.png'), size: 180 },
    { file: path.join(publicDir, 'icon-192.png'), size: 192 },
    { file: path.join(publicDir, 'icon-512.png'), size: 512 },
    { file: path.join(appDir, 'icon.png'), size: 32 },
    { file: path.join(appDir, 'apple-icon.png'), size: 180 },
  ];

  for (const t of targets) {
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png()
      .toFile(t.file);
    console.log(`✅ Generated ${path.relative(process.cwd(), t.file)} (${t.size}x${t.size})`);
  }

  // 3. Generate favicon.ico (using 32x32 and 16x16 PNG frames)
  // Standard ICO header + PNG frames
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();

  // Simple multi-image ICO structure
  // Header: 2 bytes reserved (0), 2 bytes type (1 = icon), 2 bytes count (2)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(2, 4);

  const dirEntrySize = 16;
  const entriesOffset = 6;
  const dataOffset = entriesOffset + 2 * dirEntrySize;

  // Entry 1: 32x32
  const entry1 = Buffer.alloc(dirEntrySize);
  entry1.writeUInt8(32, 0); // width
  entry1.writeUInt8(32, 1); // height
  entry1.writeUInt8(0, 2);  // color palette (0 = no palette)
  entry1.writeUInt8(0, 3);  // reserved
  entry1.writeUInt16LE(1, 4); // color planes
  entry1.writeUInt16LE(32, 6); // bpp
  entry1.writeUInt32LE(png32.length, 8); // size of image data
  entry1.writeUInt32LE(dataOffset, 12);  // offset of image data

  // Entry 2: 16x16
  const entry2 = Buffer.alloc(dirEntrySize);
  entry2.writeUInt8(16, 0); // width
  entry2.writeUInt8(16, 1); // height
  entry2.writeUInt8(0, 2);  // color palette
  entry2.writeUInt8(0, 3);  // reserved
  entry2.writeUInt16LE(1, 4); // color planes
  entry2.writeUInt16LE(32, 6); // bpp
  entry2.writeUInt32LE(png16.length, 8); // size of image data
  entry2.writeUInt32LE(dataOffset + png32.length, 12); // offset of image data

  const icoBuffer = Buffer.concat([header, entry1, entry2, png32, png16]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('✅ Generated public/favicon.ico and src/app/favicon.ico');
}

main().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
