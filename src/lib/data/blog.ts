export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'scaling-ai-video-generation-multi-provider',
    title: 'Architecting a Multi-Provider AI Video Generation Infrastructure',
    summary: 'How Fluvia Flow routes prompt inference across Runway, Luma, Flux, and custom core GPU clusters with atomic credit accounting.',
    date: 'October 18, 2026',
    readTime: '6 min read',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'science-of-3-second-social-hooks',
    title: 'The Neurological Science of 3-Second Hooks in Short-Form Video',
    summary: 'Analyzing 10,000 top-performing Instagram Reels and YouTube Shorts to understand motion vectors, color contrast, and caption pacing.',
    date: 'October 12, 2026',
    readTime: '5 min read',
    category: 'Creative Strategy',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'browser-native-multi-track-timeline-rendering',
    title: 'Building a High-Performance Video Editor in the Modern Browser',
    summary: 'Deep dive into HTML5 Canvas, WebGL, WebCodecs, and Remotion server rendering for buttery smooth 60fps timeline previews.',
    date: 'September 29, 2026',
    readTime: '8 min read',
    category: 'Design & Code',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
];
