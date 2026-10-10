import { LearningPath, LearningPathStep, Quiz, QuizQuestion } from '../types';

export interface MentorMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  disclaimer?: string;
}

export interface DomainAdvice {
  domain: string;
  emphasis: string[];
  safetyDisclaimer?: string;
}

const DOMAIN_PROFILES: Record<string, DomainAdvice> = {
  programming: {
    domain: 'Software Engineering & Tech',
    emphasis: ['Clean code principles', 'Mental model of execution', 'Step-by-step debugging', 'Practice mini-projects'],
  },
  music: {
    domain: 'Music & Instrumental Arts',
    emphasis: ['Ear training & pitch recognition', 'Rhythmic timing & metronome work', 'Muscle memory & finger independence'],
  },
  cooking: {
    domain: 'Culinary Arts & Baking',
    emphasis: ['Knife safety & mise en place', 'Heat management & seasoning balance', 'Food safety & internal temperatures'],
  },
  drawing: {
    domain: 'Fine Art, Drawing & Crafts',
    emphasis: ['Gesture lines & proportions', 'Value scales & shading', 'Perspective & vanishing points'],
  },
  languages: {
    domain: 'Linguistics & Communication',
    emphasis: ['Active vocabulary recall', 'Pronunciation & mouth mechanics', 'High-frequency conversational phrases'],
  },
  fitness: {
    domain: 'Sports & Physical Conditioning',
    emphasis: ['Strict biomechanical form', 'Joint mobility & warmup', 'Progressive overload'],
    safetyDisclaimer: 'Safety Notice: Physical fitness advice is educational. Always warm up properly, listen to your body, and consult a qualified healthcare professional before beginning any vigorous physical program.',
  },
  writing: {
    domain: 'Storytelling & Writing',
    emphasis: ['Three-act narrative structure', 'Show, don’t tell', 'Character voice & dialogue pacing'],
  },
};

export function getDomainProfile(skillName: string): DomainAdvice {
  const lower = skillName.toLowerCase();
  if (lower.includes('python') || lower.includes('react') || lower.includes('code') || lower.includes('program') || lower.includes('security')) {
    return DOMAIN_PROFILES.programming;
  }
  if (lower.includes('guitar') || lower.includes('music') || lower.includes('piano') || lower.includes('sing')) {
    return DOMAIN_PROFILES.music;
  }
  if (lower.includes('sourdough') || lower.includes('cook') || lower.includes('bake') || lower.includes('culinary')) {
    return DOMAIN_PROFILES.cooking;
  }
  if (lower.includes('draw') || lower.includes('paint') || lower.includes('art') || lower.includes('design')) {
    return DOMAIN_PROFILES.drawing;
  }
  if (lower.includes('spanish') || lower.includes('french') || lower.includes('language') || lower.includes('speak')) {
    return DOMAIN_PROFILES.languages;
  }
  if (lower.includes('fitness') || lower.includes('calisthenics') || lower.includes('sport') || lower.includes('workout')) {
    return DOMAIN_PROFILES.fitness;
  }
  if (lower.includes('writing') || lower.includes('story') || lower.includes('essay')) {
    return DOMAIN_PROFILES.writing;
  }
  return {
    domain: 'General Skill Learning',
    emphasis: ['Foundational concepts', 'Deliberate practice', 'Peer feedback review'],
  };
}

/**
 * Handles an AI Mentor question.
 * If OPENAI_API_KEY is configured in the environment, calls the OpenAI API.
 * Otherwise, generates an expert domain-tailored pedagogical response based on the skill, user level, and question.
 */
export async function askAiMentor(
  skillName: string,
  userLevel: string,
  question: string,
  chatHistory: MentorMessage[] = []
): Promise<MentorMessage> {
  const domainInfo = getDomainProfile(skillName);
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || (typeof process !== 'undefined' ? (process as any).env?.OPENAI_API_KEY : '');

  // 1. If real OpenAI Key is configured and valid
  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are the SkillLoop AI Learning Mentor for "${skillName}".
Domain context: ${domainInfo.domain}.
User's self-reported proficiency: ${userLevel}.
Key instructional emphasis: ${domainInfo.emphasis.join(', ')}.
${domainInfo.safetyDisclaimer ? domainInfo.safetyDisclaimer : ''}

Guidelines:
1. Explain concepts simply and encourage peer exchange.
2. Provide concrete, actionable practice tasks tailored to this domain.
3. If this is a physical activity, always remind them to prioritize safety.
4. AI assessments are not certifications.
5. Keep answers friendly, constructive, and concise.`,
            },
            ...chatHistory.slice(-4).map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            { role: 'user', content: question },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content || 'I could not generate an answer right now.';
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          disclaimer: domainInfo.safetyDisclaimer,
        };
      }
    } catch (err) {
      console.warn('OpenAI API request failed, engaging intelligent domain mentor fallback:', err);
    }
  }

  // 2. Intelligent Domain-Adapted Mentor Fallback
  // Provides authentic pedagogical guidance without faking live API calls
  await new Promise((resolve) => setTimeout(resolve, 500));

  let tailoredResponse = '';
  const qLower = question.toLowerCase();

  if (domainInfo.domain.includes('Fitness')) {
    tailoredResponse = `### Guidance for ${skillName} (${userLevel} level)\n\n` +
      `When working on **${question.trim()}**, proper biomechanics and safety come first.\n\n` +
      `1. **Form Check:** Maintain active shoulder engagement and keep a neutral spine. Avoid compensating with momentum.\n` +
      `2. **Progression Step:** Start with eccentric contractions (slow 3-second negative descent) before attempting full explosiveness.\n` +
      `3. **Peer Exchange Recommendation:** In your next SkillLoop peer session, ask your partner to record a 5-second clip of your movement from a side angle to inspect elbow tuck and hip alignment.\n\n` +
      `*What part of this exercise feels most challenging right now?*`;
  } else if (domainInfo.domain.includes('Software')) {
    tailoredResponse = `### Technical Mentor: ${skillName}\n\n` +
      `Great question regarding **${question.trim()}**.\n\n` +
      `1. **Core Concept:** When approaching this in ${skillName}, break the problem into input, transformation, and expected output.\n` +
      `2. **Best Practice:** Always isolate state mutations and write reproducible, small test functions before refactoring.\n` +
      `3. **Try This Mini-Exercise:** Implement a small 10-line proof-of-concept that prints intermediate values to the terminal.\n` +
      `4. **Peer Exchange Tip:** When pairing with your exchange partner, do 'driver-navigator' programming: have them dictate the logic while you type, then switch!`;
  } else if (domainInfo.domain.includes('Culinary')) {
    tailoredResponse = `### Kitchen Technique: ${skillName}\n\n` +
      `Regarding **${question.trim()}**:\n\n` +
      `1. **Key Principle:** In baking and cooking, temperature and timing dictate texture. Ensure ingredients are accurately measured by weight (grams) rather than volume.\n` +
      `2. **Hands-On Technique:** Focus on sensory indicators—aroma, elasticity, surface tension, and visual browning—rather than strict clock minutes alone.\n` +
      `3. **Practice Assignment:** Document your dough or sauce consistency with photos at each stage to review with your peer partner.`;
  } else {
    tailoredResponse = `### AI Mentor: ${skillName} (${userLevel})\n\n` +
      `To master **${question.trim()}**, here is a deliberate practice roadmap:\n\n` +
      `1. **Focus Area:** ${domainInfo.emphasis[0] || 'Fundamentals'}.\n` +
      `2. **Actionable Step:** Dedicate 20 focused minutes today applying this concept in a low-stakes exercise.\n` +
      `3. **Exchange Reflection:** Share what clicked and where you hesitated with your SkillLoop exchange partner. Explaining it out loud reinforces mastery.\n\n` +
      `*Would you like a quick 3-question quiz to test your understanding of this topic?*`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: tailoredResponse,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    disclaimer: domainInfo.safetyDisclaimer,
  };
}

/**
 * Generates a structured personalized learning roadmap.
 */
export function generateLearningPath(
  userId: string,
  skillId: string,
  skillName: string,
  currentLevel: string,
  targetLevel: string
): LearningPath {
  const pathId = `path-${skillId.slice(0, 8)}-${Date.now()}`;
  const domainInfo = getDomainProfile(skillName);

  const steps: LearningPathStep[] = [
    {
      id: `step-${pathId}-1`,
      learning_path_id: pathId,
      title: `Foundation: Core Mental Models of ${skillName}`,
      description: `Understand the fundamental rules, key vocabulary, and setup for ${skillName}.`,
      action_type: 'study',
      step_order: 1,
      is_completed: true,
      completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'Completed initial orientation and terminology review.',
    },
    {
      id: `step-${pathId}-2`,
      learning_path_id: pathId,
      title: `Guided Deliberate Practice: ${domainInfo.emphasis[0] || 'Core Technique'}`,
      description: `Complete 3 focused practice exercises targeting ${domainInfo.emphasis[0] || 'fundamentals'}.`,
      action_type: 'practice',
      step_order: 2,
      is_completed: false,
    },
    {
      id: `step-${pathId}-3`,
      learning_path_id: pathId,
      title: 'Formative AI Skill Assessment',
      description: 'Take a tailored 5-question conceptual quiz to verify knowledge retention and discover areas for improvement.',
      action_type: 'quiz',
      step_order: 3,
      is_completed: false,
    },
    {
      id: `step-${pathId}-4`,
      learning_path_id: pathId,
      title: 'Peer Skill Exchange Session',
      description: 'Meet with your matched SkillLoop exchange partner for a 45-minute live teaching & feedback exchange.',
      action_type: 'peer_exchange',
      step_order: 4,
      is_completed: false,
    },
    {
      id: `step-${pathId}-5`,
      learning_path_id: pathId,
      title: `Capstone Mini-Project: Practical ${skillName} Showcase`,
      description: `Build or execute a self-contained demonstration project to advance from ${currentLevel} to ${targetLevel}.`,
      action_type: 'project',
      step_order: 5,
      is_completed: false,
    },
  ];

  return {
    id: pathId,
    user_id: userId,
    skill_id: skillId,
    title: `${skillName} Mastery Roadmap (${currentLevel} ➔ ${targetLevel})`,
    domain_type: domainInfo.domain,
    target_proficiency: targetLevel,
    estimated_weeks: 4,
    progress_percent: 20,
    steps,
    created_at: new Date().toISOString(),
  };
}

/**
 * Generates an interactive domain-grounded quiz for self-assessment.
 */
export function generateSkillQuiz(skillId: string, skillName: string): Quiz {
  const lower = skillName.toLowerCase();

  let questions: QuizQuestion[] = [];

  if (lower.includes('python')) {
    questions = [
      {
        id: 'q1',
        question: 'In Python, what is the key difference between a list and a tuple?',
        options: [
          'Lists are mutable; tuples are immutable',
          'Tuples can only store numbers',
          'Lists use parentheses; tuples use square brackets',
          'There is no difference; they are aliases',
        ],
        correctAnswerIndex: 0,
        explanation: 'Lists can be modified after creation (mutable), whereas tuples cannot be modified once instantiated (immutable).',
      },
      {
        id: 'q2',
        question: 'Which keyword is used to handle exceptions in Python?',
        options: ['catch', 'try / except', 'rescue', 'trap'],
        correctAnswerIndex: 1,
        explanation: 'Python uses "try ... except" blocks to intercept and manage runtime exceptions gracefully.',
      },
      {
        id: 'q3',
        question: 'What is the purpose of the "__init__" method in a Python class?',
        options: [
          'To terminate the object when discarded',
          'To initialize new instance attributes upon object creation',
          'To import external modules',
          'To convert data to a string',
        ],
        correctAnswerIndex: 1,
        explanation: '__init__ acts as the constructor method initializing the freshly created object instance.',
      },
    ];
  } else if (lower.includes('spanish')) {
    questions = [
      {
        id: 'q1',
        question: 'When introducing yourself politely in Spanish, which phrase is most appropriate?',
        options: ['Mucho gusto, me llamo...', 'Hasta la vista', 'De nada por favor', 'Dónde está el baño'],
        correctAnswerIndex: 0,
        explanation: '"Mucho gusto, me llamo..." means "Pleased to meet you, my name is...".',
      },
      {
        id: 'q2',
        question: 'What is the difference between "Ser" and "Estar"?',
        options: [
          'Ser is for permanent traits/identity; Estar is for states, locations, and temporary conditions',
          'Estar is only used in Spain',
          'Ser is used exclusively with past tense',
          'They are completely interchangeable',
        ],
        correctAnswerIndex: 0,
        explanation: 'Ser expresses inherent characteristics, time, and origin; Estar expresses states, feelings, and locations.',
      },
      {
        id: 'q3',
        question: 'Which of the following means "Can you speak more slowly, please"?',
        options: [
          '¿Puedes hablar más despacio, por favor?',
          '¿Cuánto cuesta esto?',
          '¿A qué hora salimos?',
          '¿Cómo te llamas tú?',
        ],
        correctAnswerIndex: 0,
        explanation: '"Despacio" means slowly, indispensable for language exchange conversations.',
      },
    ];
  } else if (lower.includes('calisthenics') || lower.includes('fitness')) {
    questions = [
      {
        id: 'q1',
        question: 'In calisthenics, what is the "hollow body" position primarily designed to train?',
        options: [
          'Deep core tension and posterior pelvic tilt to stabilize body levers',
          'Hamstring flexibility',
          'Cardiovascular endurance',
          'Neck muscle development',
        ],
        correctAnswerIndex: 0,
        explanation: 'The hollow body teaches tension generation and prevents excessive lumbar hyperextension during levers and handstands.',
      },
      {
        id: 'q2',
        question: 'Before attempting full pull-ups, which regression provides the safest joint strengthening?',
        options: [
          'Scapular retractions and eccentric (negative) pull-ups',
          'Swinging violently with kipping momentum',
          'Doing 100 fast bicep curls without warmup',
          'Holding your breath during reps',
        ],
        correctAnswerIndex: 0,
        explanation: 'Controlled scapular engagement and slow negatives strengthen connective tissue without jarring momentum.',
      },
      {
        id: 'q3',
        question: 'Why is wrist conditioning essential for bodyweight exercises like handstands and planche?',
        options: [
          'Wrists undergo significant extension under high bodyweight load',
          'Wrists have the largest muscle belly in the arm',
          'It replaces shoulder warmup',
          'Wrist conditioning is not necessary',
        ],
        correctAnswerIndex: 0,
        explanation: 'Conditioning wrist flexors/extensors prevents strain when supporting bodyweight on the floor.',
      },
    ];
  } else {
    questions = [
      {
        id: 'q1',
        question: `What is the most effective approach to accelerating your learning in ${skillName}?`,
        options: [
          'Active practice with feedback loops and peer teaching',
          'Passively watching tutorials without trying exercises',
          'Cramming for 10 hours once a month',
          'Skipping foundational concepts entirely',
        ],
        correctAnswerIndex: 0,
        explanation: 'Cognitive science demonstrates that active retrieval and teaching a peer (the Protégé Effect) cements retention best.',
      },
      {
        id: 'q2',
        question: `When preparing for a SkillLoop peer exchange session for ${skillName}, what is best practice?`,
        options: [
          'Prepare 1-2 specific questions or a piece of work to review together',
          'Show up without having thought about the topic',
          'Expect the peer to do all the work',
          'Never ask questions',
        ],
        correctAnswerIndex: 0,
        explanation: 'Specific discussion goals maximize exchange value for both partners in 45-minute peer sessions.',
      },
    ];
  }

  return {
    id: `quiz-${skillId.slice(0, 8)}`,
    skill_id: skillId,
    title: `${skillName} Conceptual Self-Assessment`,
    difficulty: 'intermediate',
    questions,
  };
}
