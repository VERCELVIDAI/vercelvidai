import fs from 'fs';
import path from 'path';
import { COOL_GOOGLE_VIDS_TEMPLATES } from '../src/components/dashboard/GoogleVidsPromoPopup';

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failed++;
  }
}

console.log('================================================================');
console.log('🧪 RUNNING GOOGLE VIDS POPUP COOL TEMPLATES TEST SUITE');
console.log('================================================================\n');

// 1. Cool Templates Metadata & Variety
console.log('1. Testing Cool Templates Metadata & Variety...');
assert('COOL_GOOGLE_VIDS_TEMPLATES has at least 6 templates', COOL_GOOGLE_VIDS_TEMPLATES.length >= 6);

for (const tmpl of COOL_GOOGLE_VIDS_TEMPLATES) {
  assert(`Template ${tmpl.id} has valid title ("${tmpl.title}")`, Boolean(tmpl.title && tmpl.title.length > 5));
  assert(`Template ${tmpl.id} has category ("${tmpl.category}")`, Boolean(tmpl.category));
  assert(`Template ${tmpl.id} has badge ("${tmpl.badge}")`, Boolean(tmpl.badge));
  assert(`Template ${tmpl.id} has aspect ("${tmpl.aspect}")`, Boolean(tmpl.aspect === '16:9' || tmpl.aspect === '9:16'));
  assert(`Template ${tmpl.id} has emoji ("${tmpl.emoji}")`, Boolean(tmpl.emoji));
  assert(`Template ${tmpl.id} has detailed prompt (> 50 chars)`, Boolean(tmpl.prompt && tmpl.prompt.length > 50));
  assert(`Template ${tmpl.id} has duration ("${tmpl.duration}")`, Boolean(tmpl.duration));
}

// 2. GoogleVidsPromoPopup Component Verification
console.log('\n2. Testing GoogleVidsPromoPopup Component...');
const promoPopupCode = fs.readFileSync(path.join(process.cwd(), 'src/components/dashboard/GoogleVidsPromoPopup.tsx'), 'utf-8');
assert('GoogleVidsPromoPopup renders Cool Video Templates section', promoPopupCode.includes('Cool Video Templates for Google Vids'));
assert('GoogleVidsPromoPopup includes 1-click Use Template in Studio button', promoPopupCode.includes('Use Template in Studio (15 cr)'));
assert('GoogleVidsPromoPopup includes Launch Google Vids (0 cr) button', promoPopupCode.includes('Launch Google Vids (0 cr)'));
assert('GoogleVidsPromoPopup includes prompt copy feedback', promoPopupCode.includes('handleCopyPrompt') || promoPopupCode.includes('setCopiedPrompt'));
assert('GoogleVidsPromoPopup listens to open-google-vids-popup custom event', promoPopupCode.includes("open-google-vids-popup"));
assert('GoogleVidsPromoPopup supports template selection', promoPopupCode.includes('selectedTemplate') && promoPopupCode.includes('setSelectedTemplate'));

// 3. FloatingPromptComposer Google Vids Modal Verification
console.log('\n3. Testing FloatingPromptComposer Google Vids Modal...');
const composerCode = fs.readFileSync(path.join(process.cwd(), 'src/components/templates/FloatingPromptComposer.tsx'), 'utf-8');
assert('FloatingPromptComposer includes GOOGLE_VIDS_STARTER_TEMPLATES', composerCode.includes('GOOGLE_VIDS_STARTER_TEMPLATES'));
assert('FloatingPromptComposer renders Cool Starter Templates selector', composerCode.includes('Cool Starter Templates for Google Vids'));
assert('FloatingPromptComposer allows 1-click prompt override', composerCode.includes('setVidsPromptOverride'));

// 4. DiscoveryDetailModal Google Vids Modal Verification
console.log('\n4. Testing DiscoveryDetailModal Google Vids Modal...');
const detailModalCode = fs.readFileSync(path.join(process.cwd(), 'src/components/templates/DiscoveryDetailModal.tsx'), 'utf-8');
assert('DiscoveryDetailModal includes Featured Cool Video Templates', detailModalCode.includes('Featured Cool Video Templates'));
assert('DiscoveryDetailModal allows switching active template prompt', detailModalCode.includes('setActiveVidsPrompt'));

// 5. Dashboard GoogleVidsCard Integration Verification
console.log('\n5. Testing GoogleVidsCard Integration...');
const cardCode = fs.readFileSync(path.join(process.cwd(), 'src/components/dashboard/GoogleVidsCard.tsx'), 'utf-8');
assert('GoogleVidsCard dispatches open-google-vids-popup event', cardCode.includes("open-google-vids-popup"));
assert('GoogleVidsCard includes Cool Templates Popup button', cardCode.includes('Cool Templates Popup'));

// 6. Create Studio URL Parameter Handling
console.log('\n6. Testing /create Studio URL Parameter Handling...');
const createCode = fs.readFileSync(path.join(process.cwd(), 'src/app/create/page.tsx'), 'utf-8');
assert('/create supports searchParams.get("template")', createCode.includes('searchParams.get(\'template\')'));
assert('/create loads template data automatically when template param is present', createCode.includes('handleLoadTemplate(found)'));

console.log('\n================================================================');
console.log(`GOOGLE VIDS POPUP TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
