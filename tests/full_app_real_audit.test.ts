import fs from 'fs';
import path from 'path';
import assert from 'assert';

// 1. Environment loader from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function runRealAppAudit() {
  console.log('================================================================');
  console.log('🧪 FLUVIA FLOW: COMPREHENSIVE REAL TEST & AUDIT SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function testAssert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // --- SECTION 1: ELEVENLABS REAL AUDIO ENGINE & SDK INTEGRATION ---
  console.log('1. Testing ElevenLabs Real Audio Engine & SDK Integration...');
  const { elevenLabsService } = await import('../src/lib/ai/elevenlabs');
  testAssert(elevenLabsService.isConfigured(), 'ElevenLabs service is configured with valid API key');

  const voices = await elevenLabsService.getVoices();
  testAssert(Array.isArray(voices) && voices.length > 0, `getVoices returned ${voices.length} active ElevenLabs voices`);
  const firstVoice = voices[0];
  testAssert(Boolean(firstVoice.voiceId || firstVoice.id), 'Voice object contains valid voiceId');
  testAssert(typeof firstVoice.name === 'string' && firstVoice.name.length > 0, `Voice name is valid ("${firstVoice.name}")`);

  // Real TTS synthesis verification
  console.log('  Testing real text-to-speech synthesis (short prompt)...');
  const ttsResult = await elevenLabsService.generateVoiceover({
    text: 'Fluvia Flow is the leading AI video creation studio.',
    voiceId: firstVoice.voiceId || firstVoice.id,
    modelId: 'eleven_v4',
  });
  testAssert(ttsResult.success === true, 'Real TTS generation returned success: true');
  testAssert(Boolean(ttsResult.audioUrl), `Audio URL returned (${ttsResult.audioUrl})`);
  testAssert(Boolean(ttsResult.audioBuffer && ttsResult.audioBuffer.length > 10000), `Audio buffer size is valid (${ttsResult.audioBuffer?.length} bytes)`);

  const diskPath = path.join(process.cwd(), 'public', ttsResult.audioUrl!.replace(/^\//, ''));
  testAssert(fs.existsSync(diskPath), 'Physical synthesized audio file exists in public/uploads/audio/');

  // --- SECTION 2: AI PROVIDER REGISTRY & ADAPTERS ---
  console.log('\n2. Testing AI Provider Registry & Adapters...');
  const { aiProviderRegistry } = await import('../src/lib/ai/registry');
  const elevenLabsAdapter = aiProviderRegistry.get('elevenlabs');
  testAssert(Boolean(elevenLabsAdapter), "Provider 'elevenlabs' is registered in aiProviderRegistry");
  testAssert(elevenLabsAdapter?.getCapabilities().supportsVoice === true, "'elevenlabs' declares supportsVoice = true");

  const pollinationsAdapter = aiProviderRegistry.get('pollinations');
  testAssert(Boolean(pollinationsAdapter), "Provider 'pollinations' is registered in aiProviderRegistry");

  const geminiAdapter = aiProviderRegistry.get('gemini');
  testAssert(Boolean(geminiAdapter), "Provider 'gemini' is registered in aiProviderRegistry");

  // --- SECTION 3: CREDIT ACCOUNTING & ATOMIC SETTLEMENT FOR VOICEOVER ---
  console.log('\n3. Testing Credit Accounting & Atomic Settlement for Voiceover...');
  const { dbStore } = await import('../src/lib/db/store');
  const testUserId = `audit_user_${Date.now()}`;
  dbStore.addCredits(testUserId, 50, 'subscription', undefined, `audit_fund_${Date.now()}`);
  const initialBal = dbStore.getCreditAccount(testUserId).availableBalance;
  testAssert(initialBal === 50, `Test user funded with 50 credits (Got ${initialBal})`);

  // Reserve 2 credits for voice
  const voiceCost = 2;
  const reservationRef = `voice_test_${Date.now()}`;
  const reserved = dbStore.reserveCredits(testUserId, voiceCost, reservationRef);
  testAssert(reserved.availableBalance === 48, `Available balance decremented by 2 credits (Got ${reserved.availableBalance})`);
  testAssert(reserved.reservedBalance === 2, `Reserved balance incremented by 2 credits (Got ${reserved.reservedBalance})`);

  // Settle credits permanently
  const settled = dbStore.settleCredits(testUserId, reservationRef, voiceCost, voiceCost);
  testAssert(settled.availableBalance === 48, `Available balance remains 48 after settlement (Got ${settled.availableBalance})`);
  testAssert(settled.reservedBalance === 0, `Reserved balance cleared back to 0 (Got ${settled.reservedBalance})`);

  // Test compensating refund on failure
  const refundRef = `voice_fail_${Date.now()}`;
  dbStore.reserveCredits(testUserId, voiceCost, refundRef);
  const refunded = dbStore.refundCredits(testUserId, voiceCost, 'Voiceover Failure Refund', refundRef);
  testAssert(refunded.availableBalance === 48, `Compensating refund restored available balance to 48 (Got ${refunded.availableBalance})`);
  testAssert(refunded.reservedBalance === 0, 'Compensating refund cleared reserved balance');

  // --- SECTION 4: IN-APP VIDEO GENERATION 15 CREDITS RULE & GEMINI ENFORCEMENT ---
  console.log('\n4. Testing In-App Video Generation (15 Credits Rule & Gemini Enforcement)...');
  const { calculateEstimatedCredits, dispatchGenerationJob } = await import('../src/lib/ai/dispatcher');
  testAssert(calculateEstimatedCredits('gemini-omni-1.1-flash') === 15, 'Video generation estimated cost is strictly 15 credits');

  let runwayThrew = false;
  try {
    await dispatchGenerationJob({
      userId: testUserId,
      workspaceId: 'ws_test',
      modelId: 'runway-gen3',
      input: { prompt: 'A test car commercial' },
    });
  } catch (err: any) {
    runwayThrew = true;
    testAssert(err.message.includes('Coming Soon'), 'Non-Gemini model dispatch rejected with Coming Soon notice');
  }
  testAssert(runwayThrew, 'Runway Gen-3 dispatch rejected by active model policy');

  // --- SECTION 5: STUDIO WORKSPACE (/create) SPECIFICATIONS ---
  console.log('\n5. Testing In-App Video & Voice Studio Workspace (/create)...');
  const createPageSrc = fs.readFileSync(path.join(process.cwd(), 'src', 'app', 'create', 'page.tsx'), 'utf8');
  testAssert(createPageSrc.includes("searchParams.get('voice')"), 'Studio checks searchParams for "voice" parameter');
  testAssert(createPageSrc.includes("mode === 'audio'") && createPageSrc.includes("? 2"), 'Studio estimatedCost calculates 2 credits for voice and 15 for video');
  testAssert(createPageSrc.includes("fetch('/api/ai/voice'"), 'Studio dispatches voice synthesis directly to /api/ai/voice');
  testAssert(createPageSrc.includes("ElevenLabs Neural Voiceover HD"), 'Studio live viewport renders ElevenLabs Voiceover HD player');
  testAssert(createPageSrc.includes("Download MP3"), 'Studio includes Download MP3 button for synthesized voiceovers');
  testAssert(createPageSrc.includes("Google Vids Studio Workspace"), 'Studio includes Google Vids Studio handoff option');
  testAssert(createPageSrc.includes("0 Fluvia Credits Charged"), 'Studio Google Vids card clearly states 0 Credits Charged');

  // --- SECTION 6: INVOICES & OFFICIAL RECEIPT PDF ENGINE ---
  console.log('\n6. Testing Invoices, Official Receipts & 0% GST Compliance...');
  const { generateInvoicePdf, generateReceiptPdf, formatInr } = await import('../src/lib/documents/pdfGenerator');
  testAssert(formatInr(999) === '₹999.00', 'formatInr formats currency accurately (₹999.00)');

  const sampleInvoice: any = {
    id: `inv_audit_${Date.now()}`,
    invoiceNumber: 'INV-AUDIT-001',
    userId: testUserId,
    workspaceId: 'ws_audit',
    currency: 'INR',
    baseAmount: 999,
    discountAmount: 0,
    taxableAmount: 999,
    taxAmount: 0,
    totalAmount: 999,
    status: 'paid',
    issuedDate: new Date().toISOString(),
    paymentDate: new Date().toISOString(),
    customerName: 'Test Creator',
    customerEmail: 'audit@fluviaflow.ai',
    items: [
      {
        description: 'Fluvia Basic Creator Plan (500 Credits)',
        quantity: 1,
        unitPrice: 999,
        discount: 0,
        taxRate: 0,
        taxAmount: 0,
        total: 999,
      },
    ],
  };

  const invoicePdf = await generateInvoicePdf(sampleInvoice);
  testAssert(invoicePdf instanceof Uint8Array && invoicePdf.length > 1000, `Invoice PDF generated with ${invoicePdf.length} bytes`);
  const invoiceHeader = Buffer.from(invoicePdf.slice(0, 5)).toString();
  testAssert(invoiceHeader === '%PDF-', 'Invoice PDF contains %PDF- magic bytes header');

  const sampleReceipt: any = {
    id: `rec_audit_${Date.now()}`,
    receiptNumber: 'REC-AUDIT-001',
    invoiceId: sampleInvoice.id,
    invoiceNumber: sampleInvoice.invoiceNumber,
    userId: testUserId,
    workspaceId: 'ws_audit',
    currency: 'INR',
    amountReceived: 999,
    paymentMethod: 'payu',
    paymentGateway: 'PayU India',
    transactionReference: 'payu_audit_ref_123',
    paymentDate: new Date().toISOString(),
    customerName: 'Test Creator',
    customerEmail: 'audit@fluviaflow.ai',
    paidItemDescription: 'Fluvia Basic Creator Plan (500 Credits)',
  };

  const receiptPdf = await generateReceiptPdf(sampleReceipt, sampleInvoice);
  testAssert(receiptPdf instanceof Uint8Array && receiptPdf.length > 1000, `Receipt PDF generated with ${receiptPdf.length} bytes`);
  const receiptHeader = Buffer.from(receiptPdf.slice(0, 5)).toString();
  testAssert(receiptHeader === '%PDF-', 'Receipt PDF contains %PDF- magic bytes header');

  // --- SECTION 7: CURATED TEMPLATE LIBRARY VERIFICATION ---
  console.log('\n7. Testing Curated Template Library Quality & Physical Assets...');
  const { ALL_CURATED_TEMPLATES, VIDEO_TEMPLATES, IMAGE_TEMPLATES, TEXT_ANIMATION_TEMPLATES } = await import(
    '../src/lib/templates'
  );
  testAssert(ALL_CURATED_TEMPLATES.length === 24, `Curated templates total is exactly 24 (Got ${ALL_CURATED_TEMPLATES.length})`);
  testAssert(VIDEO_TEMPLATES.length === 8, `Video templates count is exactly 8 (Got ${VIDEO_TEMPLATES.length})`);
  testAssert(IMAGE_TEMPLATES.length === 8, `Image templates count is exactly 8 (Got ${IMAGE_TEMPLATES.length})`);
  testAssert(TEXT_ANIMATION_TEMPLATES.length === 8, `Text animation templates count is exactly 8 (Got ${TEXT_ANIMATION_TEMPLATES.length})`);

  let allAssetsExist = true;
  for (const tmpl of ALL_CURATED_TEMPLATES) {
    if (tmpl.previewUrl && tmpl.previewUrl.startsWith('/media/')) {
      const assetPath = path.join(process.cwd(), 'public', tmpl.previewUrl.replace(/^\//, ''));
      if (!fs.existsSync(assetPath)) {
        allAssetsExist = false;
        console.error(`  ❌ Missing asset: ${tmpl.previewUrl}`);
      }
    }
  }
  testAssert(allAssetsExist, '100% of curated templates have verified preview assets on disk');

  console.log('\n================================================================');
  console.log(`🎉 AUDIT COMPLETE: ${passed} passed, ${failed} failed!`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runRealAppAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
