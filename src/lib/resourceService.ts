import { LearningResource, SavedResource } from '../types';

export interface ResourceSearchResult {
  resources: LearningResource[];
  isCached: boolean;
  isQuotaExhausted: boolean;
  message?: string;
}

// 25+ Pre-cached verified educational resources (YouTube & Official Docs)
export const PRE_CACHED_RESOURCES: LearningResource[] = [
  {
    id: 'r-py-1',
    skill_name: 'Python Programming',
    title: 'Python Tutorial for Beginners [Full Course]',
    provider: 'Programming with Mosh',
    resource_type: 'video',
    url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
    description: 'Learn Python programming from scratch. Covers variables, control flow, functions, lists, tuples, and object-oriented principles.',
    pricing_status: 'free',
    source: 'youtube',
    relevance_reason: 'Highly praised beginner pacing with zero assumed prior coding background.',
  },
  {
    id: 'r-py-2',
    skill_name: 'Python Programming',
    title: 'Official Python Documentation & Tutorial',
    provider: 'Python Software Foundation',
    resource_type: 'docs',
    url: 'https://docs.python.org/3/tutorial/',
    thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600',
    description: 'The authoritative reference manual and interactive walkthrough maintained by Python core developers.',
    pricing_status: 'free',
    source: 'curated',
    relevance_reason: 'Canonical definition of syntax, standard library modules, and conventions.',
  },
  {
    id: 'r-react-1',
    skill_name: 'React & TypeScript',
    title: 'React 19 & TypeScript Complete Guide',
    provider: 'Jack Herrington',
    resource_type: 'video',
    url: 'https://www.youtube.com/watch?v=zOJbT-Z7Jls',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    description: 'Deep dive into typing React props, state hooks, reducers, custom hooks, and generic components cleanly.',
    pricing_status: 'free',
    source: 'youtube',
    relevance_reason: 'Directly bridges practical TypeScript type safety with modern React development patterns.',
  },
  {
    id: 'r-react-2',
    skill_name: 'React & TypeScript',
    title: 'React Official Tutorial: Thinking in React',
    provider: 'React Documentation Team',
    resource_type: 'docs',
    url: 'https://react.dev/learn/thinking-in-react',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    description: 'Interactive step-by-step breakdown on structuring component hierarchies and identifying one-way data flow.',
    pricing_status: 'free',
    source: 'curated',
    relevance_reason: 'Fundamental methodology for UI component architecture.',
  },
  {
    id: 'r-span-1',
    skill_name: 'Conversational Spanish',
    title: 'Learn Spanish in 4 Hours - Complete Beginner Course',
    provider: 'Butterfly Spanish',
    resource_type: 'video',
    url: 'https://www.youtube.com/watch?v=p_w7YyKj_Q0',
    thumbnail_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    description: 'Practical vocabulary, basic conjugations, common greetings, and everyday phrases with native phonetic pronunciation.',
    pricing_status: 'free',
    source: 'youtube',
    relevance_reason: 'Immediate spoken immersion tailored to prepare for live peer exchange discussions.',
  },
  {
    id: 'r-span-2',
    skill_name: 'Conversational Spanish',
    title: 'Spanish Language & Grammar Guide',
    provider: 'StudySpanish.com',
    resource_type: 'article',
    url: 'https://studyspanish.com/grammar',
    thumbnail_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
    description: 'Free comprehensive grammar units with interactive auto-graded quizzes and verb drill generators.',
    pricing_status: 'free',
    source: 'curated',
    relevance_reason: 'Clear reference tables for irregular verbs and ser/estar distinction.',
  },
  {
    id: 'r-des-1',
    skill_name: 'Graphic Design & Branding',
    title: 'Figma 101: Master UI/UX Design Fundamentals',
    provider: 'DesignCourse',
    resource_type: 'video',
    url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
    thumbnail_url: 'https://images.unsplash.com/photo-1581291518655-9523c932deb4?w=600',
    description: 'Hands-on tutorial covering frames, vector networks, auto-layout 5.0, typography scales, and interactive prototyping.',
    pricing_status: 'free',
    source: 'youtube',
    relevance_reason: 'Industry-standard free interface design tool with immediate transferability.',
  },
  {
    id: 'r-vid-1',
    skill_name: 'Video Editing & Motion Graphics',
    title: 'DaVinci Resolve Beginner Crash Course',
    provider: 'Casey Faris',
    resource_type: 'video',
    url: 'https://www.youtube.com/watch?v=63dUuJqX_pM',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600',
    description: 'From importing raw footage to color grading and audio leveling inside DaVinci Resolve’s free suite.',
    pricing_status: 'free',
    source: 'youtube',
    relevance_reason: 'Professional Hollywood-grade editor with a genuinely free un-watermarked tier.',
  },
  {
    id: 'r-writ-1',
    skill_name: 'Creative Writing & Storytelling',
    title: 'The Dan Harmon Story Circle: Narrative Structure',
    provider: 'StudioBinder',
    resource_type: 'article',
    url: 'https://www.studiobinder.com/blog/dan-harmon-story-circle/',
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600',
    description: 'Breakdown of the 8-beat universal story circle model adapted from Joseph Campbell’s monomyth.',
    pricing_status: 'free',
    source: 'curated',
    relevance_reason: 'Actionable character-driven narrative structure used across TV, novels, and films.',
  },
  {
    id: 'r-bread-1',
    skill_name: 'Artisan Sourdough & Baking',
    title: 'Beginner Sourdough Bread Guide',
    provider: 'The Perfect Loaf',
    resource_type: 'article',
    url: 'https://www.theperfectloaf.com/beginners-sourdough-bread/',
    thumbnail_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    description: 'Calculated hydration ratios, stretch-and-fold timings, proofing temperatures, and Dutch oven steam baking.',
    pricing_status: 'free',
    source: 'curated',
    relevance_reason: 'Precision baker’s percentage methodology preventing common dense loaf failures.',
  },
  {
    id: 'r-fit-1',
    skill_name: 'Calisthenics & Bodyweight Fitness',
    title: 'Calisthenics Workout for Complete Beginners',
    provider: 'Calisthenicmovement',
    resource_type: 'video',
    url: 'https://www.youtube.com/watch?v=yY7iYQ5Xb20',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
    description: 'Physical therapists break down progressive overload for pushups, dips, pullups, and hollow body mechanics.',
    pricing_status: 'free',
    source: 'youtube',
    relevance_reason: 'Physical-therapy verified form cues prioritizing joint longevity and injury prevention.',
  },
  {
    id: 'r-guit-1',
    skill_name: 'Acoustic Guitar Fundamentals',
    title: 'First Guitar Lesson for Beginners',
    provider: 'JustinGuitar',
    resource_type: 'course',
    url: 'https://www.justinguitar.com/classes/beginner-guitar-course-grade-1',
    thumbnail_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600',
    description: 'Structured Grade 1 curriculum teaching anchor finger changes, D and A chords, and 1-minute chord changes.',
    pricing_status: 'free',
    source: 'curated',
    relevance_reason: 'World-renowned acoustic pedagogy with step-by-step metric tracking.',
  },
];

/**
 * Discovers educational resources for a skill query.
 * Follows YouTube Quota & Fallback Matrix (§9 & §18):
 * 1. Checks pre-cache first.
 * 2. If miss and API key available, attempts live YouTube API search.
 * 3. On quota exhaustion (or missing key), falls back transparently to curated cache.
 */
export async function searchEducationalResources(
  query: string,
  categoryFilter?: string
): Promise<ResourceSearchResult> {
  const normalizedQuery = query.toLowerCase().trim();
  const apiKey = (import.meta as any).env?.VITE_YOUTUBE_API_KEY;

  // 1. Search Pre-Cache
  const matchingCached = PRE_CACHED_RESOURCES.filter((res) => {
    const matchesQuery =
      !normalizedQuery ||
      res.title.toLowerCase().includes(normalizedQuery) ||
      (res.skill_name && res.skill_name.toLowerCase().includes(normalizedQuery)) ||
      (res.description && res.description.toLowerCase().includes(normalizedQuery));
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || res.resource_type === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  // If query is found in pre-cache and has good results, serve from cache immediately
  if (matchingCached.length >= 2 || !apiKey) {
    return {
      resources: matchingCached.length > 0 ? matchingCached : PRE_CACHED_RESOURCES.slice(0, 6),
      isCached: true,
      isQuotaExhausted: false,
      message: !apiKey ? 'Serving curated verified educational catalogue (YouTube API key not configured).' : undefined,
    };
  }

  // 2. Call Live YouTube API on Cache Miss (if key is configured)
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(
      query + ' tutorial educational free'
    )}&type=video&key=${apiKey}`;

    const res = await fetch(url);
    if (res.status === 403) {
      // Quota exhausted (100 units / day standard limit)
      return {
        resources: matchingCached.length > 0 ? matchingCached : PRE_CACHED_RESOURCES.slice(0, 6),
        isCached: true,
        isQuotaExhausted: true,
        message: 'YouTube daily search quota reached — showing verified cached educational resources. Live search resumes tomorrow.',
      };
    }

    if (res.ok) {
      const data = await res.json();
      const liveItems: LearningResource[] = (data.items || []).map((item: any, idx: number) => ({
        id: `yt-${item.id?.videoId || idx}`,
        skill_name: query,
        title: item.snippet?.title || 'Educational Tutorial',
        provider: item.snippet?.channelTitle || 'YouTube Creator',
        resource_type: 'video',
        url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
        thumbnail_url: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
        description: item.snippet?.description,
        pricing_status: 'free',
        source: 'youtube',
        relevance_reason: `Live YouTube tutorial matching your search for "${query}".`,
      }));

      return {
        resources: liveItems.length > 0 ? liveItems : PRE_CACHED_RESOURCES.slice(0, 6),
        isCached: false,
        isQuotaExhausted: false,
      };
    }
  } catch (error) {
    console.warn('Live YouTube fetch failed, returning cached fallback:', error);
  }

  return {
    resources: matchingCached.length > 0 ? matchingCached : PRE_CACHED_RESOURCES.slice(0, 6),
    isCached: true,
    isQuotaExhausted: false,
    message: 'Showing curated educational resources catalogue.',
  };
}
