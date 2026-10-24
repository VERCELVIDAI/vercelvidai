/**
 * FLUVIA FLOW — SEO, FAVICON & PAYU PRODUCTION VERIFICATION TEST SUITE
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Load .env.local if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { BRAND } from '../src/lib/brand';
import { getPayUConfig } from '../src/lib/payments/payu';

async function runSeoTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING SEO, FAVICON & PAYU PRODUCTION TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(desc: string, condition: boolean, extra?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`, extra ? extra : '');
      failed++;
    }
  }

  // 1. Social Sharing Banner (Open Graph)
  console.log('1. Testing Open Graph Social Sharing Banner...');
  const bannerPath = path.resolve(process.cwd(), 'public/images/fluvia-flow-social-banner.jpg');
  assert('Social banner file exists on disk', fs.existsSync(bannerPath));
  
  if (fs.existsSync(bannerPath)) {
    const meta = await sharp(bannerPath).metadata();
    assert('Banner format is JPEG', meta.format === 'jpeg');
    assert('Banner width is exactly 1200px', meta.width === 1200);
    assert('Banner height is exactly 630px', meta.height === 630);
    const stat = fs.statSync(bannerPath);
    assert('Banner size is web-optimized (< 350 KB)', stat.size < 350 * 1024, `${(stat.size / 1024).toFixed(1)} KB`);
  }

  // 2. Favicons and App Icons
  console.log('\n2. Testing Favicon & App Icons...');
  const icons = [
    { file: 'public/favicon.ico', expectedFormat: null, minSize: 100 },
    { file: 'public/favicon.svg', expectedFormat: null, minSize: 100 },
    { file: 'public/favicon-16x16.png', expectedFormat: 'png', width: 16, height: 16 },
    { file: 'public/favicon-32x32.png', expectedFormat: 'png', width: 32, height: 32 },
    { file: 'public/apple-touch-icon.png', expectedFormat: 'png', width: 180, height: 180 },
    { file: 'public/icon-192.png', expectedFormat: 'png', width: 192, height: 192 },
    { file: 'public/icon-512.png', expectedFormat: 'png', width: 512, height: 512 },
  ];

  for (const ic of icons) {
    const fPath = path.resolve(process.cwd(), ic.file);
    assert(`${ic.file} exists`, fs.existsSync(fPath));
    if (fs.existsSync(fPath) && ic.expectedFormat) {
      const meta = await sharp(fPath).metadata();
      assert(`${ic.file} format is ${ic.expectedFormat}`, meta.format === ic.expectedFormat);
      if (ic.width && ic.height) {
        assert(`${ic.file} dimensions match ${ic.width}x${ic.height}`, meta.width === ic.width && meta.height === ic.height);
      }
    }
  }

  // Test favicon.ico binary header
  const icoPath = path.resolve(process.cwd(), 'public/favicon.ico');
  const icoBuf = fs.readFileSync(icoPath);
  assert('favicon.ico has valid ICO magic header [0x00, 0x00, 0x01, 0x00]', icoBuf[0] === 0 && icoBuf[1] === 0 && icoBuf[2] === 1 && icoBuf[3] === 0);
  assert('favicon.ico contains multiple icon resolutions', icoBuf.readUInt16LE(4) >= 2);

  // 3. Web App Manifest
  console.log('\n3. Testing Web App Manifest...');
  const manifestPath = path.resolve(process.cwd(), 'public/site.webmanifest');
  assert('site.webmanifest exists', fs.existsSync(manifestPath));
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert('Manifest name matches Fluvia Flow', manifest.name.includes('Fluvia Flow'));
    assert('Manifest declares icons array', Array.isArray(manifest.icons) && manifest.icons.length >= 4);
    assert('Manifest theme_color matches #059669', manifest.theme_color === '#059669');
  }

  // 4. Centralized Brand & SEO Configuration
  console.log('\n4. Testing Brand & SEO Configuration...');
  assert('BRAND.siteUrl is https://fluviaflow.online', BRAND.siteUrl === 'https://fluviaflow.online');
  assert('BRAND.ogImageAbsolute is https://fluviaflow.online/images/fluvia-flow-social-banner.jpg', 
    BRAND.ogImageAbsolute === 'https://fluviaflow.online/images/fluvia-flow-social-banner.jpg');
  assert('BRAND.themeColor is #059669', BRAND.themeColor === '#059669');
  assert('BRAND.title contains Fluvia Flow', BRAND.title.includes('Fluvia Flow'));

  // 5. PayU Production Gateway Configuration
  console.log('\n5. Testing PayU Production Gateway Setup...');
  const payu = getPayUConfig();
  assert('PayU environment is production', payu.env === 'production' || payu.env === 'prod');
  assert('PayU paymentUrl is "https://secure.payu.in/_payment"', payu.paymentUrl === 'https://secure.payu.in/_payment');
  assert('PayU postServiceUrl is "https://info.payu.in/merchant/postservice?form=2"', payu.postServiceUrl === 'https://info.payu.in/merchant/postservice?form=2');
  assert('PayU merchantKey is configured', Boolean(payu.merchantKey && payu.merchantKey.length > 2));
  assert('PayU merchantSalt is configured', Boolean(payu.merchantSalt && payu.merchantSalt.length > 10));

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runSeoTests();
