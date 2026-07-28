export type CardCategory = "consonants" | "vowels" | "syllables" | "animals" | "fruits" | "school" | "family_daily";

export interface JamoCard {
  id: string;
  char: string;
  type: "consonant" | "vowel" | "syllable";
  name: string; // e.g. "기역", "니은", "아"
  soundSpelling: string; // e.g. "[g]", "[n]"
  exampleWord: string; // e.g. "강아지"
  emoji: string;
  bgColor: string;
  strokeGuideSvg?: string;
}

export interface WordCard {
  id: string;
  word: string;
  category: "animals" | "fruits" | "school" | "family_daily";
  syllables: string[];
  emoji: string;
  bgColor: string;
  exampleSentence: string;
  hint: string;
}

export interface HandwritingItem {
  id: string;
  targetText: string;
  categoryName: string;
  guideType: "jamo" | "word";
  hints: string[];
}

export interface QuizItem {
  id: string;
  targetWord: string;
  options: string[];
  correctIndex: number;
  emojiHint: string;
  questionAudioText: string;
}

export interface Sticker {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badgeBg: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StudentProfile {
  name: string;
  stars: number;
  unlockedStickerIds: string[];
  learnedCardIds: string[];
  handwritingCount: number;
  quizCorrectCount: number;
  quizTotalCount: number;
  studyStartTime: number; // timestamp
}

export interface LearningLog {
  studentName: string;
  date: string; // e.g. "2026-07-28 10:15"
  learnedWordsCount: number;
  quizAccuracy: string; // e.g. "80% (4/5)"
  handwritingCount: number;
  durationMinutes: number;
  timestamp: number;
}

export interface AppSettings {
  geminiApiKey: string;
  gasWebAppUrl: string;
  ttsSpeed: number; // 0.7 ~ 1.2
  ttsPitch: number; // 0.8 ~ 1.3
}
