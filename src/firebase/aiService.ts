import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { DedicationLevel, getAggregateStats } from './streaks';

// Collection for cached AI responses
const AI_CACHE_COLLECTION = 'aiCache';

// Types
export interface CachedQuote {
  quote: string;
  date: string;
  context: {
    examMode: boolean;
    stressLevel: string;
  };
  createdAt: Timestamp;
}

export interface AIInsight {
  type: 'dedication' | 'competitive' | 'comparison' | 'streak_risk' | 'quote';
  content: string;
  generatedAt: Timestamp;
}

// ===== PROMPT TEMPLATES =====

// PROMPT 1: Dedication Level Generator
const getDedicationPrompt = (healthStreak: number, studyStreak: number, balanceScore: number): string => `
You are evaluating consistency for a college student.

Context:
- Health streak: ${healthStreak} days
- Study streak: ${studyStreak} days
- Balance score: ${balanceScore.toFixed(2)}

Task:
Assign one dedication level from the following:
- Getting Started
- Consistent
- Focused
- Highly Dedicated

Rules:
- Favor balance over extremes
- Do not mention numbers
- Choose only one label
`;

// PROMPT 2: Competitive Insight (Aggregated)
const getCompetitivePrompt = (activeUsers: number, topStreak: number, avgConsistency: number): string => `
Generate a short motivational insight based on anonymized student activity.

Context:
- Number of active users today: ${activeUsers}
- Highest streak today: ${topStreak}
- Average consistency: ${avgConsistency.toFixed(1)}

Constraints:
- No individual names
- Encourage collective progress
- Max 1 sentence
`;

// PROMPT 3: User-to-User Comparison (LIMITED)
const getComparisonPrompt = (
  viewerStreak: number,
  peerStreak: number,
  viewerDedication: DedicationLevel,
  peerDedication: DedicationLevel
): string => `
Generate a neutral comparison insight for a student viewing peer progress.

Context:
- Viewer streak: ${viewerStreak}
- Peer streak: ${peerStreak}
- Viewer dedication: ${viewerDedication}
- Peer dedication: ${peerDedication}

Rules:
- Avoid superiority language
- Emphasize personal pace
- One sentence only
`;

// PROMPT 4: Quote of the Day (Generative AI Highlight)
const getQuotePrompt = (examMode: boolean, stressLevel: string): string => `
Generate a short motivational quote for a college student.

Context:
- Exam period: ${examMode}
- Average stress level: ${stressLevel}
- Focus on balance, not productivity

Rules:
- Original phrasing
- No famous quotes
- Max 20 words
- Calm and grounded tone
`;

// PROMPT 5: Streak Preservation Insight (User Retention)
const getStreakRiskPrompt = (currentStreak: number, missedDay: boolean): string => `
Generate a supportive message for a student whose streak may break.

Context:
- Current streak: ${currentStreak}
- Missed yesterday: ${missedDay}

Rules:
- No guilt
- Normalize breaks
- Encourage resuming, not restarting
- One sentence
`;

// ===== SIMULATED AI RESPONSES =====
// In production, replace with actual AI API calls (OpenAI, Claude, etc.)

const DEDICATION_RESPONSES: Record<DedicationLevel, string[]> = {
  'Getting Started': [
    'Your journey begins with a single step. Keep showing up.',
    'Building habits takes time. You\'re laying the foundation.',
    'Every expert was once a beginner. Stay curious.',
  ],
  'Consistent': [
    'Consistency is your superpower. It\'s showing.',
    'You\'ve found your rhythm. Keep the momentum.',
    'Showing up matters more than being perfect.',
  ],
  'Focused': [
    'Your dedication is becoming a pattern. Well done.',
    'Focus and consistency - a powerful combination.',
    'You\'re building something sustainable here.',
  ],
  'Highly Dedicated': [
    'Balance and dedication - you\'ve mastered both.',
    'Your commitment inspires. Lead by example.',
    'Excellence is a habit you\'ve cultivated.',
  ],
};

const COMPETITIVE_INSIGHTS = [
  'The campus is moving together. Every log counts.',
  'Collective progress builds collective success.',
  'Your peers are showing up. So are you.',
  'Together, we\'re building better habits.',
  'Small steps, many feet. That\'s how change happens.',
];

const COMPARISON_INSIGHTS = [
  'Everyone\'s journey is different. Focus on your path.',
  'Progress isn\'t a race. Your pace is perfect.',
  'Comparison is the thief of joy. Celebrate your wins.',
  'Different streaks, same goal: being better than yesterday.',
  'Your consistency matters. Don\'t compare, just commit.',
];

const QUOTES_BALANCED = [
  'Rest is part of the journey, not a detour.',
  'Progress over perfection, always.',
  'Today\'s small step is tomorrow\'s giant leap.',
  'Balance isn\'t still. It\'s dynamic and alive.',
  'You don\'t have to be great to start.',
  'Breathe. You\'re exactly where you need to be.',
  'Growth happens in the quiet moments too.',
  'Your well-being fuels your success.',
  'Take it one day at a time. That\'s enough.',
  'Sustainable beats intense every time.',
];

const QUOTES_EXAM = [
  'Exams measure a moment, not your worth.',
  'Your brain works better when you rest it.',
  'Stress is temporary. Your health isn\'t.',
  'One exam doesn\'t define your future.',
  'Pace yourself. The finish line will wait.',
  'Sleep is studying with your eyes closed.',
  'You\'ve prepared. Trust yourself.',
  'Breaks make breakthroughs possible.',
  'Anxiety lies. Your preparation is real.',
  'This too shall pass. You\'ve got this.',
];

const STREAK_RISK_MESSAGES = [
  'Missed a day? That\'s human. Jump back in when ready.',
  'Breaks don\'t erase progress. They\'re part of it.',
  'Your streak paused, not ended. Resume when you can.',
  'Life happens. Your consistency isn\'t measured in perfection.',
  'One day off doesn\'t undo what you\'ve built.',
];

// ===== AI SERVICE FUNCTIONS =====

// Get random item from array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate dedication insight
export const generateDedicationInsight = async (
  healthStreak: number,
  studyStreak: number,
  dedicationLevel: DedicationLevel
): Promise<string> => {
  // In production: Use actual AI API with getDedicationPrompt()
  // For now, return simulated response
  return getRandomItem(DEDICATION_RESPONSES[dedicationLevel]);
};

// Generate competitive insight
export const generateCompetitiveInsight = async (): Promise<string> => {
  try {
    const stats = await getAggregateStats();
    // In production: Use actual AI API with getCompetitivePrompt()
    
    if (stats.activeUsers === 0) {
      return 'Be the first to log today and lead by example.';
    }
    
    if (stats.activeUsers === 1) {
      return 'One student has logged today. The journey begins with one.';
    }
    
    return getRandomItem(COMPETITIVE_INSIGHTS)
      .replace('{activeUsers}', stats.activeUsers.toString())
      .replace('{topStreak}', stats.topStreak.toString());
  } catch (error) {
    return getRandomItem(COMPETITIVE_INSIGHTS);
  }
};

// Generate comparison insight
export const generateComparisonInsight = async (
  viewerStreak: number,
  peerStreak: number,
  viewerDedication: DedicationLevel,
  peerDedication: DedicationLevel
): Promise<string> => {
  // In production: Use actual AI API with getComparisonPrompt()
  return getRandomItem(COMPARISON_INSIGHTS);
};

// Generate quote of the day (cached)
export const generateQuoteOfTheDay = async (
  examMode: boolean = false,
  stressLevel: string = 'medium'
): Promise<string> => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `quote_${today}_${examMode}_${stressLevel}`;

  try {
    // Check cache first
    const cacheRef = doc(db, AI_CACHE_COLLECTION, cacheKey);
    const cached = await getDoc(cacheRef);

    if (cached.exists()) {
      return (cached.data() as CachedQuote).quote;
    }

    // Generate new quote
    // In production: Use actual AI API with getQuotePrompt()
    const quotes = examMode ? QUOTES_EXAM : QUOTES_BALANCED;
    const quote = getRandomItem(quotes);

    // Cache it
    await setDoc(cacheRef, {
      quote,
      date: today,
      context: { examMode, stressLevel },
      createdAt: serverTimestamp(),
    });

    return quote;
  } catch (error) {
    console.error('Error generating quote:', error);
    const quotes = examMode ? QUOTES_EXAM : QUOTES_BALANCED;
    return getRandomItem(quotes);
  }
};

// Generate streak risk message
export const generateStreakRiskMessage = async (
  currentStreak: number,
  missedYesterday: boolean
): Promise<string> => {
  // In production: Use actual AI API with getStreakRiskPrompt()
  return getRandomItem(STREAK_RISK_MESSAGES);
};

// ===== BATCH GENERATION FOR DASHBOARD =====

export interface DashboardInsights {
  dedicationInsight: string;
  competitiveInsight: string;
  quoteOfTheDay: string;
  streakRiskMessage: string | null;
}

export const generateDashboardInsights = async (
  healthStreak: number,
  studyStreak: number,
  dedicationLevel: DedicationLevel,
  examMode: boolean,
  stressLevel: string,
  isAtRisk: boolean
): Promise<DashboardInsights> => {
  const [dedicationInsight, competitiveInsight, quoteOfTheDay] = await Promise.all([
    generateDedicationInsight(healthStreak, studyStreak, dedicationLevel),
    generateCompetitiveInsight(),
    generateQuoteOfTheDay(examMode, stressLevel),
  ]);

  let streakRiskMessage = null;
  if (isAtRisk) {
    streakRiskMessage = await generateStreakRiskMessage(
      Math.max(healthStreak, studyStreak),
      true
    );
  }

  return {
    dedicationInsight,
    competitiveInsight,
    quoteOfTheDay,
    streakRiskMessage,
  };
};

// Export prompt templates for reference
export const PROMPT_TEMPLATES = {
  dedication: getDedicationPrompt,
  competitive: getCompetitivePrompt,
  comparison: getComparisonPrompt,
  quote: getQuotePrompt,
  streakRisk: getStreakRiskPrompt,
};
