export interface CloudflareModelInfo {
  id: string;
  name: string;
  description: string;
  provider: string;
  badge: string;
  recommendedAspect?: string;
}

export const CLOUDFLARE_MODELS: CloudflareModelInfo[] = [
  {
    id: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    name: 'Stable Diffusion XL Base 1.0',
    description: 'Flagship open-weights model for high-resolution photorealism and detailed concept art.',
    provider: 'Stability AI',
    badge: '100k/day Free',
    recommendedAspect: '1:1',
  },
  {
    id: '@cf/blackforestlabs/flux-1-schnell',
    name: 'Flux 1 Schnell',
    description: 'Next-gen 12-billion parameter rectified flow transformer for crisp textures and accurate typography.',
    provider: 'Black Forest Labs',
    badge: 'Ultra Quality',
    recommendedAspect: '16:9',
  },
  {
    id: '@cf/bytedance/stable-diffusion-xl-lightning',
    name: 'SDXL Lightning',
    description: 'Distilled step-accelerated engine by ByteDance for lightning-fast sub-second image generation.',
    provider: 'ByteDance',
    badge: 'Fastest',
    recommendedAspect: '1:1',
  },
  {
    id: '@cf/lykon/dreamshaper-8-lcm',
    name: 'DreamShaper 8 LCM',
    description: 'Tuned for cinematic fantasy, digital illustration, anime, and artistic aesthetics with LCM speed.',
    provider: 'Lykon',
    badge: 'Artistic',
    recommendedAspect: '4:3',
  },
];
