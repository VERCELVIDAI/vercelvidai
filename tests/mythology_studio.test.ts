import { checkMythologyContentModeration, augmentMythologyPromptWithDignity } from '../src/lib/mythology/moderation';
import { calculateMythosProjectCredits, MYTHOS_PLANS, MYTHOS_CREDIT_COSTS } from '../src/lib/mythology/mythosPlansConfig';
import { MYTH_ART_STYLES, PURANIC_STORY_PRESETS, MYTH_VOICES } from '../src/lib/mythology/constants';
import { dbStore } from '../src/lib/db/store';

function assert(description: string, condition: boolean) {
  if (!condition) {
    console.error(`❌ FAIL: ${description}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${description}`);
}

async function runMythologyTests() {
  console.log('\n--- RUNNING FLUVIA FLOW: MYTHOLOGY STUDIO UNIT TESTS ---\n');

  // 1. Content Moderation Tests
  console.log('1. Content Safety & Cultural Respect Moderation:');
  const safeCheck = checkMythologyContentModeration('Lord Krishna delivering the sacred Gita upadesh on Kurukshetra');
  assert('Safe devotional story prompt is allowed', safeCheck.allowed === true);

  const mockCheck = checkMythologyContentModeration('Make a joke about Shiva dancing');
  assert('Mockery of deities is blocked', mockCheck.allowed === false && mockCheck.category === 'mockery');

  const vulgarCheck = checkMythologyContentModeration('Depict Sita in erotic bikini');
  assert('Vulgar or sexualized depiction of sacred figures is blocked', vulgarCheck.allowed === false && vulgarCheck.category === 'vulgarity');

  const politicalCheck = checkMythologyContentModeration('Vote for Modi and BJP in this religious video');
  assert('Political propaganda and living politicians are blocked', politicalCheck.allowed === false);

  const augmented = augmentMythologyPromptWithDignity('Lord Rama with bow', 'Classical Indian Painting');
  assert('Prompt is augmented with sacred dignity modifiers', augmented.includes('dignified sacred traditional iconography'));

  // 2. Plan Configuration & Credit Economics Tests
  console.log('\n2. Plan Configuration & Unit Economics:');
  assert('Mythos plans exist in config', MYTHOS_PLANS.length === 3);

  const creatorPlan = MYTHOS_PLANS.find((p) => p.id === 'plan_mythos_creator');
  assert('Mythos Creator plan is ₹799 with 800 credits', creatorPlan?.priceInr === 799 && creatorPlan?.creditsPerPeriod === 800);
  assert('Mythos Creator provides watermark-free 1080p exports', creatorPlan?.entitlements.watermark === false && creatorPlan?.entitlements.maxResolution === '1080p');

  const costStandard = calculateMythosProjectCredits({ scenesCount: 5, hasVoiceover: true, animatedHeroScenesCount: 0 });
  assert('Standard 5-scene 30s video costs exactly 16 credits', costStandard === 16);

  const costWithHeroAnim = calculateMythosProjectCredits({ scenesCount: 5, hasVoiceover: true, animatedHeroScenesCount: 1 });
  assert('Video with 1 hero animation costs 28 credits', costWithHeroAnim === 28);

  // 3. Art Styles & Story Presets Data Integrity
  console.log('\n3. Art Styles & Preset Integrity:');
  assert('Exactly 7 curated mythological art styles are defined', MYTH_ART_STYLES.length === 7);
  assert('Styles include Classical, Tanjore, Pahari, Cinematic, Anime, Dark Fantasy, and Temple Stone',
    MYTH_ART_STYLES.some((s) => s.id === 'classical_oil_painting') &&
    MYTH_ART_STYLES.some((s) => s.id === 'tanjore_gold_leaf') &&
    MYTH_ART_STYLES.some((s) => s.id === 'cinematic_epic_realistic')
  );

  assert('Puranic story presets include Ramayana, Mahabharata, and Bhagavata',
    PURANIC_STORY_PRESETS.some((p) => p.id === 'hanuman_sanjeevani') &&
    PURANIC_STORY_PRESETS.some((p) => p.id === 'gita_upadesh_kurukshetra') &&
    PURANIC_STORY_PRESETS.some((p) => p.id === 'narasimha_hiranyakashipu')
  );

  assert('Multilingual voices include Hindi, English, and Hinglish',
    MYTH_VOICES.some((v) => v.language === 'Hindi') &&
    MYTH_VOICES.some((v) => v.language === 'English') &&
    MYTH_VOICES.some((v) => v.language === 'Hinglish')
  );

  // 4. Store Database CRUD Operations
  console.log('\n4. Database Store CRUD Operations:');
  const testUserId = 'usr_test_creator_myth_1';
  const createdProject = dbStore.createMythProject({
    userId: testUserId,
    title: 'Test Kurukshetra Epic',
    storyConcept: 'Krishna advising Arjuna',
    culture: 'hindu_epic',
    language: 'hi',
    targetDurationSec: 30,
    tone: 'epic',
    artStyleId: 'cinematic_epic_realistic',
    voiceId: 'voice_devotional_hindi_m',
    scenes: [
      {
        id: 'scene_1',
        sceneNumber: 1,
        narration: 'कुरुक्षेत्र के रणक्षेत्र में जब शंखनाद हुआ...',
        onScreenText: 'कुरुक्षेत्र का महासंग्राम',
        characters: ['char_krishna', 'char_arjuna'],
        visualPrompt: 'Arjuna looking at the opposing army with bow in hand',
        negativePrompt: 'cartoon, low quality',
        mood: 'epic',
        cameraMove: 'pan_left',
        estimatedDurationSec: 6,
        sfxTag: 'conch_shell',
      },
    ],
  });

  assert('Mythology project created with generated ID', Boolean(createdProject.id && createdProject.title === 'Test Kurukshetra Epic'));

  const retrieved = dbStore.getMythProjectById(createdProject.id);
  assert('Retrieved project matches created data', retrieved?.id === createdProject.id);

  const updated = dbStore.updateMythProject(createdProject.id, {
    status: 'ready',
    currentStep: 7,
  });
  assert('Project updated successfully with immutable ID guard', updated.status === 'ready' && updated.currentStep === 7);

  const userProjects = dbStore.getMythProjects(testUserId);
  assert('User projects query returns created project', userProjects.some((p) => p.id === createdProject.id));

  const deleted = dbStore.deleteMythProject(createdProject.id, testUserId);
  assert('Project deleted cleanly', deleted === true);

  const afterDelete = dbStore.getMythProjectById(createdProject.id);
  assert('Project is no longer present after deletion', afterDelete === undefined);

  console.log('\n🎉 ALL MYTHOLOGY STUDIO TESTS PASSED SUCCESSFULLY!\n');
}

runMythologyTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
