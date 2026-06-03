/**
 * Local Storage Utilities for Basma App
 * Handles all persistent data storage for user progress, moods, journals, and challenges
 */

// Type definitions
export interface MoodEntry {
  date: string;
  mood: "sad" | "anxious" | "neutral" | "good" | "great";
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
}

export interface LogicalChallenge {
  id: number;
  completed: boolean;
  attempts: number;
  correctAnswer: boolean;
  timestamp: number;
}

export interface CreativeSubmission {
  id: string;
  type: "story" | "drawing";
  content: string;
  prompt?: string;
  evaluation?: string;
  timestamp: number;
}

export interface MathChallenge {
  difficulty: "easy" | "medium" | "hard";
  score: number;
  totalQuestions: number;
  timeSpent: number;
  accuracy: number;
  timestamp: number;
}

export interface UserStats {
  totalMoodEntries: number;
  totalJournalEntries: number;
  logicalChallengesCompleted: number;
  creativeSubmissions: number;
  mathChallengesCompleted: number;
  currentStreak: number;
  lastActivityDate: string;
}

// Storage keys
const STORAGE_KEYS = {
  MOODS: "basma_moods",
  JOURNALS: "basma_journals",
  LOGICAL_CHALLENGES: "basma_logical_challenges",
  CREATIVE_SUBMISSIONS: "basma_creative_submissions",
  MATH_CHALLENGES: "basma_math_challenges",
  USER_STATS: "basma_user_stats",
};

// Mood Management
export const moodStorage = {
  addMood: (mood: "sad" | "anxious" | "neutral" | "good" | "great") => {
    const moods = moodStorage.getMoods();
    const today = new Date().toISOString().split("T")[0];

    // Remove existing mood for today
    const filtered = moods.filter((m) => m.date !== today);

    const newMood: MoodEntry = {
      date: today,
      mood,
      timestamp: Date.now(),
    };

    filtered.push(newMood);
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(filtered));
    updateStats();
    return newMood;
  },

  getMoods: (): MoodEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MOODS);
    return data ? JSON.parse(data) : [];
  },

  getMoodsByWeek: (): MoodEntry[] => {
    const moods = moodStorage.getMoods();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return moods.filter((m) => new Date(m.date) >= sevenDaysAgo);
  },

  getTodayMood: (): MoodEntry | null => {
    const today = new Date().toISOString().split("T")[0];
    const moods = moodStorage.getMoods();
    return moods.find((m) => m.date === today) || null;
  },

  getMoodStats: () => {
    const moods = moodStorage.getMoodsByWeek();
    const moodCounts = {
      sad: 0,
      anxious: 0,
      neutral: 0,
      good: 0,
      great: 0,
    };

    moods.forEach((m) => {
      moodCounts[m.mood]++;
    });

    return moodCounts;
  },
};

// Journal Management
export const journalStorage = {
  addEntry: (content: string): JournalEntry => {
    const entries = journalStorage.getEntries();
    const newEntry: JournalEntry = {
      id: `journal_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      content,
      timestamp: Date.now(),
    };

    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(entries));
    updateStats();
    return newEntry;
  },

  getEntries: (): JournalEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return data ? JSON.parse(data) : [];
  },

  getEntriesByDate: (date: string): JournalEntry[] => {
    const entries = journalStorage.getEntries();
    return entries.filter((e) => e.date === date);
  },

  deleteEntry: (id: string) => {
    const entries = journalStorage.getEntries();
    const filtered = entries.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(filtered));
    updateStats();
  },

  getTodayEntries: (): JournalEntry[] => {
    const today = new Date().toISOString().split("T")[0];
    return journalStorage.getEntriesByDate(today);
  },
};

// Logical Thinking Management
export const logicalStorage = {
  addChallenge: (id: number, correct: boolean) => {
    const challenges = logicalStorage.getChallenges();
    const existing = challenges.find((c) => c.id === id);

    if (existing) {
      existing.attempts++;
      if (correct) {
        existing.completed = true;
        existing.correctAnswer = true;
      }
    } else {
      challenges.push({
        id,
        completed: correct,
        attempts: 1,
        correctAnswer: correct,
        timestamp: Date.now(),
      });
    }

    localStorage.setItem(STORAGE_KEYS.LOGICAL_CHALLENGES, JSON.stringify(challenges));
    updateStats();
  },

  getChallenges: (): LogicalChallenge[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGICAL_CHALLENGES);
    return data ? JSON.parse(data) : [];
  },

  getCompletedCount: (): number => {
    return logicalStorage.getChallenges().filter((c) => c.completed).length;
  },

  getStats: () => {
    const challenges = logicalStorage.getChallenges();
    const completed = challenges.filter((c) => c.completed).length;
    const totalAttempts = challenges.reduce((sum, c) => sum + c.attempts, 0);
    const accuracy = challenges.length > 0 ? (completed / challenges.length) * 100 : 0;

    return {
      completed,
      total: challenges.length,
      totalAttempts,
      accuracy: Math.round(accuracy),
    };
  },
};

// Creativity Management
export const creativityStorage = {
  addSubmission: (type: "story" | "drawing", content: string, prompt?: string, evaluation?: string) => {
    const submissions = creativityStorage.getSubmissions();
    const newSubmission: CreativeSubmission = {
      id: `creative_${Date.now()}`,
      type,
      content,
      prompt,
      evaluation,
      timestamp: Date.now(),
    };

    submissions.push(newSubmission);
    localStorage.setItem(STORAGE_KEYS.CREATIVE_SUBMISSIONS, JSON.stringify(submissions));
    updateStats();
    return newSubmission;
  },

  getSubmissions: (): CreativeSubmission[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CREATIVE_SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  },

  getSubmissionsByType: (type: "story" | "drawing"): CreativeSubmission[] => {
    return creativityStorage.getSubmissions().filter((s) => s.type === type);
  },

  updateEvaluation: (id: string, evaluation: string) => {
    const submissions = creativityStorage.getSubmissions();
    const submission = submissions.find((s) => s.id === id);
    if (submission) {
      submission.evaluation = evaluation;
      localStorage.setItem(STORAGE_KEYS.CREATIVE_SUBMISSIONS, JSON.stringify(submissions));
    }
  },

  deleteSubmission: (id: string) => {
    const submissions = creativityStorage.getSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.CREATIVE_SUBMISSIONS, JSON.stringify(filtered));
    updateStats();
  },

  getTodaySubmissions: (): CreativeSubmission[] => {
    const today = new Date().toISOString().split("T")[0];
    return creativityStorage.getSubmissions().filter((s) => {
      const submissionDate = new Date(s.timestamp).toISOString().split("T")[0];
      return submissionDate === today;
    });
  },
};

// Math Challenges Management
export const mathStorage = {
  addChallenge: (difficulty: "easy" | "medium" | "hard", score: number, totalQuestions: number, timeSpent: number) => {
    const challenges = mathStorage.getChallenges();
    const accuracy = (score / totalQuestions) * 100;

    const newChallenge: MathChallenge = {
      difficulty,
      score,
      totalQuestions,
      timeSpent,
      accuracy: Math.round(accuracy),
      timestamp: Date.now(),
    };

    challenges.push(newChallenge);
    localStorage.setItem(STORAGE_KEYS.MATH_CHALLENGES, JSON.stringify(challenges));
    updateStats();
    return newChallenge;
  },

  getChallenges: (): MathChallenge[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MATH_CHALLENGES);
    return data ? JSON.parse(data) : [];
  },

  getChallengesByDifficulty: (difficulty: "easy" | "medium" | "hard"): MathChallenge[] => {
    return mathStorage.getChallenges().filter((c) => c.difficulty === difficulty);
  },

  getStats: () => {
    const challenges = mathStorage.getChallenges();
    if (challenges.length === 0) {
      return {
        totalChallenges: 0,
        averageAccuracy: 0,
        bestSpeed: 0,
        totalTimeSpent: 0,
        byDifficulty: {
          easy: { completed: 0, accuracy: 0 },
          medium: { completed: 0, accuracy: 0 },
          hard: { completed: 0, accuracy: 0 },
        },
      };
    }

    const avgAccuracy = Math.round(challenges.reduce((sum, c) => sum + c.accuracy, 0) / challenges.length);
    const bestSpeed = Math.max(...challenges.map((c) => c.score / (c.timeSpent / 60)));
    const totalTime = challenges.reduce((sum, c) => sum + c.timeSpent, 0);

    const byDifficulty = {
      easy: mathStorage.getChallengesByDifficulty("easy"),
      medium: mathStorage.getChallengesByDifficulty("medium"),
      hard: mathStorage.getChallengesByDifficulty("hard"),
    };

    return {
      totalChallenges: challenges.length,
      averageAccuracy: avgAccuracy,
      bestSpeed: bestSpeed.toFixed(1),
      totalTimeSpent: totalTime,
      byDifficulty: {
        easy: {
          completed: byDifficulty.easy.length,
          accuracy: byDifficulty.easy.length > 0 ? Math.round(byDifficulty.easy.reduce((sum, c) => sum + c.accuracy, 0) / byDifficulty.easy.length) : 0,
        },
        medium: {
          completed: byDifficulty.medium.length,
          accuracy: byDifficulty.medium.length > 0 ? Math.round(byDifficulty.medium.reduce((sum, c) => sum + c.accuracy, 0) / byDifficulty.medium.length) : 0,
        },
        hard: {
          completed: byDifficulty.hard.length,
          accuracy: byDifficulty.hard.length > 0 ? Math.round(byDifficulty.hard.reduce((sum, c) => sum + c.accuracy, 0) / byDifficulty.hard.length) : 0,
        },
      },
    };
  },

  getWeeklyStats: () => {
    const challenges = mathStorage.getChallenges();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = Array(7)
      .fill(0)
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split("T")[0];
        const daysChallenges = challenges.filter((c) => {
          const challengeDate = new Date(c.timestamp).toISOString().split("T")[0];
          return challengeDate === dateStr;
        });
        return daysChallenges.reduce((sum, c) => sum + c.score, 0);
      });

    return weeklyData;
  },
};

// User Statistics
const updateStats = () => {
  const stats: UserStats = {
    totalMoodEntries: moodStorage.getMoods().length,
    totalJournalEntries: journalStorage.getEntries().length,
    logicalChallengesCompleted: logicalStorage.getCompletedCount(),
    creativeSubmissions: creativityStorage.getSubmissions().length,
    mathChallengesCompleted: mathStorage.getChallenges().length,
    currentStreak: calculateStreak(),
    lastActivityDate: new Date().toISOString().split("T")[0],
  };

  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
};

export const statsStorage = {
  getStats: (): UserStats => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (!data) {
      updateStats();
      return statsStorage.getStats();
    }
    return JSON.parse(data);
  },

  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};

// Helper function to calculate current streak
const calculateStreak = (): number => {
  const moods = moodStorage.getMoods();
  if (moods.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split("T")[0];

    if (moods.some((m) => m.date === dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
};

// Export all storage modules
export default {
  mood: moodStorage,
  journal: journalStorage,
  logical: logicalStorage,
  creativity: creativityStorage,
  math: mathStorage,
  stats: statsStorage,
};
