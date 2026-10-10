import { Profile, UserTeachingSkill, UserLearningGoal, PeerMatch, ProficiencyLevel, MatchRequest } from '../types';

interface CandidateUser {
  profile: Profile;
  teachingSkills: UserTeachingSkill[];
  learningGoals: UserLearningGoal[];
}

export interface MatchingOptions {
  freeExchangeOnly?: boolean;
  minScore?: number;
}

const PROFICIENCY_RANKS: Record<string, number> = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

/**
 * Calculates a transparent, explainable compatibility score between currentUser and candidate.
 * Score is bounded strictly between 0 and 100.
 */
export function calculateCompatibility(
  currentUser: { profile: Profile; teachingSkills: UserTeachingSkill[]; learningGoals: UserLearningGoal[] },
  candidate: CandidateUser
): {
  score: number;
  breakdown: PeerMatch['scoreBreakdown'];
  matchedTeaching: UserTeachingSkill | null;
  matchedLearning: UserLearningGoal | null;
  explanation: string;
  exchangeOpportunity: string;
} {
  // 1. Identify Mutual Complementarity
  // Current user wants to learn what Candidate teaches
  let candidateCanTeachMe: UserTeachingSkill | null = null;
  let myLearningGoal: UserLearningGoal | null = null;

  for (const myGoal of currentUser.learningGoals) {
    const candidateTeach = candidate.teachingSkills.find(
      (ts) => ts.skill_id === myGoal.skill_id || (ts.skill && myGoal.skill && ts.skill.name.toLowerCase() === myGoal.skill.name.toLowerCase())
    );
    if (candidateTeach) {
      candidateCanTeachMe = candidateTeach;
      myLearningGoal = myGoal;
      break;
    }
  }

  // Candidate wants to learn what Current user teaches
  let iCanTeachCandidate: UserTeachingSkill | null = null;
  let candidateGoal: UserLearningGoal | null = null;

  for (const candGoal of candidate.learningGoals) {
    const myTeach = currentUser.teachingSkills.find(
      (ts) => ts.skill_id === candGoal.skill_id || (ts.skill && candGoal.skill && ts.skill.name.toLowerCase() === candGoal.skill.name.toLowerCase())
    );
    if (myTeach) {
      iCanTeachCandidate = myTeach;
      candidateGoal = candGoal;
      break;
    }
  }

  // 1. Skill Complement Score (0 to 50 points)
  let skillComplementScore = 0;
  if (candidateCanTeachMe && iCanTeachCandidate) {
    // Perfect two-way reciprocal exchange
    skillComplementScore = 50;
  } else if (candidateCanTeachMe || iCanTeachCandidate) {
    // One-way transfer only
    skillComplementScore = 20;
  }

  // 2. Proficiency Balance Score (0 to 20 points)
  let proficiencyBalanceScore = 0;
  if (candidateCanTeachMe && myLearningGoal) {
    const teacherRank = PROFICIENCY_RANKS[candidateCanTeachMe.proficiency_level] || 1;
    const targetRank = PROFICIENCY_RANKS[myLearningGoal.desired_proficiency] || 2;
    if (teacherRank >= targetRank) {
      proficiencyBalanceScore += 10;
    } else {
      proficiencyBalanceScore += 5;
    }
  }
  if (iCanTeachCandidate && candidateGoal) {
    const myTeacherRank = PROFICIENCY_RANKS[iCanTeachCandidate.proficiency_level] || 1;
    const candTargetRank = PROFICIENCY_RANKS[candidateGoal.desired_proficiency] || 2;
    if (myTeacherRank >= candTargetRank) {
      proficiencyBalanceScore += 10;
    } else {
      proficiencyBalanceScore += 5;
    }
  }

  // 3. Availability Overlap Score (0 to 15 points)
  let availabilityOverlapScore = 0;
  if (candidateCanTeachMe && iCanTeachCandidate) {
    const myHours = iCanTeachCandidate.availability_hours_per_week || 2;
    const candHours = candidateCanTeachMe.availability_hours_per_week || 2;
    const diff = Math.abs(myHours - candHours);
    if (diff <= 2) {
      availabilityOverlapScore = 15;
    } else if (diff <= 5) {
      availabilityOverlapScore = 10;
    } else {
      availabilityOverlapScore = 5;
    }
  } else {
    availabilityOverlapScore = 5;
  }

  // 4. Language and Format Score (0 to 15 points)
  let languageFormatScore = 0;
  const sameLanguage = currentUser.profile.language.toLowerCase() === candidate.profile.language.toLowerCase();
  const sameFormat = currentUser.profile.preferred_format === candidate.profile.preferred_format;

  if (sameLanguage) languageFormatScore += 10;
  if (sameFormat) languageFormatScore += 5;

  const totalScore = Math.min(100, skillComplementScore + proficiencyBalanceScore + availabilityOverlapScore + languageFormatScore);

  // Generate plain-language explainable text
  let explanation = '';
  let exchangeOpportunity = '';

  const candTeachName = candidateCanTeachMe?.skill?.name || 'their skill';
  const myTeachName = iCanTeachCandidate?.skill?.name || 'your skill';

  if (candidateCanTeachMe && iCanTeachCandidate) {
    explanation = `${candidate.profile.full_name} can teach you ${candTeachName} (${candidateCanTeachMe.proficiency_level}), while you can teach them ${myTeachName} (${iCanTeachCandidate.proficiency_level}). You share ${currentUser.profile.language} language preference.`;
    exchangeOpportunity = `Two-way reciprocal loop: ${candidate.profile.full_name} teaches ${candTeachName} ⇄ You teach ${myTeachName}.`;
  } else if (candidateCanTeachMe) {
    explanation = `${candidate.profile.full_name} teaches ${candTeachName}, which matches your learning goal. However, they are currently seeking different skills.`;
    exchangeOpportunity = `One-way transfer: ${candidate.profile.full_name} teaches ${candTeachName}.`;
  } else if (iCanTeachCandidate) {
    explanation = `You can teach ${myTeachName} to ${candidate.profile.full_name}, matching their learning goal.`;
    exchangeOpportunity = `One-way mentorship: You teach ${myTeachName} to ${candidate.profile.full_name}.`;
  } else {
    explanation = `Shared language (${candidate.profile.language}) and learning format (${candidate.profile.preferred_format}), but no immediate skill overlap.`;
    exchangeOpportunity = `Explore mutual interests or group circle learning.`;
  }

  return {
    score: totalScore,
    breakdown: {
      skillComplementScore,
      proficiencyBalanceScore,
      availabilityOverlapScore,
      languageFormatScore,
    },
    matchedTeaching: candidateCanTeachMe,
    matchedLearning: candidateGoal,
    explanation,
    exchangeOpportunity,
  };
}

/**
 * Discovers peer matches with free-first filtering and transparent rankings.
 */
export function findPeerMatches(
  currentUser: { profile: Profile; teachingSkills: UserTeachingSkill[]; learningGoals: UserLearningGoal[] },
  allCandidates: CandidateUser[],
  existingRequests: MatchRequest[] = [],
  options: MatchingOptions = {}
): PeerMatch[] {
  const { freeExchangeOnly = currentUser.profile.free_exchange_only, minScore = 30 } = options;

  // Filter out self
  let candidates = allCandidates.filter((c) => c.profile.id !== currentUser.profile.id);

  // Mandate: Free-first filtering before ranking
  if (freeExchangeOnly) {
    candidates = candidates.filter((c) => c.profile.free_exchange_only !== false);
  }

  const matches: PeerMatch[] = [];

  for (const cand of candidates) {
    const { score, breakdown, matchedTeaching, matchedLearning, explanation, exchangeOpportunity } = calculateCompatibility(
      currentUser,
      cand
    );

    if (score >= minScore && matchedTeaching && matchedLearning) {
      const existingReq = existingRequests.find(
        (r) => (r.sender_id === cand.profile.id && r.receiver_id === currentUser.profile.id) ||
               (r.sender_id === currentUser.profile.id && r.receiver_id === cand.profile.id)
      );

      matches.push({
        partnerId: cand.profile.id,
        partnerProfile: cand.profile,
        partnerTeaches: cand.teachingSkills,
        partnerLearns: cand.learningGoals,
        matchedTeachingSkill: matchedTeaching,
        matchedLearningGoal: matchedLearning,
        compatibilityScore: score,
        scoreBreakdown: breakdown,
        explanation,
        exchangeOpportunity,
        mutualAvailabilityOverlap: `${matchedTeaching.availability_hours_per_week || 2} hrs/wk matched availability`,
        isFreeExchange: cand.profile.free_exchange_only !== false,
        existingRequest: existingReq,
      });
    }
  }

  // Sort descending by explainable compatibility score
  return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
