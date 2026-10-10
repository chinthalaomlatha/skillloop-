import { describe, it, expect } from 'vitest';
import { moderateContent } from '../lib/moderationService';
import { getDomainProfile } from '../lib/aiMentorService';

describe('Content Moderation and Safety Tests (§5 & §16)', () => {
  it('flags commercial phishing and account hacking patterns', async () => {
    const maliciousInput = 'I will teach you how to hack account password quickly';
    const result = await moderateContent(maliciousInput, 'skill_description');
    expect(result.flagged).toBe(true);
    expect(result.reason).toContain('unauthorized access');
  });

  it('flags crypto doubling and get-rich-quick spam', async () => {
    const spamInput = 'Learn my crypto doubler method for 100% free money';
    const result = await moderateContent(spamInput, 'skill_description');
    expect(result.flagged).toBe(true);
  });

  it('approves legitimate educational skill proposals', async () => {
    const legitimateInput = 'Hands-on Python automation for spreadsheets and daily tasks';
    const result = await moderateContent(legitimateInput, 'skill_name');
    expect(result.flagged).toBe(false);
  });

  it('attaches mandatory physical safety disclaimers to fitness domains', () => {
    const calisthenicsProfile = getDomainProfile('Calisthenics & Bodyweight Fitness');
    expect(calisthenicsProfile.safetyDisclaimer).toBeDefined();
    expect(calisthenicsProfile.safetyDisclaimer).toContain('Safety Notice');
    expect(calisthenicsProfile.safetyDisclaimer).toContain('consult a qualified healthcare professional');

    const pythonProfile = getDomainProfile('Python Programming');
    expect(pythonProfile.safetyDisclaimer).toBeUndefined();
  });
});
