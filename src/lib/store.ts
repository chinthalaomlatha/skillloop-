import {
  Profile,
  SkillCategory,
  Skill,
  UserTeachingSkill,
  UserLearningGoal,
  MatchRequest,
  SkillCircle,
  SavedResource,
  PersonalNote,
  LearningSession,
  QuizAttempt,
  LearningPath,
  ReportItem,
  NotificationItem,
} from '../types';
import {
  SEED_CATEGORIES,
  SEED_SKILLS,
  SEED_PROFILES,
  SEED_TEACHING_SKILLS,
  SEED_LEARNING_GOALS,
  SEED_ACHIEVEMENTS,
  SEED_MATCH_REQUESTS,
} from './mockData';
import { PRE_CACHED_RESOURCES } from './resourceService';

const STORAGE_KEY = 'skillloop_app_state_v1';

export interface AppState {
  currentUser: Profile | null;
  profiles: Profile[];
  categories: SkillCategory[];
  skills: Skill[];
  teachingSkills: UserTeachingSkill[];
  learningGoals: UserLearningGoal[];
  matchRequests: MatchRequest[];
  circles: SkillCircle[];
  savedResources: SavedResource[];
  personalNotes: PersonalNote[];
  sessions: LearningSession[];
  quizAttempts: QuizAttempt[];
  learningPaths: LearningPath[];
  reports: ReportItem[];
  blockedUserIds: string[];
  notifications: NotificationItem[];
}

function hydrateRequests(rawRequests: MatchRequest[] | undefined, profiles: Profile[], skills: Skill[]): MatchRequest[] {
  const base = rawRequests && rawRequests.length > 0 ? rawRequests : SEED_MATCH_REQUESTS;
  return base.map((r) => ({
    ...r,
    sender: r.sender || profiles.find((p) => p.id === r.sender_id),
    receiver: r.receiver || profiles.find((p) => p.id === r.receiver_id),
    sender_skill: r.sender_skill || skills.find((s) => s.id === r.sender_teaches_skill_id),
    receiver_skill: r.receiver_skill || skills.find((s) => s.id === r.sender_learns_skill_id),
  }));
}

function getInitialState(): AppState {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const profiles = parsed.profiles || SEED_PROFILES;
        const skills = parsed.skills || SEED_SKILLS;
        return {
          currentUser: parsed.currentUser || SEED_PROFILES[0],
          profiles,
          categories: parsed.categories || SEED_CATEGORIES,
          skills,
          teachingSkills: parsed.teachingSkills || SEED_TEACHING_SKILLS,
          learningGoals: parsed.learningGoals || SEED_LEARNING_GOALS,
          matchRequests: hydrateRequests(parsed.matchRequests, profiles, skills),
          circles: parsed.circles || [],
          savedResources: parsed.savedResources || [
            {
              id: 'sr-1',
              user_id: 'u-maya',
              resource_id: 'r-span-1',
              resource: PRE_CACHED_RESOURCES[4],
              status: 'in_progress',
              notes: 'Reviewed unit 1 greetings and phonetic sounds.',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          personalNotes: parsed.personalNotes || [
            {
              id: 'pn-1',
              user_id: 'u-maya',
              title: 'Spanish Pronunciation Notes',
              content: 'Roll the double "rr" gently with the tip of the tongue behind upper incisors.',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          sessions: parsed.sessions || [
            {
              id: 'sess-1',
              host_id: 'u-maya',
              partner_id: 'u-carlos',
              skill_id: 's1',
              title: 'Python Scripting Basics',
              objectives: 'Setup Python environment and write first CLI calculator.',
              scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(),
              duration_minutes: 45,
              status: 'confirmed',
              meeting_link: 'https://meet.jit.si/skillloop-python-carlos',
              created_at: new Date().toISOString(),
            },
          ],
          quizAttempts: parsed.quizAttempts || [],
          learningPaths: parsed.learningPaths || [],
          reports: parsed.reports || [],
          blockedUserIds: parsed.blockedUserIds || [],
          notifications: parsed.notifications || [
            {
              id: 'notif-1',
              user_id: 'u-maya',
              title: 'New Exchange Invitation!',
              message: 'Carlos Morales sent you an exchange proposal: Conversational Spanish ↔ Python Programming.',
              type: 'match_request',
              link: '/requests',
              is_read: false,
              created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            },
            {
              id: 'notif-2',
              user_id: 'u-maya',
              title: 'Reciprocal Match Available!',
              message: 'Carlos Morales wants to learn Python and can teach Conversational Spanish.',
              type: 'match_request',
              link: '/matches',
              is_read: false,
              created_at: new Date().toISOString(),
            },
          ],
        };
      }
    }
  } catch (e) {
    console.warn('Failed reading state from localStorage:', e);
  }

  return {
    currentUser: SEED_PROFILES[0],
    profiles: SEED_PROFILES,
    categories: SEED_CATEGORIES,
    skills: SEED_SKILLS,
    teachingSkills: SEED_TEACHING_SKILLS,
    learningGoals: SEED_LEARNING_GOALS,
    matchRequests: hydrateRequests([], SEED_PROFILES, SEED_SKILLS),
    circles: [],
    savedResources: [
      {
        id: 'sr-1',
        user_id: 'u-maya',
        resource_id: 'r-span-1',
        resource: PRE_CACHED_RESOURCES[4],
        status: 'in_progress',
        notes: 'Reviewed unit 1 greetings and phonetic sounds.',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    personalNotes: [
      {
        id: 'pn-1',
        user_id: 'u-maya',
        title: 'Spanish Pronunciation Notes',
        content: 'Roll the double "rr" gently with the tip of the tongue behind upper incisors.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    sessions: [
      {
        id: 'sess-1',
        host_id: 'u-maya',
        partner_id: 'u-carlos',
        skill_id: 's1',
        title: 'Python Scripting Basics',
        objectives: 'Setup Python environment and write first CLI calculator.',
        scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(),
        duration_minutes: 45,
        status: 'confirmed',
        meeting_link: 'https://meet.jit.si/skillloop-python-carlos',
        created_at: new Date().toISOString(),
      },
    ],
    quizAttempts: [],
    learningPaths: [],
    reports: [],
    blockedUserIds: [],
    notifications: [
      {
        id: 'notif-1',
        user_id: 'u-maya',
        title: 'Reciprocal Match Available!',
        message: 'Carlos Morales wants to learn Python and can teach Conversational Spanish.',
        type: 'match_request',
        link: '/matches',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ],
  };
}

let memoryState: AppState = getInitialState();
const listeners = new Set<(state: AppState) => void>();

function saveState() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    }
  } catch (err) {
    console.error('State persistence error:', err);
  }
  listeners.forEach((listener) => listener(memoryState));
}

export const store = {
  getState: (): AppState => memoryState,

  getCurrentUser: (): Profile | null => memoryState.currentUser,

  resetToSeed: () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
    memoryState = getInitialState();
    saveState();
  },

  subscribe: (listener: (state: AppState) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setCurrentUser: (profile: Profile | null) => {
    memoryState.currentUser = profile;
    saveState();
  },

  updateProfile: (updated: Partial<Profile>) => {
    if (!memoryState.currentUser) return;
    const newProfile = { ...memoryState.currentUser, ...updated, updated_at: new Date().toISOString() };
    memoryState.currentUser = newProfile;
    memoryState.profiles = memoryState.profiles.map((p) => (p.id === newProfile.id ? newProfile : p));
    saveState();
  },

  registerUser: (email: string, fullName: string, password?: string): Profile => {
    const newId = `u-${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      email,
      full_name: fullName,
      headline: 'New SkillLoop Learner & Teacher',
      bio: '',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      timezone: 'UTC',
      language: 'English',
      preferred_format: '1:1',
      free_exchange_only: true,
      paid_tutoring_offered: false,
      currency: 'USD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryState.profiles.push(newProfile);
    memoryState.currentUser = newProfile;
    saveState();
    return newProfile;
  },

  addCustomSkill: (name: string, categoryId: string, description: string, tags: string[] = []): Skill => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSkill: Skill = {
      id: `custom-s-${Date.now()}`,
      category_id: categoryId,
      name,
      slug,
      description,
      is_custom: true,
      created_by: memoryState.currentUser?.id,
      tags: tags.length > 0 ? tags : ['custom', slug],
    };
    memoryState.skills.push(newSkill);
    saveState();
    return newSkill;
  },

  addTeachingSkill: (skill: Omit<UserTeachingSkill, 'id'>): UserTeachingSkill => {
    const newTeach: UserTeachingSkill = {
      ...skill,
      id: `ts-${Date.now()}`,
      skill: memoryState.skills.find((s) => s.id === skill.skill_id),
    };
    memoryState.teachingSkills.push(newTeach);
    saveState();
    return newTeach;
  },

  removeTeachingSkill: (id: string) => {
    memoryState.teachingSkills = memoryState.teachingSkills.filter((ts) => ts.id !== id);
    saveState();
  },

  addLearningGoal: (goal: Omit<UserLearningGoal, 'id'>): UserLearningGoal => {
    const newGoal: UserLearningGoal = {
      ...goal,
      id: `lg-${Date.now()}`,
      skill: memoryState.skills.find((s) => s.id === goal.skill_id),
    };
    memoryState.learningGoals.push(newGoal);
    saveState();
    return newGoal;
  },

  removeLearningGoal: (id: string) => {
    memoryState.learningGoals = memoryState.learningGoals.filter((lg) => lg.id !== id);
    saveState();
  },

  sendMatchRequest: (receiverId: string, senderTeachesId: string, senderLearnsId: string, message?: string): MatchRequest => {
    const sender = memoryState.currentUser;
    if (!sender) {
      throw new Error('You must be signed in to send an exchange request.');
    }
    if (sender.id === receiverId) {
      throw new Error('You cannot propose a skill exchange with yourself.');
    }

    // Prevent duplicate pending requests for the same exchange pair (§7.3)
    const existingPending = memoryState.matchRequests.find(
      (r) =>
        r.status === 'pending' &&
        ((r.sender_id === sender.id && r.receiver_id === receiverId) ||
         (r.sender_id === receiverId && r.receiver_id === sender.id))
    );
    if (existingPending) {
      throw new Error('A pending exchange request between you and this member already exists.');
    }

    // Rate limiting (§7.5): Max 10 requests per user per hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const pastHourCount = memoryState.matchRequests.filter(
      (r) => r.sender_id === sender.id && r.created_at >= oneHourAgo
    ).length;
    if (pastHourCount >= 10) {
      throw new Error('Hourly exchange request limit reached (maximum 10 requests per hour). Please try again later.');
    }

    // Rate limiting (§7.5): Max 50 requests per user per day
    const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
    const pastDayCount = memoryState.matchRequests.filter(
      (r) => r.sender_id === sender.id && r.created_at >= oneDayAgo
    ).length;
    if (pastDayCount >= 50) {
      throw new Error('Daily exchange request limit reached (maximum 50 requests per day). Please try again tomorrow.');
    }

    const receiver = memoryState.profiles.find((p) => p.id === receiverId);
    const req: MatchRequest = {
      id: `req-${Date.now()}`,
      sender_id: sender.id,
      receiver_id: receiverId,
      sender_teaches_skill_id: senderTeachesId,
      sender_learns_skill_id: senderLearnsId,
      status: 'pending',
      message: message?.trim(),
      compatibility_score: 90,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender,
      receiver,
      sender_skill: memoryState.skills.find((s) => s.id === senderTeachesId),
      receiver_skill: memoryState.skills.find((s) => s.id === senderLearnsId),
    };
    memoryState.matchRequests.push(req);

    // Add notification for receiver
    memoryState.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: receiverId,
      title: 'New Connection Request',
      message: `${sender.full_name} sent you a skill exchange request!`,
      type: 'match_request',
      link: '/requests',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    saveState();
    return req;
  },

  updateMatchRequestStatus: (requestId: string, status: MatchRequest['status']) => {
    memoryState.matchRequests = memoryState.matchRequests.map((r) =>
      r.id === requestId ? { ...r, status, updated_at: new Date().toISOString() } : r
    );
    saveState();
  },

  saveResource: (resource: any, notes?: string): SavedResource => {
    const userId = memoryState.currentUser?.id || 'u-maya';
    const existing = memoryState.savedResources.find((sr) => sr.user_id === userId && sr.resource_id === resource.id);
    if (existing) {
      existing.notes = notes || existing.notes;
      saveState();
      return existing;
    }
    const newSaved: SavedResource = {
      id: `sr-${Date.now()}`,
      user_id: userId,
      resource_id: resource.id,
      resource,
      status: 'not_started',
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryState.savedResources.unshift(newSaved);
    saveState();
    return newSaved;
  },

  removeSavedResource: (savedId: string) => {
    memoryState.savedResources = memoryState.savedResources.filter((sr) => sr.id !== savedId);
    saveState();
  },

  updateSavedResourceStatus: (savedId: string, status: SavedResource['status'], notes?: string) => {
    memoryState.savedResources = memoryState.savedResources.map((sr) =>
      sr.id === savedId ? { ...sr, status, notes: notes !== undefined ? notes : sr.notes, updated_at: new Date().toISOString() } : sr
    );
    saveState();
  },

  savePersonalNote: (title: string, content: string, skillId?: string): PersonalNote => {
    const newNote: PersonalNote = {
      id: `pn-${Date.now()}`,
      user_id: memoryState.currentUser?.id || 'u-maya',
      skill_id: skillId,
      title,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryState.personalNotes.unshift(newNote);
    saveState();
    return newNote;
  },

  deletePersonalNote: (noteId: string) => {
    memoryState.personalNotes = memoryState.personalNotes.filter((pn) => pn.id !== noteId);
    saveState();
  },

  createSession: (session: Omit<LearningSession, 'id' | 'created_at'>): LearningSession => {
    const newSession: LearningSession = {
      ...session,
      id: `sess-${Date.now()}`,
      created_at: new Date().toISOString(),
      host: memoryState.profiles.find((p) => p.id === session.host_id),
      partner: memoryState.profiles.find((p) => p.id === session.partner_id),
      skill: memoryState.skills.find((s) => s.id === session.skill_id),
    };
    memoryState.sessions.unshift(newSession);

    // Notify partner
    memoryState.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: session.partner_id,
      title: 'New Session Proposal',
      message: `${newSession.host?.full_name || 'A partner'} proposed a session: "${session.title}".`,
      type: 'session_scheduled',
      link: '/sessions',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    saveState();
    return newSession;
  },

  updateSessionStatus: (sessionId: string, status: LearningSession['status']) => {
    memoryState.sessions = memoryState.sessions.map((s) =>
      s.id === sessionId ? { ...s, status, updated_at: new Date().toISOString() } : s
    );
    saveState();
  },

  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'created_at'>): QuizAttempt => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `qa-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    memoryState.quizAttempts.unshift(newAttempt);
    saveState();
    return newAttempt;
  },

  saveLearningPath: (path: LearningPath) => {
    const idx = memoryState.learningPaths.findIndex((p) => p.id === path.id);
    if (idx >= 0) {
      memoryState.learningPaths[idx] = path;
    } else {
      memoryState.learningPaths.unshift(path);
    }
    saveState();
  },

  toggleLearningPathStep: (pathId: string, stepId: string) => {
    const path = memoryState.learningPaths.find((p) => p.id === pathId);
    if (path) {
      const step = path.steps.find((s) => s.id === stepId);
      if (step) {
        step.is_completed = !step.is_completed;
        step.completed_at = step.is_completed ? new Date().toISOString() : undefined;
        const completedCount = path.steps.filter((s) => s.is_completed).length;
        path.progress_percent = Math.round((completedCount / path.steps.length) * 100);
        saveState();
      }
    }
  },

  submitReport: (reportedUserId: string, reason: ReportItem['reason'], details: string): ReportItem => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporter_id: memoryState.currentUser?.id || 'u-maya',
      reported_user_id: reportedUserId,
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    memoryState.reports.unshift(newReport);
    saveState();
    return newReport;
  },

  blockUser: (targetUserId: string) => {
    if (!memoryState.blockedUserIds.includes(targetUserId)) {
      memoryState.blockedUserIds.push(targetUserId);
      saveState();
    }
  },

  unblockUser: (targetUserId: string) => {
    memoryState.blockedUserIds = memoryState.blockedUserIds.filter((id) => id !== targetUserId);
    saveState();
  },

  markNotificationRead: (notifId: string) => {
    memoryState.notifications = memoryState.notifications.map((n) =>
      n.id === notifId ? { ...n, is_read: true } : n
    );
    saveState();
  },
};
