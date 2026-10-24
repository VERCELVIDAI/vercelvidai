import fs from 'fs';
import path from 'path';
import {
  ALL_CURATED_TEMPLATES,
  VIDEO_TEMPLATES,
  IMAGE_TEMPLATES,
  TEXT_ANIMATION_TEMPLATES,
  TEMPLATES_DATA,
  TEMPLATE_CATEGORIES,
  getTemplateById,
  getTemplateBySlug,
  getTemplatesByType,
  isVideoTemplate,
  isImageTemplate,
  isTextAnimationTemplate,
} from '../src/lib/templates';
import { dbStore } from '../src/lib/db/store';
import { aiDispatcher, calculateEstimatedCredits } from '../src/lib/ai/dispatcher';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean, extraInfo?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}${extraInfo ? ` -> ${extraInfo}` : ''}`);
    failed++;
  }
}

async function runAcceptanceTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING FLUVIA FLOW: PREMIUM TEMPLATE LIBRARY OVERHAUL SUITE');
  console.log('================================================================\n');

  // ============================================================================
  // TEST 1: Irrelevant Templates Completely Removed & Curated Counts
  // ============================================================================
  console.log('1. Testing Curated Template Counts & Removal of Low-Quality Filler...');
  assert('Total curated templates collection is >= 30 (actual: ' + ALL_CURATED_TEMPLATES.length + ')', ALL_CURATED_TEMPLATES.length >= 30);
  assert('Curated video templates count is 26', VIDEO_TEMPLATES.length === 26);
  assert('Curated image templates count is 15', IMAGE_TEMPLATES.length === 15);
  assert('Curated text animation templates count is 12', TEXT_ANIMATION_TEMPLATES.length === 12);
  assert('Total curated templates equals exactly 53', ALL_CURATED_TEMPLATES.length === 53);
  assert('TEMPLATES_DATA backward compatibility preserved (26)', TEMPLATES_DATA.length === 26);

  // Check no filler or irrelevant terms
  const fillerWords = ['sintel', 'big buck bunny', 'friday dog', 'jellyfish underwater', 'salad', 'hydroponic', 'stir-fry'];
  for (const w of fillerWords) {
    const hasWord = ALL_CURATED_TEMPLATES.some(
      (t) =>
        t.title.toLowerCase().includes(w) ||
        t.description.toLowerCase().includes(w) ||
        t.prompt.toLowerCase().includes(w)
    );
    assert(`No filler or irrelevant "${w}" in any template`, !hasWord);
  }

  // ============================================================================
  // TEST 2: Clear Separation of Video, Image, and Text Animation
  // ============================================================================
  console.log('\n2. Testing Clear Separation of Video, Image, and Text Animation Formats...');
  const videos = getTemplatesByType('video');
  const images = getTemplatesByType('image');
  const texts = getTemplatesByType('text-animation');

  assert('getTemplatesByType("video") returns exactly 26 video templates', videos.length === 26);
  assert('getTemplatesByType("image") returns exactly 15 image templates', images.length === 15);
  assert('getTemplatesByType("text-animation") returns exactly 12 text templates', texts.length === 12);

  for (const v of videos) {
    assert(`Video template ${v.id} has type 'video'`, v.type === 'video');
    assert(`Video template ${v.id} isVideoTemplate is true`, isVideoTemplate(v));
    assert(`Video template ${v.id} costs 15 credits`, v.estimatedCredits === 15);
    assert(`Video template ${v.id} uses video_gemini workflow`, v.generationWorkflow === 'video_gemini');
  }

  for (const img of images) {
    assert(`Image template ${img.id} has type 'image'`, img.type === 'image');
    assert(`Image template ${img.id} isImageTemplate is true`, isImageTemplate(img));
    assert(`Image template ${img.id} costs 5 credits`, img.estimatedCredits === 5);
    assert(`Image template ${img.id} uses image_gemini workflow`, img.generationWorkflow === 'image_gemini');
  }

  for (const txt of texts) {
    assert(`Text template ${txt.id} has type 'text-animation'`, txt.type === 'text-animation');
    assert(`Text template ${txt.id} isTextAnimationTemplate is true`, isTextAnimationTemplate(txt));
    assert(`Text template ${txt.id} costs 0 credits (free live engine)`, txt.estimatedCredits === 0);
    assert(`Text template ${txt.id} uses text_renderer workflow`, txt.generationWorkflow === 'text_renderer');
    assert(`Text template ${txt.id} has editable textFields defined`, Boolean(txt.textFields && txt.textFields.length > 0));
    assert(`Text template ${txt.id} has animationSettings defined`, Boolean(txt.animationSettings && txt.animationSettings.preset));
  }

  // ============================================================================
  // TEST 3: 1-to-1 Matching Previews & Physical Files on Disk
  // ============================================================================
  console.log('\n3. Testing 1-to-1 Dedicated Matching Previews & Physical Assets on Disk...');
  const pubDir = path.join(process.cwd(), 'public');
  const seenMedia = new Set<string>();

  for (const tmpl of ALL_CURATED_TEMPLATES) {
    const assetPath = tmpl.videoPreview || tmpl.thumbnail;
    assert(`Template ${tmpl.id} has preview asset assigned`, Boolean(assetPath));

    const isUnique = !seenMedia.has(assetPath);
    assert(`Template ${tmpl.id} has dedicated preview (no duplicate reuse)`, isUnique, assetPath);
    seenMedia.add(assetPath);

    const rel = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    const abs = path.join(pubDir, rel);
    const exists = fs.existsSync(abs);
    assert(`Physical preview file exists on disk for ${tmpl.id} (${path.basename(abs)})`, exists);

    if (exists) {
      const stats = fs.statSync(abs);
      assert(`Physical preview for ${tmpl.id} is > 10KB (valid bytes: ${stats.size})`, stats.size > 10000);
    }
  }

  // ============================================================================
  // TEST 4: Professional Prompts & Specification Coverage
  // ============================================================================
  console.log('\n4. Testing Professional Prompts & Required Commercial Categories...');
  // Video specification coverage: A through L
  const allPrompts = ALL_CURATED_TEMPLATES.map((t) => t.prompt);
  assert('Every template has a comprehensive prompt > 40 chars', allPrompts.every((p) => p && p.length > 40));

  const luxuryProduct = getTemplateById('tmpl_01');
  assert('Video: Luxury Product Commercial (Aura Chrono) exists', Boolean(luxuryProduct));

  const automotive = getTemplateById('tmpl_05');
  assert('Video: Automotive Launch Film (Apex GT) exists', Boolean(automotive));

  const ecommerceAd = getTemplateById('tmpl_10');
  assert('Video: E-commerce Product Ad (Ergonomic Aero Backpack) exists', Boolean(ecommerceAd));

  const beautyCommercial = getTemplateById('tmpl_03');
  assert('Video: Skincare and Beauty Commercial (HydraGlow) exists', Boolean(beautyCommercial));

  const saasExplainer = getTemplateById('tmpl_13');
  assert('Video: SaaS and Technology Explainer (Autonomous AI Agents) exists', Boolean(saasExplainer));

  const brandStory = getTemplateById('tmpl_06');
  assert('Video: Cinematic Brand Story (Nordic Fjords Expedition) exists', Boolean(brandStory));

  const socialReel = getTemplateById('tmpl_14');
  assert('Video: Social Media Reel (Hyper-Kinetic Workout) exists', Boolean(socialReel));

  const foodCommercial = getTemplateById('tmpl_07');
  assert('Video: Food and Beverage Commercial (Artisanal Neapolitan Pizza) exists', Boolean(foodCommercial));

  const fashionCampaign = getTemplateById('tmpl_04');
  assert('Video: Fashion Campaign (Avant-Garde Milan Runways) exists', Boolean(fashionCampaign));

  const realEstate = getTemplateById('tmpl_08');
  assert('Video: Real Estate Showcase (Bel Air Sanctuary) exists', Boolean(realEstate));

  const appPromo = getTemplateById('tmpl_22');
  assert('Video: App and Website Promo (High-Conversion Mobile App) exists', Boolean(appPromo));

  const logoReveal = getTemplateById('tmpl_12');
  assert('Video: Logo Reveal (Cyberpunk Neon Channel Intro) exists', Boolean(logoReveal));

  // ============================================================================
  // TEST 5: Image Generation Library Distinct Styles
  // ============================================================================
  console.log('\n5. Testing 15 Distinct Image Generation Templates...');
  const expectedImageSlugs = [
    'aura-flacon-luxury-perfume-photo',
    'sonic-aero-headset-ecommerce-hero',
    'hydraglow-botanical-dew-serum',
    'apex-gt-evoluzione-automotive-poster',
    'titan-75-mechanical-keyboard-launch',
    'origin-craft-espresso-extraction-poster',
    'solaris-sparkling-citrus-social-creative',
    'pro-creator-curved-oled-desk-setup',
    'maison-emeraude-structural-trench',
    'ferment-and-oak-wild-sourdough',
    'synapse-3d-glass-analytics-cloud',
    'modernist-swiss-fluid-chrome-typography',
    'terra-noir-sustainable-brand-moodboard',
    'aurora-autumn-cashmere-collection',
    'serenity-zen-mineral-facial-balm',
  ];

  for (const slug of expectedImageSlugs) {
    const tmpl = getTemplateBySlug(slug);
    assert(`Image template "${slug}" exists and is resolvable`, Boolean(tmpl));
    assert(`Image template "${slug}" has type 'image'`, tmpl?.type === 'image');
    assert(`Image template "${slug}" uses local image preview`, Boolean(tmpl?.thumbnail?.startsWith('/media/image-templates/')));
  }

  // ============================================================================
  // TEST 6: Text Animation Distinct Styles & Deterministic Preservation
  // ============================================================================
  console.log('\n6. Testing 12 Distinct Text Animation Templates...');
  const expectedTextPresets = [
    'chrome-3d',
    'liquid-metal',
    'emerald-glass',
    'kinetic-spring',
    'neon-flicker',
    'luxury-tracking',
    'editorial-mask',
    'digital-glitch',
    'smooth-wipe',
    'particle-swarm',
    'typewriter-cadence',
    'vector-draw',
  ];

  for (const preset of expectedTextPresets) {
    const tmpl = TEXT_ANIMATION_TEMPLATES.find((t) => t.animationSettings?.preset === preset);
    assert(`Text animation preset "${preset}" exists`, Boolean(tmpl));
    assert(`Text preset "${preset}" has headline field`, tmpl?.textFields?.some((f) => f.key === 'headline') === true);
    assert(`Text preset "${preset}" has 0 credit generation cost`, tmpl?.estimatedCredits === 0);
  }

  // ============================================================================
  // TEST 7: Template Audit & Quality Curation Engine
  // ============================================================================
  console.log('\n7. Testing Quality Curation & Missing Asset Detection Engine in dbStore...');
  const report = dbStore.getTemplateAuditReport();
  assert('Audit report runs without error', Boolean(report));
  assert('Audit report reflects 53 total templates', report.totalTemplates === 53);
  assert('Audit report reflects 26 video templates', report.videoTemplates === 26);
  assert('Audit report reflects 15 image templates', report.imageTemplates === 15);
  assert('Audit report reflects 12 text animation templates', report.textAnimationTemplates === 12);
  assert('Zero missing assets detected across entire library', report.missingAssets.length === 0, JSON.stringify(report.missingAssets));
  assert('Zero duplicate prompts detected across entire library', report.duplicatePrompts.length === 0, JSON.stringify(report.duplicatePrompts));
  assert('Zero duplicate titles detected across entire library', report.duplicateTitles.length === 0, JSON.stringify(report.duplicateTitles));

  // ============================================================================
  // TEST 8: Credit System Integrity (15 for Video, 5 for Image, 0 for Text)
  // ============================================================================
  console.log('\n8. Testing Credit System & Generation Workflow Mappings...');
  const testUserId = `usr_test_cred_${Date.now()}`;
  dbStore.createProfile({
    id: testUserId,
    email: `creator_${Date.now()}@fluviaflow.online`,
    displayName: 'Template Tester',
    role: 'creator',
    passwordPlainText: 'TestPassword123!',
  });

  const wallet = dbStore.getCreditAccount(testUserId);
  assert('New creator account receives initial credit balance', wallet.availableBalance >= 100);

  // Video credit calculation check
  const videoCost = calculateEstimatedCredits('gemini-omni-1.1-flash', 15);
  assert('Video generation costs exactly 15 credits', videoCost === 15);

  // Reserve 15 credits for video
  const res1 = dbStore.reserveCredits(testUserId, 15, 'test_vid_res');
  assert('Reserve 15 credits for video succeeded', res1);

  // Refund
  dbStore.refundCredits(testUserId, 15, 'Test Refund', 'test_vid_res');
  assert('Credits refunded successfully', dbStore.getCreditAccount(testUserId).availableBalance === wallet.availableBalance);

  console.log('\n================================================================');
  console.log(`🎉 TEMPLATE LIBRARY OVERHAUL ACCEPTANCE TESTS: ${passed} passed, ${failed} failed!`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
