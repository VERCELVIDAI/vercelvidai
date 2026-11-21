import { AnimationStyle, AnimationStyleId } from './types';

export const MASTER_AI_PROMPTS: Record<AnimationStyleId, string> = {
  mythology: `You are a viral mythology short video scriptwriter and director. 
Given a topic or legend from Indian epics (Ramayana, Mahabharata, Shiva Purana, Bhagavata Purana), generate a 3-to-4 scene vertical 9:16 script in valid JSON format.
Each scene must have:
- "scene": number (1, 2, 3...)
- "say": the spoken Hindi or English narration line (natural, engaging, dramatic, 15-25 words)
- "quote": the on-screen karaoke caption text (concise, powerful, Devanagari or English)
- "on": key highlighted keyword or deity name
- "accent": boolean (true for dramatic emphasis)
- "setting": visual environment description
- "duration": seconds (4 to 6 seconds per scene)
- "image_prompt": detailed visual prompt for Raja Ravi Varma oil painting / Tanjore gold-leaf art style
- "camera": "zoom_in" | "zoom_out" | "pan_left" | "pan_right"

If the user types IDEAS, return 10 high-curiosity viral mythology hook ideas.
Otherwise, return ONLY the raw JSON array of scenes without markdown ticks.`,

  'flat-vector': `You are a modern explainer video director.
Given a topic, generate a 3-to-4 scene vertical 9:16 script in valid JSON format.
Each scene must have:
- "scene": number (1, 2, 3...)
- "say": clear, punchy narration line (English or Hindi)
- "quote": highlighted on-screen takeaway
- "on": key action keyword
- "setting": modern flat vector isometric scene description
- "duration": seconds (4 to 6)
- "image_prompt": clean 2D vector shapes, smooth gradients, crisp modern iconography, dribbble style
- "camera": "zoom_in" | "zoom_out" | "pan_left" | "pan_right"

Return ONLY the raw JSON array of scenes.`,

  'comic-art': `You are a retro comic book video creator.
Given a topic, generate a 3-to-4 scene vertical 9:16 script in valid JSON format.
Each scene must have:
- "scene": number (1, 2, 3...)
- "say": energetic, dramatic comic narration
- "quote": punchy comic sound effect or speech bubble text (e.g., "DID YOU KNOW?!", "WHOOSH!")
- "on": key power word
- "setting": vintage comic book panel with halftone dots and bold black outlines
- "duration": seconds (4 to 6)
- "image_prompt": vintage comic panel, halftone dots, thick black inking, pop art primary colors
- "camera": "zoom_in" | "zoom_out" | "pan_left" | "pan_right"

Return ONLY the raw JSON array of scenes.`,

  chalkboard: `You are an educational science & tech video director.
Given a topic, generate a 3-to-4 scene vertical 9:16 script in valid JSON format.
Each scene must have:
- "scene": number (1, 2, 3...)
- "say": fascinating educational explanation (Hindi or English)
- "quote": chalkboard diagram title or math formula
- "on": core scientific concept
- "setting": green slate chalkboard with white and pastel chalk sketches
- "duration": seconds (4 to 6)
- "image_prompt": hand-drawn chalk illustration on green blackboard, diagrams, binary code, educational sketches
- "camera": "zoom_in" | "zoom_out" | "pan_left" | "pan_right"

Return ONLY the raw JSON array of scenes.`,

  'glow-sketch': `You are a minimalist cyberpunk visual artist.
Given a topic, generate a 3-to-4 scene vertical 9:16 script in valid JSON format.
Each scene must have:
- "scene": number (1, 2, 3...)
- "say": deep, philosophical or futuristic narration
- "quote": minimalist neon glowing text
- "on": glowing focus word
- "setting": pitch-black void with electric luminous neon line art
- "duration": seconds (4 to 6)
- "image_prompt": minimalist glowing neon wireframe lines on pitch black background, cyber zen bloom
- "camera": "zoom_in" | "zoom_out" | "pan_left" | "pan_right"

Return ONLY the raw JSON array of scenes.`,

  'pixel-art': `You are an 8-bit retro gaming video animator.
Given a topic, generate a 3-to-4 scene vertical 9:16 script in valid JSON format.
Each scene must have:
- "scene": number (1, 2, 3...)
- "say": nostalgic gaming narration
- "quote": arcade pixel text (e.g., "STAGE 1", "LEVEL UP", "GAME OVER")
- "on": arcade power-up keyword
- "setting": 16-bit SNES arcade game level
- "duration": seconds (4 to 6)
- "image_prompt": nostalgic 16-bit pixel art sprite, arcade cabinet CRT scanlines, vibrant chiptune palette
- "camera": "zoom_in" | "zoom_out" | "pan_left" | "pan_right"

Return ONLY the raw JSON array of scenes.`,

  'lyrics-tower': `You are a kinetic typography and lyric video designer.
Given a song or poetic thought, generate a 3-to-4 scene vertical 9:16 script in valid JSON format.
Each scene must have:
- "scene": number (1, 2, 3...)
- "say": emotional poetic or lyrical line
- "quote": vertically stacked Devanagari or English words with glowing color emphasis
- "on": emotional climax word
- "setting": dark aesthetic background with subtle light leaks and kinetic typography tower
- "duration": seconds (4 to 6)
- "image_prompt": vertical stacked typography, cinematic ambient lighting, neon gradient glow, emotional visual atmosphere
- "camera": "zoom_in" | "zoom_out" | "pan_left" | "pan_right"

Return ONLY the raw JSON array of scenes.`,
};

export const ANIMATION_STYLES: AnimationStyle[] = [
  {
    id: 'flat-vector',
    name: 'Flat Vector',
    tagline: 'Colourful explainer graphics',
    description: 'Clean 2D vector shapes, smooth gradients, crisp modern iconography, and minimalist corporate or educational infographics.',
    accentColor: '#3B82F6',
    palette: ['#FBF6EE', '#202E44', '#F97316', '#3B82F6'],
    badge: 'Popular',
    tags: ['1080p vertical', 'Clean 2D', 'Explainer', 'Corporate'],
    samplePrompt: 'Bold colourful flat vector illustration of an animated delivery route with map pin icon and modern UI icons, clean gradients, dribbble style',
    negativePrompt: 'photorealistic, 3D render, messy lines, noisy texture, gritty shadows',
    previewImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    recommendedAspect: '9:16',
  },
  {
    id: 'comic-art',
    name: 'Comic Art',
    tagline: 'Bold comic panels and speech bubbles',
    description: 'Dynamic comic book aesthetic with vintage halftone dots, thick black ink outlines, energetic action bursts, and expressive pop-art speech bubbles.',
    accentColor: '#F97316',
    palette: ['#FAF5EB', '#1F2022', '#FACC15', '#EF4444'],
    badge: 'Hero',
    tags: ['Halftones', 'Action lines', 'Speech bubbles', 'Pop Art'],
    samplePrompt: 'Classic vintage American comic book panel with dynamic action burst, halftone dots, thick black ink outlines, bold pop art primary colors, retro speech bubble',
    negativePrompt: 'photorealistic, soft blur, flat vector, watercolor, dull colors',
    previewImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    recommendedAspect: '9:16',
  },
  {
    id: 'mythology',
    name: 'Mythology',
    tagline: 'Illustrated mythology stories',
    description: 'Richly detailed Indian and world mythology epics inspired by classical Raja Ravi Varma oil paintings, Tanjore gold-leaf, and ancient Puranic scripture iconography.',
    accentColor: '#A855F7',
    palette: ['#1B1736', '#FBBF24', '#8B5CF6', '#F97316'],
    badge: 'Epic',
    tags: ['Devotional', 'Tanjore Gold', 'Puranic', 'Sacred'],
    samplePrompt: 'Lord Shiva in deep cosmic meditation atop snowy Mount Kailash, glowing crescent moon, holy river Ganga, classical Indian oil painting by Raja Ravi Varma, 8k cinematic',
    negativePrompt: 'modern clothes, western caricature, cartoonish disrespect, low quality',
    previewImage: '/media/mythology/mythos-template-1.jpg',
    previewVideo: '/media/mythology/mythos-template-1.mp4',
    recommendedAspect: '9:16',
  },
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    tagline: 'Hand-drawn educational explainers',
    description: 'Green slate-board texture with textured white and pastel chalk sketches, hand-drawn schematics, mathematics formulas, and academic lecture explainers.',
    accentColor: '#10B981',
    palette: ['#274E37', '#FAF7EE', '#FEF08A', '#93C5FD'],
    badge: 'Updated',
    tags: ['Educational', 'Hand-drawn', 'Science', 'Microchip'],
    samplePrompt: 'Detailed hand-drawn green chalkboard schematic of a computer microchip architecture with chalk arrows, binary numbers, and rough white chalk sketches',
    negativePrompt: 'glossy, digital gradients, 3D render, photorealistic, white background',
    previewImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    recommendedAspect: '9:16',
  },
  {
    id: 'glow-sketch',
    name: 'Glow Sketch',
    tagline: 'Minimal glowing line art',
    description: 'Electric neon outlines and luminous wireframe vector sketches set against deep obsidian darkness, creating a sleek cyber-zen aesthetic.',
    accentColor: '#06B6D4',
    palette: ['#0A0A0E', '#E0E7FF', '#FBBF24', '#1E2238'],
    badge: 'Minimal',
    tags: ['Neon lines', 'Cyber Zen', 'Minimalist', 'Dark Mode'],
    samplePrompt: 'Minimalist glowing cyan neon wireframe line art of a human brain connecting with neural network nodes, deep pitch black background, luminous bloom',
    negativePrompt: 'bright daytime background, busy clutter, photographic noise, flat vector',
    previewImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    recommendedAspect: '9:16',
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    tagline: 'Retro game-inspired animation',
    description: 'Nostalgic 16-bit and 32-bit pixel graphics, retro arcade gaming sprites, isometric city blocks, and chiptune dungeon aesthetics.',
    accentColor: '#6366F1',
    palette: ['#38BDF8', '#FBBF24', '#22C55E'],
    badge: '8-bit',
    tags: ['16-bit', 'Retro gaming', 'Pixel sprite', 'Arcade'],
    samplePrompt: 'Charming 16-bit retro pixel art scene of a cyberpunk city street with neon game console controller glowing, nostalgic SNES palette, detailed sprite work',
    negativePrompt: 'smooth curves, anti-aliased vectors, high-res photograph, blurry',
    previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    recommendedAspect: '9:16',
  },
  {
    id: 'lyrics-tower',
    name: 'Lyrics Tower',
    tagline: 'Animated lyrics and typography',
    description: 'Vertical cascading kinetic typography, bold Hindi / English karaoke lyrics, glowing neon text animations, and rhythmic music-synchronized motion.',
    accentColor: '#EF4444',
    palette: ['#0B0B0E', '#7F1D1D', '#FFFFFF', '#EF4444'],
    badge: 'New',
    tags: ['Devanagari font', 'Karaoke sync', 'Music reel', 'Kinetic type'],
    samplePrompt: 'Glowing vertical Devanagari kinetic typography "सपने यह हैं मेरे" rising through atmospheric stardust, cinematic volumetric red and gold spotlights',
    negativePrompt: 'cluttered imagery, messy background, low contrast text, broken matras',
    previewImage: '/media/mythology/mythos-template-3.jpg',
    previewVideo: '/media/mythology/mythos-template-3.mp4',
    recommendedAspect: '9:16',
  },
];

export const STYLE_SAMPLE_JSONS: Record<string, any[]> = {
  mythology: [
    {
      scene: 1,
      duration: 5,
      say: "कुरुक्षेत्र के रणक्षेत्र में जब अर्जुन विषाद में घिर गए, तब शंखनाद हुआ।",
      quote: "कुरुक्षेत्र: रणक्षेत्र और विषाद",
      on: "कुरुक्षेत्र",
      accent: true,
      setting: "kurukshetra battlefield",
      narration: "कुरुक्षेत्र के रणक्षेत्र में जब अर्जुन विषाद में घिर गए, तब शंखनाद हुआ।",
      on_screen_text: "कुरुक्षेत्र: रणक्षेत्र और विषाद",
      image_prompt: "Grand ancient battlefield of Kurukshetra at dawn, thousands of chariots, divine glowing mist, Raja Ravi Varma style oil painting, 8k",
      camera: "zoom_in",
      sfx: "war_drums"
    },
    {
      scene: 2,
      duration: 6,
      say: "तब सारथी बने भगवान श्रीकृष्ण ने जीवन और आत्मा का अमर ज्ञान दिया।",
      quote: "श्रीकृष्ण का अमर गीता उपदेश",
      on: "गीता उपदेश",
      accent: true,
      setting: "golden chariot",
      narration: "तब सारथी बने भगवान श्रीकृष्ण ने जीवन और आत्मा का अमर ज्ञान दिया।",
      on_screen_text: "श्रीकृष्ण का अमर गीता उपदेश",
      image_prompt: "Lord Krishna holding chariot reins with radiant compassionate smile, golden peacock feather crown, divine yellow pitambara silk glowing, Tanjore gold leaf style, 8k",
      camera: "pan_right",
      sfx: "conch_shell"
    },
    {
      scene: 3,
      duration: 7,
      say: "और प्रकट किया अपना अनंत विराट स्वरूप, जिसमें पूरा ब्रह्मांड समाया हुआ था।",
      quote: "दिव्य विराट स्वरूप दर्शन",
      on: "विश्वरूप",
      accent: true,
      setting: "cosmic eternity",
      narration: "और प्रकट किया अपना अनंत विराट स्वरूप, जिसमें पूरा ब्रह्मांड समाया हुआ था।",
      on_screen_text: "दिव्य विराट स्वरूप दर्शन",
      image_prompt: "Supreme Lord Krishna revealing infinite cosmic Vishwaroop form with millions of radiant faces, spinning golden Sudarshana Chakra, celestial suns and stars, epic cinematic",
      camera: "zoom_out",
      sfx: "thunder_strike"
    },
    {
      scene: 4,
      duration: 5,
      say: "ऐसे ही पौराणिक रहस्यों और सनातन धर्म के प्रेरक प्रसंगों के लिए फ़ॉलो कीजिए।",
      quote: "सनातन ज्ञान, सरल भाषा में",
      on: "फ़ॉलो कीजिए",
      accent: true,
      setting: "sacred temple altar",
      narration: "ऐसे ही पौराणिक रहस्यों और सनातन धर्म के प्रेरक प्रसंगों के लिए फ़ॉलो कीजिए।",
      on_screen_text: "सनातन ज्ञान, सरल भाषा में",
      image_prompt: "Ancient sacred temple altar glowing with holy diyas, sacred shankh, and golden bells, classical sacred art",
      camera: "zoom_in",
      sfx: "temple_bell"
    }
  ],
  'flat-vector': [
    {
      scene: 1,
      duration: 5,
      narration: "Ever wondered why some marketing campaigns instantly go viral while others flop?",
      on_screen_text: "The Viral Mystery",
      image_prompt: "Split flat vector graphic comparing an exploding viral chart on the right with a flatline chart on the left, clean colorful pastel gradients, dribbble vector art",
      camera: "zoom_in",
      sfx: "pop_chime"
    },
    {
      scene: 2,
      duration: 6,
      narration: "It comes down to three psychological triggers: curiosity, emotional hook, and clarity.",
      on_screen_text: "3 Golden Triggers",
      image_prompt: "Flat vector illustration of three floating isometric cards labeled Hook, Emotion, Clarity with modern app icons, clean blue and yellow palette",
      camera: "pan_left",
      sfx: "whoosh"
    },
    {
      scene: 3,
      duration: 5,
      narration: "Master these three, and your content reaches millions on autopilot.",
      on_screen_text: "Reach Millions Automatically",
      image_prompt: "Flat vector character sending out glowing digital paper planes circling a colorful 3D globe with upward trending metric badges",
      camera: "zoom_out",
      sfx: "success_ding"
    }
  ],
  'comic-art': [
    {
      scene: 1,
      duration: 5,
      narration: "Midnight in the heart of Neo-Metropolis. The cyber alarms suddenly began to blare!",
      on_screen_text: "CODE RED AT MIDNIGHT!",
      image_prompt: "Vintage comic book panel with halftone dots showing a towering superhero on skyscraper ledge looking down at neon sirens, bold black inking, retro pop art",
      camera: "zoom_in",
      sfx: "siren"
    },
    {
      scene: 2,
      duration: 5,
      narration: "A masked figure leaps across the rooftop with supernatural agility!",
      on_screen_text: "WHOOSH! FAST AS LIGHTNING!",
      image_prompt: "Dynamic superhero action pose mid-air leap across rooftops, dramatic speed lines, comic sound effect bubble saying WHOOSH!, bright orange and cyan comic palette",
      camera: "pan_right",
      sfx: "whoosh"
    },
    {
      scene: 3,
      duration: 5,
      narration: "Justice never sleeps. Tomorrow belongs to the bold!",
      on_screen_text: "JUSTICE NEVER SLEEPS!",
      image_prompt: "Close-up comic heroic profile with dramatic rim lighting and city skyline behind, halftone shadows, speech bubble with bold typography",
      camera: "zoom_in",
      sfx: "heavy_hit"
    }
  ],
  chalkboard: [
    {
      scene: 1,
      duration: 5,
      narration: "How does a microchip actually process billions of calculations every second?",
      on_screen_text: "Inside the Modern CPU",
      image_prompt: "Detailed green chalkboard sketch of a computer processor die with white chalk architecture diagrams, clock generator, and binary numbers",
      camera: "zoom_in",
      sfx: "chalk_scratch"
    },
    {
      scene: 2,
      duration: 6,
      narration: "Billions of microscopic transistors act as microscopic binary switches.",
      on_screen_text: "Transistors: 1s and 0s",
      image_prompt: "Green chalkboard diagram zooming into a transistor gate showing source, drain, and electron flow sketched in yellow and white chalk",
      camera: "pan_left",
      sfx: "chalk_scratch"
    },
    {
      scene: 3,
      duration: 5,
      narration: "Together, they turn electrical pulses into video games, AI models, and human connection.",
      on_screen_text: "From Pulses to Supercomputers",
      image_prompt: "Chalkboard drawing of circuit pathways lighting up into an illuminated lightbulb and human hand reaching toward digital stars",
      camera: "zoom_out",
      sfx: "chalk_scratch"
    }
  ],
  'glow-sketch': [
    {
      scene: 1,
      duration: 5,
      narration: "In the depth of the digital void, a single synapse sparks into existence.",
      on_screen_text: "The Spark of Thought",
      image_prompt: "Electric neon cyan glowing line art of a single neuron firing against pitch black backdrop, luminous bloom, minimalist vector wireframe",
      camera: "zoom_in",
      sfx: "ambient_hum"
    },
    {
      scene: 2,
      duration: 6,
      narration: "Thousands of glowing pathways interlock, forming an artificial consciousness.",
      on_screen_text: "Synaptic Web Awakening",
      image_prompt: "Minimalist glowing neon purple and cyan geometric neural lattice spreading across black space like constellations, glowing nodes",
      camera: "zoom_out",
      sfx: "cyber_pulse"
    },
    {
      scene: 3,
      duration: 5,
      narration: "The future is no longer imagined. It is being computed right now.",
      on_screen_text: "The Future is Computed",
      image_prompt: "Luminous glowing white and cyan vector silhouette of a human face merging with an infinite geometric wireframe horizon",
      camera: "pan_right",
      sfx: "subtle_riser"
    }
  ],
  'pixel-art': [
    {
      scene: 1,
      duration: 5,
      narration: "Press Start to begin your quest through the Pixel Dungeon!",
      on_screen_text: "PRESS START TO PLAY",
      image_prompt: "16-bit retro pixel art title screen of a fantasy castle under a pixelated starry night with glowing game controller and retro font",
      camera: "zoom_in",
      sfx: "chiptune_start"
    },
    {
      scene: 2,
      duration: 5,
      narration: "The brave pixel knight equips his sword and ventures into the dark caves.",
      on_screen_text: "LEVEL 1: THE DRAGON CAVE",
      image_prompt: "Charming 16-bit pixel art side-scrolling platformer scene with a tiny knight in silver armor holding a torch in an underground cavern with emerald slime monsters",
      camera: "pan_left",
      sfx: "retro_jump"
    },
    {
      scene: 3,
      duration: 5,
      narration: "With courage and perseverance, every boss can be conquered! Game On!",
      on_screen_text: "VICTORY! NEW HIGH SCORE!",
      image_prompt: "16-bit pixel art victory screen with confetti sprites falling around the triumphant knight raising a golden trophy on a castle peak",
      camera: "zoom_out",
      sfx: "fanfare_8bit"
    }
  ],
  'lyrics-tower': [
    {
      scene: 1,
      duration: 5,
      narration: "सपने यह हैं मेरे, जो पलकों पे सजे हैं...",
      on_screen_text: "सपने यह हैं मेरे...",
      image_prompt: "Glowing kinetic typography tower in red and gold neon letters rising against dark moody atmospheric fog with floating embers, cinematic lighting",
      camera: "zoom_in",
      sfx: "melodic_swell"
    },
    {
      scene: 2,
      duration: 5,
      narration: "राहों में अंधेरा सही, हौसले मगर बड़े हैं।",
      on_screen_text: "हौसले मगर बड़े हैं!",
      image_prompt: "Dramatic glowing Devanagari lyrics floating upward like building blocks with volumetric golden spotlights, cinematic music video aesthetic",
      camera: "pan_right",
      sfx: "bass_drop"
    },
    {
      scene: 3,
      duration: 5,
      narration: "मंज़िल भी मिलेगी और रास्ता भी बनेगा।",
      on_screen_text: "मंज़िल भी मिलेगी...",
      image_prompt: "Bold kinetic lyrics bursting into warm golden light with starry bokeh particles against deep burgundy background, 8k resolution",
      camera: "zoom_out",
      sfx: "cymbal_swell"
    }
  ]
};
