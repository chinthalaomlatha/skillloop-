# SkillLoop AI — Roadmap & Stretch Priorities (`TODO.md`)

This document tracks completed demo-critical deliverables and prioritized stretch features in accordance with the project ideology: **Knowledge exchange is the core; AI is the amplifier.**

---

## ✅ Completed Deliverables (Demo-Critical Path (§2))

- [x] **Authentication & Onboarding**:
  - Full email/password auth flow via Supabase Auth & persistent session state
  - 3-step onboarding: profile setup, teaching skill selection, learning goal specification
  - Instant test persona switcher (Maya, Carlos, Elena, Marcus, Priya, David) for evaluating multi-user exchange workflows
- [x] **Intelligent Peer Matching Engine**:
  - Deterministic 0–100 compatibility calculation (`skillComplement` + `proficiencyBalance` + `availabilityOverlap` + `languageFormat`)
  - Plain-language explanation for every recommended match
  - Strict **Free-First Filtering** before ranking
  - Zero fabricated users or imaginary compatibility scores
  - Meaningful empty state offering actionable fallback routes
- [x] **AI Skill Circles (Signature Feature)**:
  - 3-person closed cycle detector ($A \to B \to C \to A$)
  - Plain-language justification for every directional edge
  - Group roadmap milestones and collective learning objective
  - **Sparse-Data Fallback**: Automatic honest 2-person reciprocal exchange ($A \rightleftarrows B$) when fewer than 3 members form a cycle
- [x] **AI Learning Mentor**:
  - Domain-adaptive assistance (Programming, Music, Cooking, Drawing, Languages, Writing, and Fitness with safety disclaimers)
  - Interactive conceptual quizzes with scoring and rationales
  - Personalized learning path roadmap generation
  - Graceful offline pedagogic fallback when OpenAI API key is unconfigured
  - Prominent notice that AI assessments are not accredited certifications
- [x] **Educational Resource Discovery & Personal Library**:
  - YouTube Data API v3 live search integration
  - 25+ pre-cached verified educational resources across multiple skills
  - Graceful quota handling (transparent notice on exhaustion: *"Showing cached results — live search resumes tomorrow"*)
  - Personal library with study status tracking, custom study notes, and persistent bookmarks
- [x] **Data Persistence & Security**:
  - PostgreSQL schema with tables, constraints, foreign keys, and indexes
  - Comprehensive Row Level Security (RLS) policies on all sensitive tables
  - Full offline local persistence surviving page reloads and sign-outs
  - Content moderation service blocking commercial spam, phishing, and predatory solicitation
  - 25 automated tests across 7 test suites passing in Vitest

---

## 🟡 Prioritized Stretch Milestones

### Priority 1: Real-Time WebRTC / Jitsi Meeting Room Integration
- [ ] Integrate embedded Jitsi Meet React wrapper inside the session view
- [ ] Session whiteboard for visual design, code pairing, and diagram sharing
- [ ] Explicit recording consent banner requiring bidirectional participant approval

### Priority 2: In-App Direct Peer Messaging
- [ ] Direct chat threads between accepted exchange partners
- [ ] Real-time message synchronization via Supabase Realtime channels
- [ ] Safety report shortcut directly from chat bubble menu

### Priority 3: Calendar Export & Notifications
- [ ] One-click `.ics` calendar invitation download for scheduled exchange sessions
- [ ] Web Push / Email notification webhooks on session proposals and circle invitations

### Priority 4: Advanced Circle Governance
- [ ] Democratic circle goal voting where members propose and rank milestones
- [ ] Replacement participant finder when a member leaves a 3-person loop

---

## 🛑 Non-Negotiable Ideological Guardrails

1. **Exchange Over Consumption**: Never transform SkillLoop into an automated course dispensary or passive video binge site.
2. **Accessible Free Peer Learning**: Free reciprocal exchange must remain the default. Paid offers must never be silently substituted.
3. **No-Penalty Exit**: Any user can leave a match, decline an invitation, or switch to AI self-study immediately without approval or penalty.
