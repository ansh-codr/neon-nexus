// Mock health data for demo
export const mockHealthData = {
  name: "Student",
  sleepHours: 6.3,
  steps: 7200,
  activityLevel: "medium" as "low" | "medium" | "high",
  focusLevel: "low" as "low" | "medium" | "high",
  stressLevel: "medium" as "low" | "medium" | "high",
  examMode: false,
  date: "2026-01-31",
  healthScore: 72,
};

export const weeklyData = [
  { day: "Mon", sleep: 5.5, steps: 6200, score: 58 },
  { day: "Tue", sleep: 6.0, steps: 7100, score: 64 },
  { day: "Wed", sleep: 6.8, steps: 8500, score: 71 },
  { day: "Thu", sleep: 5.9, steps: 5800, score: 61 },
  { day: "Fri", sleep: 7.2, steps: 9200, score: 78 },
  { day: "Sat", sleep: 8.0, steps: 4500, score: 75 },
  { day: "Sun", sleep: 6.5, steps: 7200, score: 72 },
];

export const aiInsights = {
  normal: [
    "Your sleep pattern shows room for improvement. Consider winding down 30 minutes earlier tonight.",
    "Good activity levels today! A short evening walk could help with your focus.",
    "You're building momentum this week. Small consistent steps are paying off.",
  ],
  examMode: [
    "During exam prep, rest is your superpower. Your body heals and consolidates memory while you sleep.",
    "Take it easy on yourself. A 10-minute break every hour keeps your mind sharp without burnout.",
    "Remember: sustainable effort beats cramming. You're doing better than you think.",
  ],
};

export const weeklySummaries = {
  normal: "Your week shows improving consistency. Sleep averaged 6.5 hours with a positive trend towards the weekend. Keep building on Friday's momentum!",
  examMode: "This week you've maintained reasonable balance despite stress. Focus on quality rest over quantity of study hours.",
};

// Prompt templates for AI generation
export const prompts = {
  dailyInsight: `You are a supportive campus health assistant.
Generate a short, calm insight for a college student.

Context:
Sleep hours: {sleepHours}
Activity level: {activityLevel}
Focus level: {focusLevel}

Rules:
- Max 2 sentences
- Non-medical
- Friendly and realistic
- No guilt or judgment`,

  weeklySummary: `Summarize the past 7 days of health data for a college student.
Focus on patterns and balance, not exact numbers.
Tone should be encouraging and practical.
Limit to 2 sentences.`,

  examMode: `Generate a health suggestion for a college student during exam week.
Prioritize rest, mental balance, and sustainability.
Avoid performance pressure or productivity language.
Keep it short and reassuring.`,
};

export type HealthData = typeof mockHealthData;
export type WeeklyDataPoint = typeof weeklyData[0];
