# SkillLoop AI

> **"Learn one skill. Teach another. Grow together."**  
> *Exchange what you know with peers. Use AI to learn faster.*

SkillLoop AI is a **peer-to-peer skill exchange web application** enhanced by AI. It connects real people with complementary skills, forming two-way reciprocal exchanges and 3-person closed **Skill Circles**. AI serves as an amplifier of human knowledge transfer—never a substitute for it.

---

## 0. The Non-Negotiable Ideology

- **Exchange Over Consumption**: SkillLoop is not an online course marketplace, a paid tutoring directory, or a content consumption feed. Every user can be both a teacher and a learner.
- **Free Peer-to-Peer Learning Remains Accessible**: Free reciprocal exchange is the default. Paid tutoring offers are never disguised as ordinary exchanges.
- **No-Penalty Exit**: Users can decline, leave a match, or switch to AI-guided self-study at any time without justification or penalty.
- **AI Amplifies Human Exchange**: AI explains concepts, designs practice tasks, structures roadmaps, and uncovers circular loops among real users. It never fabricates fake tutors or ghost reviews.
- **Universal Skill Spectrum**: Supports technology, programming, cybersecurity, arts, crafts, music, dance, languages, academics, cooking, sports, fitness (with form and safety cues), writing, and custom community skills.

---

## 1. Demo-Critical Path & Key Features

| Feature | Description | Status |
|---|---|:---:|
| **Authentication & Onboarding** | Email/password auth, Supabase Auth integration, profile creation, teaching skill specification, and learning goal setting. Includes an instant persona switcher (Maya, Carlos, Elena, Marcus, Priya, David) to test multi-user loops effortlessly. | ✅ Completed |
| **Intelligent Peer Matching** | Deterministic $0$–$100$ compatibility calculation based on mutual complementarity, proficiency balance, availability overlap, and language. Includes strict **free-first filtering** and plain-language explanations. | ✅ Completed |
| **AI Skill Circles (Signature)** | Uncovers closed 3-person exchange loops ($A \to B \to C \to A$) where knowledge circulates among all members with edge justifications. Includes an honest **2-person fallback** ($A \rightleftarrows B$) when fewer than 3 users form a loop. | ✅ Completed |
| **Domain-Adaptive AI Mentor** | Scoped pedagogical assistant adapting to coding, culinary arts, drawing, music, languages, writing, and fitness (with mandatory physical safety disclaimers). Generates interactive quizzes, evaluations, and roadmaps. | ✅ Completed |
| **Resource Discovery & Library** | Live YouTube Data API v3 search with a pre-cached catalog of 25+ verified resources across skills. Graceful quota handling notices. Personal library with progress statuses and study notes. | ✅ Completed |
| **Persistence & Row-Level Security** | Full Supabase PostgreSQL schema with RLS policies protecting user data. Real-time offline persistence surviving sign-outs and page reloads. | ✅ Completed |

---

## 2. Tech Stack

- **Frontend**: React 19, Vite 6, TypeScript (strict mode)
- **Styling**: Tailwind CSS, Lucide icons, responsive component primitives
- **Routing**: React Router 7 (SPA navigation with accessible error boundaries)
- **Forms & Validation**: Zod shared schemas
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth with Row Level Security (RLS)
- **AI Integration**: OpenAI API (`gpt-4o-mini`) with domain-adaptive pedagogical prompts & graceful offline mentor fallback
- **External Media**: YouTube Data API v3 with a 25+ pre-cached verified educational directory
- **Testing**: Vitest, React Testing Library, JSDOM

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js `v18+` (tested on Node `v24`)
- npm `v9+`

### Installation & Run

```bash
# 1. Clone repository and navigate to directory
cd skillloop-ai

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment credentials
cp .env.example .env

# 4. Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 4. Test Suite Execution & Verified Results

SkillLoop AI includes comprehensive unit, component, integration, and security test suites executed with Vitest:

```bash
npm test
```

### Verified Test Output Record

```
 ✓ src/tests/validationSchemas.test.ts (5 tests)
   - validates compliant profile payload
   - rejects invalid short name in profile
   - validates teaching skill with experience and hours boundaries
   - rejects custom skill with short description
   - validates report payload

 ✓ src/tests/matchingEngine.test.ts (3 tests)
   - calculates reciprocal two-way compatibility score correctly
   - enforces mandatory free-first filtering before ranking
   - prevents matching user with themselves

 ✓ src/tests/circleEngine.test.ts (4 tests)
   - validates a correct 3-person closed loop (A -> B -> C -> A)
   - rejects an invalid disconnected loop
   - rejects duplicate users in circle proposal
   - discovers 3-person closed loop among realistic candidate users

 ✓ src/tests/moderationAndSafety.test.ts (4 tests)
   - flags commercial phishing and account hacking patterns
   - flags crypto doubling and get-rich-quick spam
   - approves legitimate educational skill proposals
   - attaches mandatory physical safety disclaimers to fitness domains

 ✓ src/tests/resourcesAndPersistence.test.ts (3 tests)
   - serves pre-cached educational resources with verified links
   - persists saved resources and attached notes across sessions
   - persists user custom skills dynamically without code modification

 ✓ src/tests/rlsSecurityAndAccess.test.ts (3 tests)
   - denies access to modify another user profile data directly
   - enforces isolated personal study notes ownership
   - prevents blocked users from interacting in exchange loops

 ✓ src/tests/components.test.tsx (3 tests)
   - renders MatchCard with explainable score and handles connect proposal
   - renders LoopDiagram with all connected node members
   - renders ResourceCard with verified pricing badge and link

 Test Files  7 passed (7)
      Tests  25 passed (25)
   Duration  1.92s
```

All 25 automated tests pass with 0 errors.

---

## 5. Graceful Fallback Matrix (§18)

SkillLoop AI ensures that missing external credentials never cause broken screens or silent failures:

| Missing / Exceeded Service | Behavioral Fallback | User Transparency |
|---|---|---|
| **Supabase credentials unconfigured** | Local persistence mode activates; test users, newly created custom skills, notes, and sessions persist in `localStorage`. | Top status banner displays: *"Local Persistence Mode (Active)"*. |
| **OpenAI API key missing** | Built-in domain mentor provides interactive pedagogical answers, study roadmaps, and conceptual quizzes. | Banner displays: *"AI Domain Mentor Active (Offline Mode)"*. |
| **YouTube API key missing / quota exhausted** | Pre-cached catalog of 25+ verified educational sources serves instant results. | Notice states: *"Showing cached results — live search resumes tomorrow."* |
| **Physical / health activity selected** | Form cues and exercise tips automatically append safety notices. | Alert banner advises consulting a qualified healthcare professional before vigorous exertion. |

---

## 6. Database Migrations & Row Level Security (RLS)

Database migrations and initial seeds are located in:
- `supabase/migrations/20261010000000_init_skillloop.sql`
- `supabase/seed.sql`

To apply directly to your Supabase project:

```bash
# Link your Supabase project
npx supabase link --project-ref your-project-ref

# Apply database schema migration
npx supabase db push
```

Every table containing user-owned data enforces PostgreSQL Row Level Security:
- `profiles`: Public view for discovery; `UPDATE` restricted to `auth.uid() = id`.
- `user_teaching_skills` & `user_learning_goals`: `SELECT` permitted for matching; write access restricted to `auth.uid() = user_id`.
- `match_requests`: Visible and editable only by `sender_id` or `receiver_id`.
- `saved_resources` & `personal_notes`: Strictly private to `auth.uid() = user_id`.
- `learning_sessions`: Accessible only to confirmed participants (`host_id` or `partner_id`).

---

## 7. Project Deliverables & Navigation Map

```
/                   Landing page with core ideology, illustrative circle, and 4-step workflow
/matches            Deterministic peer matching engine with explainable score breakdowns
/circles            AI Skill Circles (3-person loops & 2-person sparse-data fallback)
/mentor             Domain-adaptive AI mentor with quizzes and roadmap generation
/catalogue          Universal skill spectrum across 16 categories + custom skill creation
/resources          Educational resource discovery with YouTube search & curated cache
/library            Personal learning library with study notes and status tracking
/sessions           Peer exchange coordination, calendar scheduling, and Jitsi room launcher
/progress           Genuine event-derived milestones, streaks, and achievement badges
/requests           Exchange proposals inbox with instant, no-penalty exit controls
/safety             Community trust, user blocking, and reporting workflows
/discovery          Interactive AI skill discovery questionnaire
/learning-paths     Personalized multi-week mastery roadmaps with step tracking
/admin              Community safety and moderation event log
```

---

## 8. License & Verification Guarantee

SkillLoop AI is open-source under the MIT License. Built with strict integrity: zero fake tutors, zero simulated ratings, and zero invented statistics.
