import fs from 'fs';
import path from 'path';
import {
  ALL_CURATED_TEMPLATES,
  VIDEO_TEMPLATES,
  IMAGE_TEMPLATES,
  TEXT_ANIMATION_TEMPLATES,
  TEMPLATES_DATA,
  TEMPLATE_FORMATS,
  getTemplatesByType,
  getTemplateById,
  getTemplateBySlug,
  isVideoTemplate,
  isImageTemplate,
  isTextAnimationTemplate,
} from '../src/lib/templates';
import { pollinationsService } from '../src/lib/ai/pollinations';
import { aiProviderRegistry } from '../src/lib/ai/registry';
import { dbStore } from '../src/lib/db/store';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, extra?: any) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    if (extra !== undefined) console.error('     Detail:', extra);
    failed++;
  }
}

async function runEmergencyFixTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING FLUVIA FLOW: TEMPLATE QUALITY EMERGENCY FIX SUITE');
  console.log('================================================================\n');

  // TEST 1: Exact Curated Active Count (24 Total: 8 Video, 8 Image, 8 Text)
  console.log('1. Testing Curated Active Templates Count (24 Total)...');
  assert('ALL_CURATED_TEMPLATES has exactly 24 active templates', ALL_CURATED_TEMPLATES.length === 24, `Count: ${ALL_CURATED_TEMPLATES.length}`);
  assert('VIDEO_TEMPLATES has exactly 8 video templates', VIDEO_TEMPLATES.length === 8, `Count: ${VIDEO_TEMPLATES.length}`);
  assert('IMAGE_TEMPLATES has exactly 8 image templates', IMAGE_TEMPLATES.length === 8, `Count: ${IMAGE_TEMPLATES.length}`);
  assert('TEXT_ANIMATION_TEMPLATES has exactly 8 text animation templates', TEXT_ANIMATION_TEMPLATES.length === 8, `Count: ${TEXT_ANIMATION_TEMPLATES.length}`);
  assert('TEMPLATES_DATA legacy compatibility preserved (26 items)', TEMPLATES_DATA.length === 26, `Count: ${TEMPLATES_DATA.length}`);

  // Format filter counts
  const allFormat = TEMPLATE_FORMATS.find((f) => f.id === 'all');
  const videoFormat = TEMPLATE_FORMATS.find((f) => f.id === 'video');
  const imageFormat = TEMPLATE_FORMATS.find((f) => f.id === 'image');
  const textFormat = TEMPLATE_FORMATS.find((f) => f.id === 'text-animation');
  assert('TEMPLATE_FORMATS all count equals 24', allFormat?.count === 24);
  assert('TEMPLATE_FORMATS video count equals 8', videoFormat?.count === 8);
  assert('TEMPLATE_FORMATS image count equals 8', imageFormat?.count === 8);
  assert('TEMPLATE_FORMATS text count equals 8', textFormat?.count === 8);

  // TEST 2: Video Templates Creative Direction Matching (8 total)
  console.log('\n2. Testing 8 Video Templates Creative Directions...');
  const expectedVideoSlugs = [
    'aura-privee-luxury-perfume-commercial', // 1. Luxury perfume commercial
    'hydraluxe-cell-renewal-serum-ad',       // 2. Premium skincare advertisement
    'veloce-hyperion-track-edition-launch',  // 3. Cinematic automotive launch
    'apex-titanium-smartphone-reveal',       // 4. High-end smartphone/product reveal
    'synthetix-ai-enterprise-launch',        // 5. Premium SaaS/product launch video
    'aerosprint-pro-kinetic-footwear-ad',    // 6. E-commerce product advertisement
    'atelier-solstice-haute-couture-campaign',// 7. Luxury fashion campaign
    'zenith-vanguard-master-brand-reveal',   // 8. Cinematic brand reveal
  ];

  for (const slug of expectedVideoSlugs) {
    const tmpl = getTemplateBySlug(slug);
    assert(`Video template "${slug}" exists and is resolvable`, Boolean(tmpl));
    assert(`Video template "${slug}" has type "video"`, tmpl?.type === 'video');
    assert(`Video template "${slug}" costs 15 credits`, tmpl?.estimatedCredits === 15);
    assert(`Video template "${slug}" has isStaticPreview marked true for honest preview`, tmpl?.isStaticPreview === true);
    assert(`Video template "${slug}" has professional prompt (> 100 chars)`, Boolean(tmpl?.prompt && tmpl.prompt.length > 100));
  }

  // TEST 3: Image Templates Creative Direction Matching (8 total)
  console.log('\n3. Testing 8 Image Templates Creative Directions...');
  const expectedImageSlugs = [
    'chrono-royal-horology-hero',            // 1. Luxury product hero photography
    'monza-gt-track-manifesto-poster',       // 2. Cinematic automotive campaign poster
    'lumiere-botanica-golden-serum',          // 3. High-end beauty & skincare advertisement
    'vogue-solitaire-editorial-portrait',    // 4. Editorial fashion photography
    'ergotype-studio-mechanical-art',         // 5. Minimalist technology product advertisement
    'apex-stride-urban-streetwear-hero',     // 6. Premium ecommerce campaign imagery
    'architectural-lettering-monolith',      // 7. Premium typography-led campaign artwork
    'citrus-botanica-sparkling-tonic',       // 8. Professional social media advertising creatives
  ];

  for (const slug of expectedImageSlugs) {
    const tmpl = getTemplateBySlug(slug);
    assert(`Image template "${slug}" exists and is resolvable`, Boolean(tmpl));
    assert(`Image template "${slug}" has type "image"`, tmpl?.type === 'image');
    assert(`Image template "${slug}" costs 5 credits`, tmpl?.estimatedCredits === 5);
    assert(`Image template "${slug}" uses local image preview`, Boolean(tmpl?.thumbnail?.startsWith('/media/image-templates/')));
    assert(`Image template "${slug}" has professional prompt (> 80 chars)`, Boolean(tmpl?.prompt && tmpl.prompt.length > 80));
  }

  // TEST 4: Text Animation Templates Creative Direction Matching (8 total)
  console.log('\n4. Testing 8 Text Animation Templates Creative Directions...');
  const expectedTextPresets = [
    'chrome-3d',       // 1. Chrome 3D typography reveal
    'emerald-glass',   // 2. Emerald glass lettering animation
    'liquid-metal',    // 3. Liquid metal title reveal
    'smooth-wipe',     // 4. Cinematic masked headline reveal
    'kinetic-spring',  // 5. Premium kinetic typography
    'vector-draw',     // 6. Elegant logo and tagline animation
    'editorial-mask',  // 7. Editorial typography transitions
    'luxury-tracking', // 8. Minimalist luxury brand intro
  ];

  for (const preset of expectedTextPresets) {
    const tmpl = TEXT_ANIMATION_TEMPLATES.find((t) => t.animationSettings?.preset === preset);
    assert(`Text animation preset "${preset}" exists`, Boolean(tmpl));
    assert(`Text preset "${preset}" costs 0 credits (free live engine)`, tmpl?.estimatedCredits === 0);
    assert(`Text preset "${preset}" has headline field`, tmpl?.textFields?.some((f) => f.key === 'headline') === true);
    assert(`Text preset "${preset}" uses local text preview`, Boolean(tmpl?.thumbnail?.startsWith('/media/text-templates/')));
  }

  // TEST 5: Preview File Verification (All 24 Assets Exist on Disk & > 20KB)
  console.log('\n5. Testing Preview File Verification (All 24 Physical Assets > 20KB)...');
  const pubDir = path.join(process.cwd(), 'public');
  const seenAssets = new Set<string>();

  for (const tmpl of ALL_CURATED_TEMPLATES) {
    const assetPath = tmpl.thumbnail;
    assert(`Template ${tmpl.id} has thumbnail path`, Boolean(assetPath));

    const isUnique = !seenAssets.has(assetPath);
    assert(`Template ${tmpl.id} has dedicated thumbnail (no duplicate reuse)`, isUnique, assetPath);
    seenAssets.add(assetPath);

    const rel = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    const abs = path.join(pubDir, rel);
    const exists = fs.existsSync(abs);
    assert(`Physical preview exists on disk for ${tmpl.id} (${path.basename(abs)})`, exists);

    if (exists) {
      const stats = fs.statSync(abs);
      assert(`Physical preview for ${tmpl.id} is > 20KB (size: ${stats.size} bytes)`, stats.size > 20000);
    }
  }

  // TEST 6: Audit Report from dbStore
  console.log('\n6. Testing Quality Curation & Audit Report from dbStore...');
  const report = dbStore.getTemplateAuditReport();
  assert('Audit report runs without error', Boolean(report));
  assert('Audit report reflects 24 total active templates', report.totalTemplates === 24);
  assert('Audit report reflects 8 video templates', report.videoTemplates === 8);
  assert('Audit report reflects 8 image templates', report.imageTemplates === 8);
  assert('Audit report reflects 8 text animation templates', report.textAnimationTemplates === 8);
  assert('Zero missing assets detected across entire active library', report.missingAssets.length === 0, JSON.stringify(report.missingAssets));
  assert('Zero duplicate prompts detected across active library', report.duplicatePrompts.length === 0, JSON.stringify(report.duplicatePrompts));
  assert('Zero duplicate titles detected across active library', report.duplicateTitles.length === 0, JSON.stringify(report.duplicateTitles));

  // TEST 7: Pollinations Multi-Model Integration
  console.log('\n7. Testing Pollinations AI Provider Adapter Integration...');
  assert('PollinationsService is defined and exported', Boolean(pollinationsService));
  assert('PollinationsService exposes generateVideo function', typeof pollinationsService.generateVideo === 'function');
  assert('PollinationsService exposes generateImage function', typeof pollinationsService.generateImage === 'function');

  const polAdapter = aiProviderRegistry.get('pollinations');
  assert('Pollinations adapter is registered in aiProviderRegistry', Boolean(polAdapter));
  assert('Pollinations adapter has multimodal type', polAdapter?.type === 'multimodal');
  const caps = polAdapter?.getCapabilities();
  assert('Pollinations adapter supports video generation', caps?.supportsVideo === true);
  assert('Pollinations adapter supports image generation', caps?.supportsImage === true);

  console.log('\n================================================================');
  console.log(`🎉 EMERGENCY FIX ACCEPTANCE TESTS: ${passed} passed, ${failed} failed!`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runEmergencyFixTestSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
