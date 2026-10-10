import { Profile, UserTeachingSkill, UserLearningGoal, SkillCircle, SkillCircleMember, SkillCircleMilestone, Skill } from '../types';

export interface UserNode {
  profile: Profile;
  teachingSkills: UserTeachingSkill[];
  learningGoals: UserLearningGoal[];
}

export interface ProposedCircleLoop {
  circleId: string;
  name: string;
  description: string;
  sharedGoal: string;
  isFallbackTwoPerson: boolean;
  loopSize: number;
  members: SkillCircleMember[];
  milestones: SkillCircleMilestone[];
  edgeExplanations: string[];
}

/**
 * Validates whether a candidate list of members forms a valid closed loop.
 * A teaches B, B teaches C, C teaches A (or A teaches B and B teaches A for 2-person fallback).
 */
export function validateCircleLoop(members: {
  userId: string;
  teachesSkillId: string;
  learnsSkillId: string;
  teachesToUserId: string;
}[]): { isValid: boolean; error?: string } {
  if (members.length < 2) {
    return { isValid: false, error: 'A circle requires at least 2 members.' };
  }

  // Check unique users
  const userIds = new Set(members.map((m) => m.userId));
  if (userIds.size !== members.length) {
    return { isValid: false, error: 'Duplicate user in circle proposal.' };
  }

  // Check cycle connectivity: every member's teachesToUserId must be another member
  for (const m of members) {
    if (!userIds.has(m.teachesToUserId)) {
      return { isValid: false, error: `Member ${m.userId} teaches to an external or missing user ${m.teachesToUserId}` };
    }
    if (m.userId === m.teachesToUserId) {
      return { isValid: false, error: 'A member cannot teach themselves in a Skill Circle loop.' };
    }
  }

  // Check that the cycle covers all members in a single connected graph loop
  const visited = new Set<string>();
  let current = members[0].userId;
  for (let i = 0; i < members.length; i++) {
    if (visited.has(current)) {
      break;
    }
    visited.add(current);
    const step = members.find((m) => m.userId === current);
    if (!step) break;
    current = step.teachesToUserId;
  }

  if (visited.size !== members.length || current !== members[0].userId) {
    return { isValid: false, error: 'The circle does not form a complete closed single-cycle loop.' };
  }

  return { isValid: true };
}

/**
 * Searches real users to find 3-person closed loops (A -> B -> C -> A).
 * If fewer than 3 users form a loop, falls back to honest 2-person mutual exchange (A <-> B).
 */
export function discoverSkillCircles(
  currentUser: UserNode,
  allUsers: UserNode[],
  skillsById: Record<string, Skill>
): ProposedCircleLoop[] {
  const circles: ProposedCircleLoop[] = [];
  const candidatePool = allUsers.filter((u) => u.profile.id !== currentUser.profile.id);

  // Look for 3-person cycles: CurrentUser (A) -> B -> C -> A
  // A teaches skill_X to B (B wants skill_X)
  // B teaches skill_Y to C (C wants skill_Y)
  // C teaches skill_Z to A (A wants skill_Z)
  for (const myTeach of currentUser.teachingSkills) {
    // Find all B candidates who want myTeach
    const bCandidates = candidatePool.filter((b) =>
      b.learningGoals.some((bg) => bg.skill_id === myTeach.skill_id)
    );

    for (const b of bCandidates) {
      for (const bTeach of b.teachingSkills) {
        // Find C candidates (not A, not B) who want bTeach
        const cCandidates = candidatePool.filter(
          (c) => c.profile.id !== b.profile.id && c.learningGoals.some((cg) => cg.skill_id === bTeach.skill_id)
        );

        for (const c of cCandidates) {
          // Check if C teaches what A wants to learn!
          for (const cTeach of c.teachingSkills) {
            const myLearning = currentUser.learningGoals.find((mg) => mg.skill_id === cTeach.skill_id);
            if (myLearning) {
              // Found a valid 3-person closed cycle!
              const skillXName = myTeach.skill?.name || skillsById[myTeach.skill_id]?.name || 'Skill 1';
              const skillYName = bTeach.skill?.name || skillsById[bTeach.skill_id]?.name || 'Skill 2';
              const skillZName = cTeach.skill?.name || skillsById[cTeach.skill_id]?.name || 'Skill 3';

              const circleId = `circle-3way-${currentUser.profile.id.slice(0, 4)}-${b.profile.id.slice(0, 4)}-${c.profile.id.slice(0, 4)}`;

              const memberA: SkillCircleMember = {
                id: `mem-${circleId}-a`,
                circle_id: circleId,
                user_id: currentUser.profile.id,
                teaches_skill_id: myTeach.skill_id,
                learns_skill_id: myLearning.skill_id,
                teaches_to_user_id: b.profile.id,
                status: 'accepted',
                role: 'initiator',
                profile: currentUser.profile,
                teaches_skill: myTeach.skill || skillsById[myTeach.skill_id],
                learns_skill: myLearning.skill || skillsById[myLearning.skill_id],
                teaches_to_profile: b.profile,
              };

              const memberB: SkillCircleMember = {
                id: `mem-${circleId}-b`,
                circle_id: circleId,
                user_id: b.profile.id,
                teaches_skill_id: bTeach.skill_id,
                learns_skill_id: myTeach.skill_id,
                teaches_to_user_id: c.profile.id,
                status: 'invited',
                role: 'member',
                profile: b.profile,
                teaches_skill: bTeach.skill || skillsById[bTeach.skill_id],
                learns_skill: myTeach.skill || skillsById[myTeach.skill_id],
                teaches_to_profile: c.profile,
              };

              const memberC: SkillCircleMember = {
                id: `mem-${circleId}-c`,
                circle_id: circleId,
                user_id: c.profile.id,
                teaches_skill_id: cTeach.skill_id,
                learns_skill_id: bTeach.skill_id,
                teaches_to_user_id: currentUser.profile.id,
                status: 'invited',
                role: 'member',
                profile: c.profile,
                teaches_skill: cTeach.skill || skillsById[cTeach.skill_id],
                learns_skill: bTeach.skill || skillsById[bTeach.skill_id],
                teaches_to_profile: currentUser.profile,
              };

              const milestones: SkillCircleMilestone[] = [
                {
                  id: `ms-${circleId}-1`,
                  circle_id: circleId,
                  title: 'Kickoff & Alignment Sync',
                  description: `Introduce circle members, review exchange schedule (${skillXName} ➔ ${skillYName} ➔ ${skillZName}), and agree on weekly cadence.`,
                  order_index: 1,
                  is_completed: false,
                },
                {
                  id: `ms-${circleId}-2`,
                  circle_id: circleId,
                  title: 'Core Fundamentals Exchange (Phase 1)',
                  description: 'First round of peer sessions: foundational theory, live demonstration, and setup assistance across all 3 nodes.',
                  order_index: 2,
                  is_completed: false,
                },
                {
                  id: `ms-${circleId}-3`,
                  circle_id: circleId,
                  title: 'Joint Showcase & Final Reflection',
                  description: 'Demonstrate tangible outputs from the loop: review each member’s progress and complete the circle feedback.',
                  order_index: 3,
                  is_completed: false,
                },
              ];

              const edgeExplanations = [
                `Edge 1: You (${currentUser.profile.full_name}) teach ${skillXName} to ${b.profile.full_name}.`,
                `Edge 2: ${b.profile.full_name} teaches ${skillYName} to ${c.profile.full_name}.`,
                `Edge 3: ${c.profile.full_name} teaches ${skillZName} to you (${currentUser.profile.full_name}).`,
              ];

              circles.push({
                circleId,
                name: `${skillXName} ➔ ${skillYName} ➔ ${skillZName} Circle`,
                description: `A verified 3-person reciprocal exchange circle where knowledge circulates seamlessly without requiring an outside instructor.`,
                sharedGoal: `Master complementary creative & technical skills through guided peer accountability.`,
                isFallbackTwoPerson: false,
                loopSize: 3,
                members: [memberA, memberB, memberC],
                milestones,
                edgeExplanations,
              });

              if (circles.length >= 3) return circles;
            }
          }
        }
      }
    }
  }

  // Sparse-Data Fallback (§7):
  // If no 3-person loop is possible yet with current profiles, check for 2-person mutual exchange
  if (circles.length === 0) {
    for (const myTeach of currentUser.teachingSkills) {
      for (const partner of candidatePool) {
        const partnerWantsMyTeach = partner.learningGoals.find((g) => g.skill_id === myTeach.skill_id);
        if (partnerWantsMyTeach) {
          for (const partnerTeach of partner.teachingSkills) {
            const iWantPartnerTeach = currentUser.learningGoals.find((g) => g.skill_id === partnerTeach.skill_id);
            if (iWantPartnerTeach) {
              const skillXName = myTeach.skill?.name || skillsById[myTeach.skill_id]?.name || 'Skill 1';
              const skillYName = partnerTeach.skill?.name || skillsById[partnerTeach.skill_id]?.name || 'Skill 2';

              const circleId = `fallback-2way-${currentUser.profile.id.slice(0, 4)}-${partner.profile.id.slice(0, 4)}`;

              const memberA: SkillCircleMember = {
                id: `mem-${circleId}-a`,
                circle_id: circleId,
                user_id: currentUser.profile.id,
                teaches_skill_id: myTeach.skill_id,
                learns_skill_id: iWantPartnerTeach.skill_id,
                teaches_to_user_id: partner.profile.id,
                status: 'accepted',
                role: 'initiator',
                profile: currentUser.profile,
                teaches_skill: myTeach.skill || skillsById[myTeach.skill_id],
                learns_skill: iWantPartnerTeach.skill || skillsById[iWantPartnerTeach.skill_id],
                teaches_to_profile: partner.profile,
              };

              const memberB: SkillCircleMember = {
                id: `mem-${circleId}-b`,
                circle_id: circleId,
                user_id: partner.profile.id,
                teaches_skill_id: partnerTeach.skill_id,
                learns_skill_id: myTeach.skill_id,
                teaches_to_user_id: currentUser.profile.id,
                status: 'invited',
                role: 'member',
                profile: partner.profile,
                teaches_skill: partnerTeach.skill || skillsById[partnerTeach.skill_id],
                learns_skill: myTeach.skill || skillsById[myTeach.skill_id],
                teaches_to_profile: currentUser.profile,
              };

              const milestones: SkillCircleMilestone[] = [
                {
                  id: `ms-${circleId}-1`,
                  circle_id: circleId,
                  title: 'Reciprocal Learning Agreement',
                  description: `Establish learning milestones for ${skillXName} and ${skillYName}.`,
                  order_index: 1,
                  is_completed: false,
                },
                {
                  id: `ms-${circleId}-2`,
                  circle_id: circleId,
                  title: 'Midpoint Peer Review',
                  description: 'Exchange practical exercises and review progress.',
                  order_index: 2,
                  is_completed: false,
                },
              ];

              circles.push({
                circleId,
                name: `${skillXName} ⇄ ${skillYName} (2-Person Exchange Loop)`,
                description: `Sparse-Data Fallback: Fewer than 3 compatible users currently form a triangular loop for these skills. Here is an honest 2-person reciprocal exchange. As more learners join, 3+ person circles will unlock.`,
                sharedGoal: `Mutual two-way exchange between ${currentUser.profile.full_name} and ${partner.profile.full_name}.`,
                isFallbackTwoPerson: true,
                loopSize: 2,
                members: [memberA, memberB],
                milestones,
                edgeExplanations: [
                  `Edge 1: You teach ${skillXName} to ${partner.profile.full_name}.`,
                  `Edge 2: ${partner.profile.full_name} teaches ${skillYName} to you.`,
                ],
              });

              if (circles.length >= 2) break;
            }
          }
        }
      }
    }
  }

  return circles;
}

/**
 * Scans the entire community to find all active 3-person reciprocal triangles.
 */
export function discoverAllCommunityCircles(
  allUsers: UserNode[],
  skillsById: Record<string, Skill>
): ProposedCircleLoop[] {
  const allCircles: ProposedCircleLoop[] = [];
  const seenKeys = new Set<string>();

  for (const user of allUsers) {
    const userLoops = discoverSkillCircles(user, allUsers, skillsById);
    for (const loop of userLoops) {
      if (!loop.isFallbackTwoPerson) {
        const sortedIds = loop.members.map((m) => m.user_id).sort().join('-');
        if (!seenKeys.has(sortedIds)) {
          seenKeys.add(sortedIds);
          allCircles.push(loop);
        }
      }
    }
  }

  return allCircles;
}
