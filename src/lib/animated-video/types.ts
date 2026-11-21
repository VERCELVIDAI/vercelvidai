export type AnimationStyleId =
  | 'flat-vector'
  | 'comic-art'
  | 'mythology'
  | 'chalkboard'
  | 'glow-sketch'
  | 'pixel-art'
  | 'lyrics-tower';

export interface AnimationStyle {
  id: AnimationStyleId;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  badge: string;
  tags: string[];
  samplePrompt: string;
  negativePrompt: string;
  previewImage: string;
  previewVideo?: string;
  recommendedAspect: '9:16' | '16:9' | '1:1';
}

export interface AnimatedScene {
  scene: number;
  duration: number; // in seconds
  narration: string;
  on_screen_text?: string;
  image_prompt: string;
  camera?: 'zoom_in' | 'zoom_out' | 'pan_left' | 'pan_right' | 'static';
  sfx?: string;
  imageUrl?: string;
}

export interface AnimatedVideoProject {
  id: string;
  title: string;
  styleId: AnimationStyleId;
  topic: string;
  language: 'hi' | 'en' | 'hi-en';
  aspectRatio: '9:16' | '1:1' | '16:9';
  voiceId: string;
  scenes: AnimatedScene[];
  audioUrl?: string;
  exportedVideoUrl?: string;
  status: 'draft' | 'scripted' | 'rendering' | 'ready' | 'failed';
  createdAt: string;
  updatedAt: string;
}
