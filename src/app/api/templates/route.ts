import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { TEMPLATES_DATA, TEMPLATE_EVENTS, VideoTemplate } from '@/lib/templates';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'recommended'; // 'recommended' | 'following' | 'events'
    const category = searchParams.get('category') || 'All';
    const aspect = searchParams.get('aspect') || 'all';
    const query = (searchParams.get('q') || searchParams.get('search') || '').trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '24', 10)));

    const currentUser = await getCurrentUser();
    const currentUserId = currentUser?.user?.id || '';

    // Merge static curated templates with community published templates from dbStore
    const publishedCustom = dbStore.getPublishedTemplates();
    const allTemplates: VideoTemplate[] = [...publishedCustom, ...TEMPLATES_DATA];

    // Compute live like counts and liked status for each template
    const userLikes = new Set<string>();
    const userFollows = new Set<string>();

    if (currentUserId) {
      allTemplates.forEach((t) => {
        if (dbStore.isTemplateLiked(t.id, currentUserId)) {
          userLikes.add(t.id);
        }
        if (dbStore.isFollowingCreator(t.creatorId, currentUserId)) {
          userFollows.add(t.creatorId);
        }
      });
    }

    // Process based on tab
    if (tab === 'events') {
      return NextResponse.json({
        events: TEMPLATE_EVENTS,
        featuredTemplates: allTemplates.slice(0, 8),
      });
    }

    let filtered = allTemplates;

    // Following tab filtering
    if (tab === 'following') {
      if (currentUserId && userFollows.size > 0) {
        filtered = filtered.filter((t) => userFollows.has(t.creatorId));
      } else {
        // If not following anyone yet, return top creators suggestions
        const creators = [
          { id: 'usr_c1', name: '@alex_cinema', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', bio: 'Cinematic commercials, macro luxury & automotive', followersCount: 18400 },
          { id: 'usr_c2', name: '@elena_vfx', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', bio: 'High-fashion editorial & perfume campaigns', followersCount: 24100 },
          { id: 'usr_c3', name: '@luna_story', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', bio: 'Viral TikTok hooks, skincare & social reels', followersCount: 21500 },
          { id: 'usr_c4', name: '@marcus_ai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', bio: 'SaaS platforms, devtools & tech explainers', followersCount: 19800 },
          { id: 'usr_c5', name: '@nature_organic', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', bio: 'Farm-fresh organic agriculture & culinary reels', followersCount: 12900 },
        ];

        return NextResponse.json({
          templates: [],
          total: 0,
          page: 1,
          totalPages: 1,
          hasMore: false,
          suggestedCreators: creators,
          followingCount: 0,
          userLikes: Array.from(userLikes),
          userFollows: Array.from(userFollows),
        });
      }
    }

    // Category filter
    if (category && category !== 'All' && category !== 'All Templates') {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.category.toLowerCase() === catLower ||
          t.category.toLowerCase().includes(catLower) ||
          catLower.includes(t.category.toLowerCase())
      );
    }

    // Aspect ratio filter
    if (aspect && aspect !== 'all') {
      filtered = filtered.filter((t) => t.aspect === aspect);
    }

    // Search query filter
    if (query) {
      filtered = filtered.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(query);
        const descMatch = t.description?.toLowerCase().includes(query);
        const promptMatch = t.prompt?.toLowerCase().includes(query);
        const creatorMatch = t.creatorName?.toLowerCase().includes(query);
        const tagMatch = t.tags?.some((tag) => tag.toLowerCase().includes(query));
        return titleMatch || descMatch || promptMatch || creatorMatch || tagMatch;
      });
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Map each template to include up-to-date live likeCount and isLiked
    const enrichedTemplates = paginated.map((t) => {
      const liveCount = dbStore.getTemplateLikeCount(t.id, t.likesCount || 0);
      const isLiked = currentUserId ? userLikes.has(t.id) : false;
      const isFollowing = currentUserId ? userFollows.has(t.creatorId) : false;
      return {
        ...t,
        likesCount: liveCount,
        isLiked,
        isFollowing,
      };
    });

    return NextResponse.json({
      templates: enrichedTemplates,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
      userLikes: Array.from(userLikes),
      userFollows: Array.from(userFollows),
    });
  } catch (err: any) {
    console.error('Error fetching templates feed:', err);
    return NextResponse.json({ error: err.message || 'Failed to load templates' }, { status: 500 });
  }
}
