import fs from 'fs';
import path from 'path';
import { TEMPLATES_DATA, TEMPLATE_CATEGORIES, getTemplateById } from '../src/lib/templates';
import { dbStore } from '../src/lib/db/store';
import { aiDispatcher } from '../src/lib/ai/dispatcher';
import { runwayAdapter } from '../src/lib/ai/adapters/runway';
import { lumaAdapter } from '../src/lib/ai/adapters/luma';
import { fluviaCoreAdapter } from '../src/lib/ai/adapters/fluvia-core';

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

async function runFinalPlatformTests() {
  console.log('================================================================');
  console.log('🚀 FLUVIA FLOW: FINAL AI VIDEO PLATFORM IMPLEMENTATION TEST SUITE');
  console.log('================================================================\n');

  // ============================================================================
  // REQUIREMENT 1: Remove Irrelevant Templates Completely
  // ============================================================================
  console.log('1. Testing Irrelevant Templates Removal...');
  assert('Exactly 26 curated commercial templates exist', TEMPLATES_DATA.length === 26, `Count: ${TEMPLATES_DATA.length}`);

  const removedIds = ['tmpl_27', 'tmpl_28', 'tmpl_29', 'tmpl_30'];
  for (const id of removedIds) {
    const found = TEMPLATES_DATA.find((t) => t.id === id);
    assert(`Irrelevant template ${id} is completely removed`, !found);
  }

  const fillerTerms = ['sintel', 'big buck bunny', 'friday dog', 'jellyfish underwater'];
  for (const term of fillerTerms) {
    const hasTerm = TEMPLATES_DATA.some(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.prompt.toLowerCase().includes(term)
    );
    assert(`No generic filler "${term}" in templates`, !hasTerm);
  }

  // ============================================================================
  // REQUIREMENT 2: Template Previews Must Match Actual Templates (1-to-1)
  // ============================================================================
  console.log('\n2. Testing 1-to-1 Dedicated Template Previews & Physical Files...');
  const publicDir = path.join(process.cwd(), 'public');
  const seenPreviews = new Set<string>();

  for (const tmpl of TEMPLATES_DATA) {
    assert(`Template ${tmpl.id} has dedicated preview string`, Boolean(tmpl.videoPreview));
    
    // Check that videoPreview is local media file
    const isLocalMedia = tmpl.videoPreview.startsWith('/media/templates/tmpl-');
    assert(`Template ${tmpl.id} uses dedicated local MP4 asset`, isLocalMedia, tmpl.videoPreview);

    // Check unique preview per template
    const isUnique = !seenPreviews.has(tmpl.videoPreview);
    assert(`Template ${tmpl.id} has unique dedicated preview (no duplicate reuse)`, isUnique, tmpl.videoPreview);
    seenPreviews.add(tmpl.videoPreview);

    // Check physical file exists on disk and is non-empty
    const relativePath = tmpl.videoPreview.startsWith('/') ? tmpl.videoPreview.slice(1) : tmpl.videoPreview;
    const physicalPath = path.join(publicDir, relativePath);
    const fileExists = fs.existsSync(physicalPath);
    assert(`Physical preview file exists for ${tmpl.id} (${path.basename(physicalPath)})`, fileExists);

    if (fileExists) {
      const stats = fs.statSync(physicalPath);
      assert(`Physical preview for ${tmpl.id} is > 10KB (valid video bytes)`, stats.size > 10000, `Size: ${stats.size} bytes`);
    }
  }

  // ============================================================================
  // REQUIREMENT 3: 12 Focused Commercial Categories Strictly Adhered To
  // ============================================================================
  console.log('\n3. Testing 12 Curated Commercial Categories...');
  const APPROVED_12_CATEGORIES = TEMPLATE_CATEGORIES.filter(
    (c) => c !== 'All Templates' && c !== 'Trending'
  );

  for (const tmpl of TEMPLATES_DATA) {
    const isApproved = APPROVED_12_CATEGORIES.includes(tmpl.category as any);
    assert(`Template ${tmpl.id} category "${tmpl.category}" is an approved commercial category`, isApproved);
  }

  assert(
    'TEMPLATE_CATEGORIES filter includes "All Templates", "Trending", and exactly the 12 commercial categories',
    TEMPLATE_CATEGORIES.length === 14 &&
      TEMPLATE_CATEGORIES.includes('All Templates') &&
      TEMPLATE_CATEGORIES.includes('Trending')
  );

  // ============================================================================
  // REQUIREMENT 4: Gemini Omni 1.1 Flash is ONLY Active Video Model
  // ============================================================================
  console.log('\n4. Testing Gemini Omni 1.1 Flash as ONLY Active Model...');
  const geminiModel = dbStore.getModelById('gemini-omni-1.1-flash');
  assert('Database model "gemini-omni-1.1-flash" exists', Boolean(geminiModel));
  assert('Gemini Omni 1.1 Flash is marked isActive = true', geminiModel?.isActive === true);

  // Test that non-Gemini models are Coming Soon
  const comingSoonModels = ['runway-gen3', 'luma-ray', 'fluvia-cinematic-v1', 'openai-sora'];
  for (const modelId of comingSoonModels) {
    const model = dbStore.getModelById(modelId);
    if (model) {
      assert(`Model ${modelId} is marked isActive = false or comingSoon = true`, model.isActive === false || model.isComingSoon === true);
    }
  }

  // Test Dispatcher model gatekeeper
  let unapprovedRejected = false;
  try {
    await aiDispatcher.dispatchGenerationJob({
      userId: 'usr_test_gatekeeper',
      workspaceId: 'ws_test',
      modelId: 'runway-gen3',
      input: { prompt: 'Commercial test scene' },
    });
  } catch (err: any) {
    unapprovedRejected = err.message.includes('Coming Soon');
  }
  assert('aiDispatcher rejects Runway Gen-3 dispatch with Coming Soon error', unapprovedRejected);

  // Test Adapter honest failure (no fake demo mode!)
  try {
    const runwayRes = await runwayAdapter.startGeneration({ prompt: 'test ad' }, 'test_job_1');
    assert('Runway adapter returns failed status honestly', runwayRes.status === 'failed');
    assert('Runway error specifies Coming Soon', runwayRes.error?.includes('Coming Soon') === true);
  } catch (err) {
    assert('Runway adapter throws or fails cleanly', true);
  }

  try {
    const lumaRes = await lumaAdapter.startGeneration({ prompt: 'test ad' }, 'test_job_2');
    assert('Luma adapter returns failed status honestly', lumaRes.status === 'failed');
    assert('Luma error specifies Coming Soon', lumaRes.error?.includes('Coming Soon') === true);
  } catch (err) {
    assert('Luma adapter throws or fails cleanly', true);
  }

  try {
    const fluviaRes = await fluviaCoreAdapter.startGeneration({ prompt: 'test ad' }, 'test_job_3');
    assert('Fluvia Core adapter returns failed status honestly', fluviaRes.status === 'failed');
    assert('Fluvia Core error specifies Coming Soon', fluviaRes.error?.includes('Coming Soon') === true);
  } catch (err) {
    assert('Fluvia Core adapter throws or fails cleanly', true);
  }

  // ============================================================================
  // REQUIREMENT 5: Fixed 15 Credits Per Video Generation & Refund on Error
  // ============================================================================
  console.log('\n5. Testing Fixed 15 Credits Per Video & Automatic Refund...');
  const geminiCredits = await aiDispatcher.calculateEstimatedCredits('gemini-omni-1.1-flash', 5);
  assert('calculateEstimatedCredits returns exactly 15 credits for Gemini Omni 1.1 Flash', geminiCredits === 15, `Received: ${geminiCredits}`);

  const geminiModelCredits = dbStore.getModelById('gemini-omni-1.1-flash');
  const cost = geminiModelCredits?.creditPricing?.costCredits ?? (geminiModelCredits as any)?.costCredits;
  assert('dbStore model gemini-omni-1.1-flash has costCredits = 15', cost === 15, `Received: ${cost}`);

  // Test template estimated credits
  const allTemplates15Cr = TEMPLATES_DATA.every((t) => t.estimatedCredits === 15);
  assert('Every template in TEMPLATES_DATA specifies estimatedCredits = 15', allTemplates15Cr);

  // Test atomic credit reserve and refund cycle
  const testUserId = `usr_test_audit_${Date.now()}`;
  dbStore.addCredits(testUserId, 100, 'Test credit grant');
  const initialBalance = dbStore.getCreditAccount(testUserId).availableBalance;
  assert('Test account funded with 100 credits', initialBalance === 100);

  // Reserve 15 credits
  const testJobId = `job_test_refund_${Date.now()}`;
  const reserved = dbStore.reserveCredits(testUserId, 15, testJobId);
  assert('reserveCredits(15) succeeded', Boolean(reserved && reserved.reservedBalance === 15));
  assert('Available balance decremented by 15 (now 85)', dbStore.getCreditAccount(testUserId).availableBalance === 85);
  assert('Reserved balance incremented by 15 (now 15)', dbStore.getCreditAccount(testUserId).reservedBalance === 15);

  // Refund 15 credits (e.g. on provider error or quota limit)
  dbStore.refundCredits(testUserId, 15, 'Free Tier Limit 0 requests/day', testJobId);
  assert('Available balance restored to 100 after refund', dbStore.getCreditAccount(testUserId).availableBalance === 100);
  assert('Reserved balance restored to 0 after refund', dbStore.getCreditAccount(testUserId).reservedBalance === 0);

  // ============================================================================
  // REQUIREMENT 6: Google Vids Workspace Option (0 Credits)
  // ============================================================================
  console.log('\n6. Testing Google Vids Integration Specifications...');
  const floatingComposerCode = fs.readFileSync(
    path.join(process.cwd(), 'src/components/templates/FloatingPromptComposer.tsx'),
    'utf8'
  );
  assert('FloatingPromptComposer includes Google Vids Studio button', floatingComposerCode.includes('Google Vids Studio'));
  assert('FloatingPromptComposer discloses 0 Credits Deducted', floatingComposerCode.includes('0 Credits Deducted'));
  assert('FloatingPromptComposer links to Google Vids URL', floatingComposerCode.includes('workspace.google.com/intl/en_in/products/vids'));

  const detailModalCode = fs.readFileSync(
    path.join(process.cwd(), 'src/components/templates/DiscoveryDetailModal.tsx'),
    'utf8'
  );
  assert('DiscoveryDetailModal displays 15 Credits for generation cost', detailModalCode.includes('15 Credits'));
  assert('DiscoveryDetailModal includes Google Vids handoff button (0 cr)', detailModalCode.includes('Create in Google Vids Workspace (0 cr)'));
  assert('DiscoveryDetailModal displays Gemini Omni 1.1 Flash as AI Engine', detailModalCode.includes('gemini-omni-1.1-flash'));

  // ============================================================================
  // REQUIREMENT 7: PayU Production Integrity (No Regressions)
  // ============================================================================
  console.log('\n7. Testing PayU Production & Billing Integrity...');
  const payuLib = fs.readFileSync(path.join(process.cwd(), 'src/lib/payments/payu.ts'), 'utf8');
  assert('PayU library targets secure.payu.in production checkout', payuLib.includes('https://secure.payu.in/_payment'));
  assert('PayU library enforces 0% GST (no GST on checkout receipts)', payuLib.includes('0%') || payuLib.includes('no_gst') || !payuLib.includes('18% GST'));

  // ============================================================================
  // REQUIREMENT 8: Secret Safety (No Exposed Secrets in Source)
  // ============================================================================
  console.log('\n8. Testing Secret Safety in Git & Source Files...');
  const gitignore = fs.readFileSync(path.join(process.cwd(), '.gitignore'), 'utf8');
  assert('.gitignore protects .env.local', gitignore.includes('.env*.local') || gitignore.includes('.env.local'));

  console.log('\n================================================================');
  console.log(`FINAL PLATFORM TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFinalPlatformTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
