import { TEMPLATES_DATA, TEMPLATE_EVENTS, getTemplateById, getTemplateBySlug } from '../src/lib/templates';
import { dbStore } from '../src/lib/db/store';

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

async function runTemplateDiscoveryTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING FLUVIA FLOW AI VIDEO TEMPLATES DISCOVERY TESTS');
  console.log('================================================================\n');

  // 1. Template Schema & Rich Fields
  console.log('1. Testing Template Schema & Creative Metadata...');
  assert('TEMPLATES_DATA contains at least 26 templates', TEMPLATES_DATA.length >= 26);

  const sample = TEMPLATES_DATA[0];
  assert('Template has valid id', Boolean(sample.id));
  assert('Template has valid title', Boolean(sample.title));
  assert('Template has detailed AI generation prompt', Boolean(sample.prompt && sample.prompt.length > 20));
  assert('Template has creatorName with @ handle', Boolean(sample.creatorName && sample.creatorName.startsWith('@')));
  assert('Template has creatorAvatar URL', Boolean(sample.creatorAvatar && sample.creatorAvatar.startsWith('http')));
  assert('Template has positive likesCount', typeof sample.likesCount === 'number' && sample.likesCount >= 0);
  assert('Template has valid aspect ratio', ['16:9', '9:16', '1:1', '4:5', '2.39:1'].includes(sample.aspect));
  assert('Template has video preview URL', Boolean(sample.videoPreview && sample.videoPreview.endsWith('.mp4')));

  // 2. Aspect Ratio Variety (Multi-column Masonry Requirement)
  console.log('\n2. Testing Multi-Aspect Ratio Variety for Dense Masonry Grid...');
  const aspects = new Set(TEMPLATES_DATA.map((t) => t.aspect));
  assert('Templates include 16:9 Landscape', aspects.has('16:9'));
  assert('Templates include 9:16 Vertical Portrait', aspects.has('9:16'));
  assert('Templates include 1:1 Square', aspects.has('1:1'));
  assert('Templates include 4:5 Social Portrait', aspects.has('4:5'));
  assert('Templates include 2.39:1 Anamorphic Cinema', aspects.has('2.39:1'));

  // 3. Category Coverage - 12 Curated Commercial Categories
  console.log('\n3. Testing Commercial Category Representation...');
  const categories = TEMPLATES_DATA.map((t) => t.category.toLowerCase());
  assert('Includes Automotive category', categories.some((c) => c.includes('automotive')));
  assert('Includes AI Influencer/UGC category', categories.some((c) => c.includes('influencer') || c.includes('ugc')));
  assert('Includes Product Commercial category', categories.some((c) => c.includes('product') || c.includes('commercial')));
  assert('Includes Food, Beverage & Restaurant category', categories.some((c) => c.includes('food') || c.includes('beverage')));
  assert('Includes Real Estate & Architecture category', categories.some((c) => c.includes('real estate') || c.includes('architecture')));
  assert('Includes Technology & SaaS Explainer category', categories.some((c) => c.includes('technology') || c.includes('saas')));
  assert('Includes Fashion, Beauty & Lifestyle category', categories.some((c) => c.includes('fashion') || c.includes('beauty')));
  assert('Generic filler categories (pets, cartoons, arbitrary anime) completely removed', !categories.some((c) => c === 'pets & wildlife' || c === '3d cartoon & animation'));

  // 4. Creative Events & Challenges
  console.log('\n4. Testing Creative Challenges & Seasonal Events...');
  assert('TEMPLATE_EVENTS has active challenges', TEMPLATE_EVENTS.length >= 3);
  const firstEvent = TEMPLATE_EVENTS[0];
  assert('Event has title and subtitle', Boolean(firstEvent.title && firstEvent.subtitle));
  assert('Event has prize pool defined', Boolean(firstEvent.prizePool && firstEvent.prizePool.includes('Credits')));
  assert('Event has featured remixable prompt', Boolean(firstEvent.featuredPrompt && firstEvent.featuredPrompt.length > 30));
  assert('Event has clear submission rules', firstEvent.rules.length > 0);

  // 5. Likes System & Persistence in dbStore
  console.log('\n5. Testing Persistent Template Likes in dbStore...');
  const testUserId = `usr_test_liker_${Date.now()}`;
  const targetTemplateId = sample.id;
  const initialCount = dbStore.getTemplateLikeCount(targetTemplateId, sample.likesCount);

  // First like
  const likeResult1 = dbStore.toggleTemplateLike(targetTemplateId, testUserId, sample.likesCount);
  assert('First like toggle returns liked = true', likeResult1.liked === true);
  assert('Like count increments by 1', likeResult1.likeCount === initialCount + 1);
  assert('isTemplateLiked returns true for user', dbStore.isTemplateLiked(targetTemplateId, testUserId) === true);

  // Unlike
  const likeResult2 = dbStore.toggleTemplateLike(targetTemplateId, testUserId, sample.likesCount);
  assert('Second like toggle returns liked = false (unlike)', likeResult2.liked === false);
  assert('Like count decrements back to original', likeResult2.likeCount === initialCount);
  assert('isTemplateLiked returns false after unlike', dbStore.isTemplateLiked(targetTemplateId, testUserId) === false);

  // 6. Creator Follows & Persistence in dbStore
  console.log('\n6. Testing Creator Follows System in dbStore...');
  const targetCreatorId = sample.creatorId;

  const followResult1 = dbStore.toggleFollowCreator(targetCreatorId, testUserId);
  assert('First follow toggle returns following = true', followResult1.following === true);
  assert('isFollowingCreator returns true', dbStore.isFollowingCreator(targetCreatorId, testUserId) === true);

  const followResult2 = dbStore.toggleFollowCreator(targetCreatorId, testUserId);
  assert('Second follow toggle returns following = false (unfollow)', followResult2.following === false);
  assert('isFollowingCreator returns false after unfollow', dbStore.isFollowingCreator(targetCreatorId, testUserId) === false);

  // 7. Custom Template Publication
  console.log('\n7. Testing Custom Template Publication in dbStore...');
  const customTmpl = dbStore.publishCustomTemplate({
    title: 'Neon Cyber Drift 2099',
    description: 'Ultra-fast drift through futuristic Shibuya rain',
    prompt: 'Hyper-realistic anime cyberpunk drift car leaving glowing cyan light trails, reflective rainy asphalt, 8k 60fps',
    category: 'Cinematic Automotive',
    aspect: '16:9',
    creatorId: testUserId,
    creatorName: '@cyber_pilot',
  });

  assert('Published template receives a unique ID', Boolean(customTmpl.id && customTmpl.id.startsWith('tmpl_pub_')));
  assert('Published template stores prompt faithfully', customTmpl.prompt.includes('cyberpunk drift'));
  assert('Published template appears in dbStore.getPublishedTemplates()', dbStore.getPublishedTemplates().some((t) => t.id === customTmpl.id));

  console.log('\n================================================================');
  console.log(`TEMPLATE DISCOVERY TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runTemplateDiscoveryTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
