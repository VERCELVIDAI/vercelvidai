export interface ModerationResult {
  allowed: boolean;
  reason?: string;
  category?: 'mockery' | 'vulgarity' | 'communal_hate' | 'political_propaganda' | 'living_persons';
}

const DISALLOWED_PATTERNS: Array<{ regex: RegExp; category: ModerationResult['category']; reason: string }> = [
  {
    regex: /\b(mocking|ridicule|insult|joke about|parody of|degrade|clown)\b.*\b(shiva|krishna|rama|durga|hanuman|ganesha|vishnu|allah|jesus|buddha|guru nanak)\b/i,
    category: 'mockery',
    reason: 'Mockery, ridicule, or intentional disrespect toward deities and sacred figures is strictly prohibited.',
  },
  {
    regex: /\b(nude|naked|sexual|bikini|lingerie|erotic|sensual|breast|cleavage)\b.*\b(sita|radha|parvati|durga|lakshmi|saraswati|kali)\b/i,
    category: 'vulgarity',
    reason: 'Vulgar, sexualized, or inappropriate depictions of sacred divine figures are strictly blocked.',
  },
  {
    regex: /\b(nude|naked|sexual|erotic)\b/i,
    category: 'vulgarity',
    reason: 'Sexually explicit or vulgar imagery is not permitted in the Mythology Studio.',
  },
  {
    regex: /\b(hate|kill all|destroy all|exterminate|wipe out|jihad against|kafir|infidel)\b/i,
    category: 'communal_hate',
    reason: 'Content promoting communal discord, religious hatred, or violence is strictly blocked.',
  },
  {
    regex: /\b(modi|rahul gandhi|trump|biden|putin|netanyahu|yogi|kejriwal)\b/i,
    category: 'living_persons',
    reason: 'Depiction of living politicians and real-world political personalities is not permitted in the Mythology Studio.',
  },
  {
    regex: /\b(election|vote for|bjp|congress|aap|bjp propaganda|rss|communist party)\b/i,
    category: 'political_propaganda',
    reason: 'Political campaigning and propaganda under the guise of religious content is prohibited.',
  },
];

export function checkMythologyContentModeration(text: string): ModerationResult {
  if (!text || typeof text !== 'string') return { allowed: true };
  const clean = text.toLowerCase();

  for (const rule of DISALLOWED_PATTERNS) {
    if (rule.regex.test(clean)) {
      return {
        allowed: false,
        reason: rule.reason,
        category: rule.category,
      };
    }
  }

  return { allowed: true };
}

export function augmentMythologyPromptWithDignity(basePrompt: string, stylePrefix: string): string {
  const dignityModifiers = 'dignified sacred traditional iconography, graceful reverent composition, classical respectful attire, celestial radiance, authentic spiritual heritage';
  return `${stylePrefix}, ${basePrompt}, ${dignityModifiers}`;
}

export const CULTURAL_DISCLAIMER_TEXT =
  'AI-assisted artistic interpretation based on traditional sacred narratives. Regional, textual, and community traditions may differ. Crafted with cultural reverence.';

export const CULTURAL_DISCLAIMER_HINDI =
  'यह वीडियो पारंपरिक धार्मिक व पौराणिक कथाओं पर आधारित एआई-सृजित कलात्मक प्रस्तुति है। विभिन्न क्षेत्रीय परंपराओं में भिन्नता हो सकती है।';
