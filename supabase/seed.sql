-- =============================================================================
-- SkillLoop AI - Comprehensive Seed Data
-- =============================================================================

-- 1. Skill Categories
INSERT INTO public.skill_categories (id, name, slug, description, icon, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Technology & Programming', 'technology-programming', 'Full-stack development, Python, mobile apps, DevOps, AI integration', 'Code2', 1),
('c1000000-0000-0000-0000-000000000002', 'Cybersecurity & Digital Skills', 'cybersecurity-digital', 'Ethical hacking, network defense, Linux administration, privacy', 'ShieldAlert', 2),
('c1000000-0000-0000-0000-000000000003', 'Drawing, Painting & Crafts', 'drawing-painting-crafts', 'Watercolor, sketch art, ceramics, digital illustration, origami', 'Palette', 3),
('c1000000-0000-0000-0000-000000000004', 'Design, Photo & Video Editing', 'design-photo-video', 'Graphic design, Premiere Pro, Figma UI/UX, portrait photography', 'Video', 4),
('c1000000-0000-0000-0000-000000000005', 'Music & Instruments', 'music-instruments', 'Acoustic guitar, piano, vocal techniques, music theory, audio production', 'Music', 5),
('c1000000-0000-0000-0000-000000000006', 'Dance & Performing Arts', 'dance-performing-arts', 'Salsa, contemporary, hip hop, stage presence, acting', 'Sparkles', 6),
('c1000000-0000-0000-0000-000000000007', 'Languages & Communication', 'languages-communication', 'Spanish, Japanese, French, public speaking, conversational fluency', 'Languages', 7),
('c1000000-0000-0000-0000-000000000008', 'Academics & Exam Prep', 'academics-exam-prep', 'College calculus, GRE/GMAT prep, history, academic research writing', 'GraduationCap', 8),
('c1000000-0000-0000-0000-000000000009', 'Mathematics & Science', 'mathematics-science', 'Linear algebra, statistics, physics, molecular biology, chemistry', 'Atom', 9),
('c1000000-0000-0000-0000-000000000010', 'Cooking & Baking', 'cooking-baking', 'Artisan sourdough, knife skills, Italian cuisine, pastry, meal prep', 'ChefHat', 10),
('c1000000-0000-0000-0000-000000000011', 'Sports & Fitness Skills', 'sports-fitness', 'Calisthenics, running form, yoga, swimming technique, mobility', 'Activity', 11),
('c1000000-0000-0000-0000-000000000012', 'Writing & Storytelling', 'writing-storytelling', 'Fiction writing, technical writing, screenwriting, poetry, essays', 'BookOpen', 12),
('c1000000-0000-0000-0000-000000000013', 'Business & Marketing', 'business-marketing', 'Bootstrapping, SEO, copywriting, product strategy, pitch decks', 'Briefcase', 13),
('c1000000-0000-0000-0000-000000000014', 'Personal Finance & Life Skills', 'finance-life-skills', 'Budgeting, index investing, negotiation, woodworking, home repair', 'Compass', 14),
('c1000000-0000-0000-0000-000000000015', 'Gardening & Hobbies', 'gardening-hobbies', 'Urban gardening, hydroponics, chess strategy, coffee brewing', 'Sprout', 15),
('c1000000-0000-0000-0000-000000000016', 'Custom & Emerging Skills', 'custom-emerging', 'Community-created unique crafts and emerging domains', 'PlusCircle', 16)
ON CONFLICT (id) DO NOTHING;

-- 2. Initial Skills Catalogue
INSERT INTO public.skills (id, category_id, name, slug, description, tags) VALUES
('s1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Python Programming', 'python-programming', 'Data analysis, scripting, backend development and automation with Python.', ARRAY['programming', 'python', 'backend']),
('s1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'React & TypeScript', 'react-typescript', 'Modern responsive web development with React hooks, components, and TypeScript.', ARRAY['web', 'frontend', 'react', 'typescript']),
('s1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000007', 'Conversational Spanish', 'conversational-spanish', 'Everyday speaking, grammar fundamentals, and Latin American/Castilian cultural contexts.', ARRAY['language', 'spanish', 'speaking']),
('s1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Graphic Design & Branding', 'graphic-design-branding', 'Visual hierarchy, typography, logo creation, and color theory with Figma/Illustrator.', ARRAY['design', 'figma', 'branding']),
('s1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004', 'Video Editing & Motion Graphics', 'video-editing-motion', 'Cutting, pacing, sound design, and color grading in Premiere Pro and DaVinci Resolve.', ARRAY['video', 'editing', 'youtube']),
('s1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000012', 'Creative Writing & Storytelling', 'creative-writing-storytelling', 'Character development, three-act structure, pacing, dialogue, and narrative arc.', ARRAY['writing', 'storytelling', 'creative']),
('s1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000010', 'Artisan Sourdough & Baking', 'sourdough-baking', 'Wild yeast starter maintenance, hydration ratios, stretch-and-fold, Dutch oven baking.', ARRAY['cooking', 'baking', 'sourdough']),
('s1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'Acoustic Guitar Fundamentals', 'acoustic-guitar-fundamentals', 'Chords, strumming patterns, fingerpicking, rhythm timing, and song accompaniment.', ARRAY['music', 'guitar', 'instrument']),
('s1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Ethical Hacking & Web Security', 'ethical-hacking-web-security', 'OWASP Top 10, penetration testing, Burp Suite, authorization testing, vulnerability assessment.', ARRAY['cybersecurity', 'security', 'hacking']),
('s1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000011', 'Calisthenics & Bodyweight Fitness', 'calisthenics-fitness', 'Pull-up progression, handstands, hollow body mechanics, safe joint conditioning.', ARRAY['fitness', 'calisthenics', 'health'])
ON CONFLICT (id) DO NOTHING;

-- 3. Pre-Cached Curated Learning Resources (Graceful Fallback Matrix §9)
INSERT INTO public.learning_resources (id, skill_id, title, provider, resource_type, url, thumbnail_url, description, pricing_status, source, relevance_reason) VALUES
('r1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'Python for Beginners - Full Free Course', 'freeCodeCamp.org', 'video', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500', 'Complete 4-hour Python programming bootcamp covering variables, loops, functions, and OOP fundamentals.', 'free', 'curated', 'Top-rated zero-cost introduction with practical code exercises for new programmers.'),
('r1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000002', 'React Documentation & Tutorial', 'React Team', 'docs', 'https://react.dev/learn', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500', 'The official interactive React documentation with live sandboxes, deep dives into state, effects, and hooks.', 'free', 'curated', 'Official primary source for modern React architecture and component thinking.'),
('r1000000-0000-0000-0000-000000000007', 's1000000-0000-0000-0000-000000000007', 'Spanish Language Beginner Guide & Phonetics', 'Butterfly Spanish', 'video', 'https://www.youtube.com/watch?v=p_w7YyKj_Q0', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500', 'Clear pronunciation, daily conversational expressions, and key grammatical conjugations.', 'free', 'curated', 'Helps conversational learners speak with correct phonetic rhythm before peer exchange sessions.'),
('r1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000004', 'Figma for Beginners: UI Design Tutorial', 'Envato Tuts+', 'video', 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', 'https://images.unsplash.com/photo-1581291518655-9523c932deb4?w=500', 'Step-by-step introduction to auto-layout, components, typography scales, and interactive prototyping.', 'free', 'curated', 'Essential practical toolkit for creating clean UI and branding assets.'),
('r1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000005', 'DaVinci Resolve Full Video Editing Course', 'Casey Faris', 'video', 'https://www.youtube.com/watch?v=63dUuJqX_pM', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500', 'Full free guide to timeline trimming, color grading, Fairlight audio mastering, and export settings.', 'free', 'curated', 'Industry-standard free software workflow from footage ingestion to final render.'),
('r1000000-0000-0000-0000-000000000012', 's1000000-0000-0000-0000-000000000012', 'Story Structure 101: How to Write Great Plots', 'Dan Harmon Story Circle Guide', 'article', 'https://channel101.fandom.com/wiki/Story_Structure_101:_Super_Basic_Explanation', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500', 'Clear breakdown of the 8-stage narrative circle used in screenplays, novels, and episodic narratives.', 'free', 'curated', 'Actionable narrative framework applicable across novels, videos, and storytelling.'),
('r1000000-0000-0000-0000-000000000010', 's1000000-0000-0000-0000-000000000010', 'Sourdough Bread Recipe & Scientific Technique', 'The Perfect Loaf', 'article', 'https://www.theperfectloaf.com/beginners-sourdough-bread/', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', 'Detailed beginner sourdough guide with fermentation timelines, ambient temperature charts, and crumb analysis.', 'free', 'curated', 'Proven scientific approach eliminating common sourdough starter and shaping mistakes.'),
('r1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000005', 'JustinGuitar Beginner Guitar Course', 'JustinGuitar', 'course', 'https://www.justinguitar.com/classes/beginner-guitar-course-grade-1', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500', 'Structured Grade 1 guitar modules covering the D and A chords, anchor finger changes, and rhythm clapping.', 'free', 'curated', 'Renowned pedagogical method specifically suited for adult beginners learning independently.')
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Achievements System
INSERT INTO public.achievements (id, code, title, description, badge_icon, required_count) VALUES
('a1000000-0000-0000-0000-000000000001', 'first_exchange', 'First Loop Completed', 'Completed your very first 1:1 peer skill exchange session.', 'Award', 1),
('a1000000-0000-0000-0000-000000000002', 'circle_pioneer', 'Circle Pioneer', 'Formed or joined a verified 3-person Skill Circle.', 'Users', 1),
('a1000000-0000-0000-0000-000000000003', 'resource_curator', 'Library Builder', 'Saved 5 high-quality learning resources to your personal library.', 'BookmarkCheck', 5),
('a1000000-0000-0000-0000-000000000004', 'knowledge_giver', 'Dedicated Mentor', 'Completed 3 sessions teaching your skill to eager peer learners.', 'HeartHandshake', 3),
('a1000000-0000-0000-0000-000000000005', 'ai_scholar', 'Quiz Achiever', 'Passed an AI skill assessment with a score of 80% or higher.', 'CheckCircle2', 1)
ON CONFLICT (id) DO NOTHING;
