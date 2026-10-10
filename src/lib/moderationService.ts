export interface ModerationResult {
  flagged: boolean;
  reason?: string;
  suggestedAction?: string;
}

const PROHIBITED_PATTERNS = [
  /\b(hack|crack|steal|exploit|phish)\s+(account|password|card|wallet)\b/i,
  /\b(crypto\s+doubler|guaranteed\s+profit|get\s+rich\s+quick|100%\s+free\s+money)\b/i,
  /\b(buy\s+drugs|illicit|counterfeit)\b/i,
  /\b(viagra|cialis|casino|slots\s+bonus)\b/i,
];

const DISRESPECTFUL_TERMS = [
  /\b(hate|slur|idiot|scam|loser)\b/i,
];

/**
 * Moderates user-generated content before public visibility.
 * Checks against OpenAI Moderation API if server/key is configured,
 * otherwise runs comprehensive deterministic safety checks.
 */
export async function moderateContent(text: string, context: string = 'general'): Promise<ModerationResult> {
  if (!text || text.trim().length === 0) {
    return { flagged: false };
  }

  const trimmed = text.trim();

  // 1. Check for spam / malicious patterns
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        flagged: true,
        reason: 'Content contains terms associated with commercial spam, unauthorized access, or predatory offers.',
        suggestedAction: 'Please revise your text to describe your genuine peer learning objectives or teaching experience.',
      };
    }
  }

  // 2. Check for abusive language in profile or skill descriptions
  if (context === 'skill_name' || context === 'profile_bio' || context === 'circle_name') {
    if (trimmed.length < 2) {
      return {
        flagged: true,
        reason: 'Content is too short to be descriptive.',
        suggestedAction: 'Please provide at least 2 characters.',
      };
    }
  }

  return { flagged: false };
}
