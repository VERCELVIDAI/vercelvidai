export type MythologyCulture =
  | 'hindu_vedic'
  | 'hindu_puranic'
  | 'hindu_epic'
  | 'greek'
  | 'norse'
  | 'egyptian';

export type MythologyTone =
  | 'devotional'
  | 'epic'
  | 'heroic'
  | 'cosmic'
  | 'kids_moral'
  | 'educational'
  | 'dark_fantasy';

export type MythologyLanguage = 'hi' | 'en' | 'hi-en';

export type CameraMove =
  | 'pan_left'
  | 'pan_right'
  | 'zoom_in'
  | 'zoom_out'
  | 'orbital_slow'
  | 'celestial_tilt';

export type SfxTag =
  | 'conch_shell'
  | 'temple_bell'
  | 'thunder_strike'
  | 'flute_melody'
  | 'war_drums'
  | 'fire_whoosh'
  | 'divine_chime';

export interface MythCharacter {
  id: string;
  userId?: string;
  name: string;
  culture: MythologyCulture;
  archetype: 'god' | 'avatar' | 'demon' | 'sage' | 'warrior' | 'devotee' | 'creature';
  appearance: string;
  attire: string;
  weaponOrVahana: string;
  colorPalette: string[];
  referenceImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MythScene {
  id: string;
  sceneNumber: number;
  narration: string;
  onScreenText: string;
  characters: string[];
  visualPrompt: string;
  negativePrompt: string;
  mood: 'devotional' | 'heroic' | 'ferocious' | 'peaceful' | 'cosmic' | 'sorrowful';
  cameraMove: CameraMove;
  estimatedDurationSec: number;
  sfxTag: SfxTag;
  musicCue?: string;
  imageUrl?: string;
  animatedVideoUrl?: string;
  isHeroSceneAnimated?: boolean;
}

export interface WordTimestamp {
  word: string;
  startSec: number;
  endSec: number;
}

export interface MythAudioTrack {
  audioUrl: string;
  durationSec: number;
  voiceId: string;
  timestamps: WordTimestamp[];
}

export interface ExportedVideoRecord {
  aspectRatio: '9:16' | '4:5' | '1:1' | '16:9';
  resolution: '720p' | '1080p';
  videoUrl: string;
  hasWatermark: boolean;
  createdAt: string;
}

export interface MythProject {
  id: string;
  userId: string;
  workspaceId: string;
  title: string;
  storyConcept: string;
  sourceNote?: string;
  culture: MythologyCulture;
  language: MythologyLanguage;
  targetDurationSec: 15 | 30 | 45 | 60;
  tone: MythologyTone;
  artStyleId: string;
  voiceId: string;
  bgmMoodId: string;
  characterBible: MythCharacter[];
  scenes: MythScene[];
  audioTrack?: MythAudioTrack;
  status: 'draft' | 'scripted' | 'generating_visuals' | 'rendering' | 'ready' | 'failed';
  currentStep: number;
  exportedVideos?: ExportedVideoRecord[];
  thumbnailUrl?: string;
  seriesId?: string;
  viralPack?: {
    suggestedTitles: string[];
    description: string;
    hashtags: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface MythSeries {
  id: string;
  userId: string;
  title: string;
  description: string;
  culture: MythologyCulture;
  sharedStyleId: string;
  sharedVoiceId: string;
  sharedCharacterIds: string[];
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MythArtStyle {
  id: string;
  name: string;
  nameHindi: string;
  era: string;
  description: string;
  promptPrefix: string;
  negativePrompt: string;
  previewImage: string;
  badge?: string;
}

export interface PuranicStoryPreset {
  id: string;
  title: string;
  titleHindi: string;
  source: string;
  culture: MythologyCulture;
  defaultTone: MythologyTone;
  summary: string;
  hookLine: string;
  characters: MythCharacter[];
  suggestedPrompt: string;
}
