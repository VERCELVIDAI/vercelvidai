import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const appDir = path.join(process.cwd(), 'src', 'app');
  const imagesDir = path.join(publicDir, 'images');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Load cinematic product image for preview card
  const posterPath = path.join(publicDir, 'media', 'templates', 'poster-vid-01-perfume.jpg');
  let posterBase64 = '';
  if (fs.existsSync(posterPath)) {
    const resizedPoster = await sharp(posterPath)
      .resize(460, 260, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer();
    posterBase64 = `data:image/jpeg;base64,${resizedPoster.toString('base64')}`;
  }

  // Construct High-End 1200x630 Executive Social Banner SVG
  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Radial Gradients -->
    <radialGradient id="indigoGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 120) rotate(45) scale(480 380)">
      <stop offset="0%" stop-color="#5145CD" stop-opacity="0.14" />
      <stop offset="60%" stop-color="#818CF8" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="cyanGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1000 520) rotate(-30) scale(460 380)">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.16" />
      <stop offset="70%" stop-color="#6366F1" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="cardGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(900 280) rotate(90) scale(340 400)">
      <stop offset="0%" stop-color="#5145CD" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>

    <!-- Logo Badge Gradients -->
    <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#5145CD" />
      <stop offset="0.5" stop-color="#4338CA" />
      <stop offset="1" stop-color="#312E81" />
    </linearGradient>

    <linearGradient id="shimmer" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.05" />
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Subtle Shadows -->
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0F172A" flood-opacity="0.10" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.04" />
    </filter>

    <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#312E81" flood-opacity="0.25" />
    </filter>

    <clipPath id="videoClip">
      <rect x="0" y="0" width="456" height="256" rx="12" />
    </clipPath>
  </defs>

  <!-- 1. BASE BACKGROUND -->
  <rect width="1200" height="630" fill="#FFFFFF" />
  <rect width="1200" height="630" fill="url(#indigoGlow)" />
  <rect width="1200" height="630" fill="url(#cyanGlow)" />
  <rect width="1200" height="630" fill="url(#cardGlow)" />

  <!-- Architectural Precision Grid (Subtle) -->
  <g opacity="0.035" stroke="#5145CD" stroke-width="1">
    ${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="630" />`).join('\n')}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 48}" x2="1200" y2="${i * 48}" />`).join('\n')}
  </g>

  <!-- Hairline Outer Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="20" stroke="#E5E7EB" stroke-width="1.5" />

  <!-- ========================================================================= -->
  <!-- LEFT COLUMN: BRAND STORY & POSITIONING -->
  <!-- ========================================================================= -->
  <g transform="translate(80, 85)">
    <!-- Header: Dynamic Logo Mark + Wordmark -->
    <g transform="translate(0, 0)">
      <!-- Kinetic Monogram Icon -->
      <g filter="url(#logoShadow)">
        <rect width="56" height="56" rx="15" fill="url(#logoGrad)" />
        <rect x="1" y="1" width="54" height="54" rx="14" stroke="white" stroke-opacity="0.2" stroke-width="1" />
        <rect width="56" height="56" rx="15" fill="url(#shimmer)" />
        <g transform="translate(10, 10) scale(1)">
          <path d="M9.5 7.5C8.39543 7.5 7.5 8.39543 7.5 9.5V26.5C7.5 27.6046 8.39543 28.5 9.5 28.5H11.5C12.6046 28.5 13.5 27.6046 13.5 26.5V19.5H18.5C19.6046 19.5 20.5 18.6046 20.5 17.5C20.5 16.3954 19.6046 15.5 18.5 15.5H13.5V11.5H25.5C26.6046 11.5 27.5 10.6046 27.5 9.5C27.5 8.39543 26.6046 7.5 25.5 7.5H9.5Z" fill="#FFFFFF" />
          <path d="M17.5 7.5C22.5 7.5 27.5 10.5 28.5 15.5C25.5 14 21 14 17.5 15.5V7.5Z" fill="#FFFFFF" fill-opacity="0.5" />
          <circle cx="26" cy="23" r="3.25" fill="#FFFFFF" />
          <path d="M24.75 21.75L27.75 23L24.75 24.25V21.75Z" fill="#5145CD" />
        </g>
      </g>

      <!-- Typography Wordmark -->
      <text x="72" y="32" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="28" fill="#17191D" letter-spacing="-0.03em">FLUVIA</text>
      <text x="180" y="32" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="28" fill="#5145CD" letter-spacing="-0.03em">FLOW</text>

      <!-- AI Studio Tag Pill -->
      <rect x="272" y="14" width="84" height="24" rx="6" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1" />
      <text x="314" y="30" font-family="ui-monospace, monospace" font-weight="700" font-size="10.5" fill="#5145CD" text-anchor="middle" letter-spacing="0.08em">AI STUDIO</text>
    </g>

    <!-- Category Pill Badge -->
    <g transform="translate(0, 84)">
      <rect width="276" height="30" rx="15" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1" />
      <circle cx="16" cy="15" r="4" fill="#5145CD" />
      <text x="28" y="19" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#5145CD" letter-spacing="0.06em">NEXT-GEN AI AD CREATION STUDIO</text>
    </g>

    <!-- Main Headline -->
    <text x="0" y="165" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="44" fill="#17191D" letter-spacing="-0.03em">
      Create High-Converting
    </text>
    <text x="0" y="218" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="44" fill="#5145CD" letter-spacing="-0.03em">
      AI Video Ads in Minutes.
    </text>

    <!-- Subtitle -->
    <text x="0" y="265" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="17" fill="#667085" letter-spacing="-0.01em">
      Studio-grade commercials, product transformations, and localized
    </text>
    <text x="0" y="291" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="17" fill="#667085" letter-spacing="-0.01em">
      voiceovers powered by Google Gemini &amp; ElevenLabs.
    </text>

    <!-- Feature Pillars -->
    <g transform="translate(0, 335)">
      <!-- Pill 1: Google Gemini -->
      <rect x="0" y="0" width="224" height="38" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="16" y="23" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#334155">⚡ Google Gemini Omni 1.1</text>

      <!-- Pill 2: ElevenLabs Voice -->
      <rect x="236" y="0" width="210" height="38" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="252" y="23" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#334155">🎙️ ElevenLabs Voice Studio</text>

      <!-- Pill 3: 1080p Commercial -->
      <rect x="0" y="48" width="180" height="38" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="16" y="71" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#334155">🎬 1080p HD Commercials</text>

      <!-- Pill 4: Commercial Rights -->
      <rect x="192" y="48" width="254" height="38" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="208" y="71" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#334155">🔒 Full Commercial Rights Included</text>
    </g>

    <!-- Footer URL -->
    <text x="0" y="455" font-family="ui-monospace, monospace" font-weight="600" font-size="13" fill="#5145CD" letter-spacing="0.04em">
      fluviaflow.online • AI Creative Production Platform
    </text>
  </g>

  <!-- ========================================================================= -->
  <!-- RIGHT COLUMN: HIGH-TECH STUDIO WORKSPACE CARD MOCKUP -->
  <!-- ========================================================================= -->
  <g transform="translate(645, 105)" filter="url(#cardShadow)">
    <!-- Container Card -->
    <rect width="476" height="395" rx="18" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" />

    <!-- Window Top Header Bar -->
    <path d="M0 18C0 8.05888 8.05887 0 18 0H458C467.941 0 476 8.05887 476 18V44H0V18Z" fill="#F8FAFC" />
    <line x1="0" y1="44" x2="476" y2="44" stroke="#E5E7EB" stroke-width="1" />

    <!-- 3 Modern Window Control Dots -->
    <circle cx="20" cy="22" r="5" fill="#EF4444" />
    <circle cx="36" cy="22" r="5" fill="#F59E0B" />
    <circle cx="52" cy="22" r="5" fill="#10B981" />

    <text x="74" y="26" font-family="ui-monospace, monospace" font-weight="600" font-size="11" fill="#64748B">
      Fluvia Flow Studio • 4K Neural Canvas
    </text>

    <!-- Widescreen Video Viewport -->
    <g transform="translate(10, 54)">
      <rect width="456" height="256" rx="12" fill="#0F172A" />
      ${
        posterBase64
          ? `<g clip-path="url(#videoClip)">
              <image href="${posterBase64}" width="456" height="256" preserveAspectRatio="xMidYMid slice" />
            </g>`
          : ''
      }

      <!-- Top Overlay Badge -->
      <rect x="12" y="12" width="148" height="24" rx="6" fill="#5145CD" />
      <text x="86" y="27" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.04em">
        LIVE GENERATION (15 cr)
      </text>

      <!-- Bottom Resolution Overlay -->
      <rect x="282" y="12" width="162" height="24" rx="6" fill="#0F172A" fill-opacity="0.8" stroke="white" stroke-opacity="0.2" stroke-width="1" />
      <text x="363" y="27" font-family="ui-monospace, monospace" font-weight="600" font-size="10" fill="#FFFFFF" text-anchor="middle">
        4K 60FPS • Gemini Omni
      </text>

      <!-- Center Play Glass Icon -->
      <circle cx="228" cy="128" r="28" fill="#FFFFFF" fill-opacity="0.9" />
      <polygon points="223,117 240,128 223,139" fill="#17191D" />
    </g>

    <!-- Prompt Bar Under Video -->
    <g transform="translate(10, 322)">
      <rect width="456" height="60" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      
      <!-- Sparkle Icon Badge -->
      <rect x="10" y="10" width="38" height="40" rx="8" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1" />
      <text x="29" y="34" font-size="18" text-anchor="middle">✨</text>

      <!-- Prompt Text -->
      <text x="58" y="27" font-family="ui-monospace, monospace" font-weight="600" font-size="10.5" fill="#5145CD">
        AI PRODUCTION PROMPT
      </text>
      <text x="58" y="44" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="#64748B">
        "Luxury perfume bottle on liquid gold ripples, dramatic rim lighting..."
      </text>
    </g>
  </g>
</svg>`;

  const svgBuffer = Buffer.from(svg);

  // 1. Output high-quality JPEG for social banners (1200x630)
  const jpgFile = path.join(imagesDir, 'fluvia-flow-social-banner.jpg');
  await sharp(svgBuffer)
    .resize(1200, 630)
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(jpgFile);
  console.log(`✅ Generated ${path.relative(process.cwd(), jpgFile)} (1200x630 JPG)`);

  // 2. Output PNG version
  const pngFile = path.join(imagesDir, 'fluvia-flow-social-banner.png');
  await sharp(svgBuffer)
    .resize(1200, 630)
    .png()
    .toFile(pngFile);
  console.log(`✅ Generated ${path.relative(process.cwd(), pngFile)} (1200x630 PNG)`);

  // 3. Output Next.js App Router file-based OpenGraph and Twitter images
  const ogAppFile = path.join(appDir, 'opengraph-image.png');
  const twitterAppFile = path.join(appDir, 'twitter-image.png');
  await sharp(svgBuffer).resize(1200, 630).png().toFile(ogAppFile);
  await sharp(svgBuffer).resize(1200, 630).png().toFile(twitterAppFile);
  console.log(`✅ Generated ${path.relative(process.cwd(), ogAppFile)} and ${path.relative(process.cwd(), twitterAppFile)}`);
}

main().catch((err) => {
  console.error('Error generating SEO banner:', err);
  process.exit(1);
});
