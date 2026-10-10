# SkillLoop AI — Architecture Documentation (`ARCHITECTURE.md`)

## 1. High-Level Architecture Overview

SkillLoop AI is designed around a single core principle: **peer-to-peer reciprocal knowledge exchange amplified by domain-aware AI.**

```
                               ┌───────────────────────────────────────────────────────────┐
                               │                    React 19 Frontend                      │
                               │  Vite • TypeScript • Tailwind CSS • Lucide • React Router │
                               └─────────────────────────────┬─────────────────────────────┘
                                                             │
                               ┌─────────────────────────────┴─────────────────────────────┐
                               │                     State & Service Layer                 │
                               │  • Matching Engine (Deterministic 0-100 Calculation)      │
                               │  • Circle Engine (Closed-Loop Cycle Detection)            │
                               │  • AI Mentor Service (Domain Adaptations & Quizzes)       │
                               │  • Resource Service (YouTube API + 25+ Pre-cache)         │
                               │  • Moderation Service (Pattern Matching & Safety Checks)  │
                               └──────────────┬─────────────────────────────┬──────────────┘
                                              │                             │
                      ┌───────────────────────▼──────┐       ┌──────────────▼──────────────┐
                      │    Supabase PostgreSQL &     │       │    External AI & Media      │
                      │   Row Level Security (RLS)   │       │   • OpenAI API (gpt-4o-mini)│
                      │  • Auth, Profiles, Skills    │       │   • YouTube Data API v3     │
                      │  • Sessions, Circles, Notes  │       │   • Graceful Fallback Cache │
                      └──────────────────────────────┘       └─────────────────────────────┘
```

---

## 2. Deterministic Matching Engine Calculation

Unlike opaque black-box AI matchers, SkillLoop AI calculates compatibility using a transparent, explainable formula bounded strictly between $0$ and $100$:

$$\text{Score} = S_{\text{complement}} + S_{\text{proficiency}} + S_{\text{availability}} + S_{\text{language/format}}$$

1. **Skill Complement Score ($S_{\text{complement}} \in [0, 50]$)**:
   - $50 \text{ pts}$: Reciprocal two-way exchange (A teaches what B wants, and B teaches what A wants).
   - $20 \text{ pts}$: One-way knowledge transfer.
2. **Proficiency Balance Score ($S_{\text{proficiency}} \in [0, 20]$)**:
   - Up to $20 \text{ pts}$: Teacher's self-reported proficiency meets or exceeds the learner's desired target.
3. **Availability Overlap Score ($S_{\text{availability}} \in [0, 15]$)**:
   - Evaluates weekly hour overlap ($\le 2 \text{ hr}$ difference awards $15 \text{ pts}$).
4. **Language & Format Score ($S_{\text{language/format}} \in [0, 15]$)**:
   - Shared communication language ($10 \text{ pts}$) + preferred session format ($5 \text{ pts}$).

---

## 3. 3-Person AI Skill Circle Closed Loop Detection

The Circle Engine discovers closed cycles where knowledge circulates among all members without requiring external instructors:

```
                  ┌──────────────────────────────────────────────┐
                  │             Maya (Node A)                    │
                  │  Teaches: Python   │ Wants: Spanish          │
                  └──────────────┬───────────────────────────────┘
                                 │
                 Teaches Python  │               ▲  Teaches Spanish
                                 │               │
                                 ▼               │
                  ┌──────────────────────────────┴───────────────┐
                  │            Carlos (Node B)                   │
                  │  Teaches: Spanish  │ Wants: Video Editing    │
                  └──────────────┬───────────────────────────────┘
                                 │
          Teaches Video Editing  │               ▲
                                 │               │
                                 ▼               │
                  ┌──────────────────────────────┴───────────────┐
                  │            Elena (Node C)                    │
                  │  Teaches: Video    │ Wants: Python           │
                  └──────────────────────────────────────────────┘
```

### Sparse-Data Fallback Matrix
When fewer than $3$ compatible users form a triangle, the system transparently recommends an honest $2$-person reciprocal loop ($A \rightleftarrows B$). **Zero ghost members or fake bots are ever generated.**

---

## 4. Row Level Security (RLS) Model

All tables containing user-owned or sensitive data enforce PostgreSQL Row Level Security:

| Table | Policy Summary |
|---|---|
| `profiles` | Public read for matching discovery; update restricted to `auth.uid() = id`. |
| `user_teaching_skills` | Public read for matching; mutations restricted to `auth.uid() = user_id`. |
| `user_learning_goals` | Public read for matching; mutations restricted to `auth.uid() = user_id`. |
| `match_requests` | Visible and editable only by `sender_id` or `receiver_id`. |
| `saved_resources` | Strictly private to `auth.uid() = user_id`. |
| `personal_notes` | Strictly private to `auth.uid() = user_id`. |
| `learning_sessions` | Visible and editable only by authorized session participants (`host_id` or `partner_id`). |
| `reports` | Readable by reporter or system admin; create restricted to `auth.uid() = reporter_id`. |
| `blocked_users` | Strictly private to `auth.uid() = user_id`. |
