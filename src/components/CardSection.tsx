import React, { useState } from "react";
import { Volume2, Mic, Edit3, Sparkles, CheckCircle2 } from "lucide-react";
import { JamoCard, WordCard, CardCategory } from "../types";
import { CONSONANT_CARDS, VOWEL_CARDS, SYLLABLE_CARDS, WORD_CARDS } from "../data/hangulData";

interface CardSectionProps {
  onSpeak: (text: string) => void;
  onVoicePractice: (targetText: string) => void;
  onSelectHandwriting: (targetText: string) => void;
  learnedCardIds: string[];
  onMarkCardLearned: (cardId: string) => void;
}

export const CardSection: React.FC<CardSectionProps> = ({
  onSpeak,
  onVoicePractice,
  onSelectHandwriting,
  learnedCardIds,
  onMarkCardLearned,
}) => {
  const [activeCategory, setActiveCategory] = useState<CardCategory>("consonants");
  const [activeWordTheme, setActiveWordTheme] = useState<"all" | "animals" | "fruits" | "school" | "family_daily">("all");

  const categories: { id: CardCategory; label: string; icon: string }[] = [
    { id: "consonants", label: "자음 (ㄱㄴㄷ)", icon: "🧩" },
    { id: "vowels", label: "모음 (ㅏㅑㅓ)", icon: "🎵" },
    { id: "syllables", label: "기초 음절 (가나다)", icon: "🔤" },
    { id: "animals", label: "초등 낱말 카드", icon: "📚" },
  ];

  const wordThemes: { id: "all" | "animals" | "fruits" | "school" | "family_daily"; label: string; icon: string }[] = [
    { id: "all", label: "전체 낱말", icon: "🌈" },
    { id: "animals", label: "동물 🐶", icon: "🐶" },
    { id: "fruits", label: "과일 🍎", icon: "🍎" },
    { id: "school", label: "학용품 ✏️", icon: "✏️" },
    { id: "family_daily", label: "가족 👨‍👩‍👧", icon: "👨‍👩‍👧" },
  ];

  const renderJamoCards = (cards: JamoCard[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const isLearned = learnedCardIds.includes(card.id);
        return (
          <div
            key={card.id}
            className="group relative rounded-[28px] p-4 bg-white/70 backdrop-blur-md border border-white/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-between"
          >
            {/* Learned badge */}
            {isLearned && (
              <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white p-1 rounded-full shadow-xs" title="학습 완료!">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}

            <div className="text-3xl my-1">{card.emoji}</div>

            {/* Huge Typography */}
            <div
              onClick={() => {
                onSpeak(`${card.char}! ${card.name}`);
                onMarkCardLearned(card.id);
              }}
              className="text-6xl font-black my-2 cursor-pointer transition-transform group-hover:scale-110 tracking-tight text-center text-slate-900 group-hover:text-blue-600"
              title="클릭하여 소리 듣기"
            >
              {card.char}
            </div>

            <div className="text-center font-bold text-base mb-1 text-slate-800">
              {card.name} <span className="text-xs opacity-70">({card.soundSpelling})</span>
            </div>

            <div className="text-[11px] bg-slate-100/80 px-2.5 py-0.5 rounded-full font-semibold mb-3 text-slate-600 border border-slate-200/50">
              예: {card.exampleWord}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1.5 w-full pt-2.5 border-t border-slate-200/60">
              <button
                onClick={() => {
                  onSpeak(`${card.char}! ${card.name}! ${card.exampleWord}`);
                  onMarkCardLearned(card.id);
                }}
                className="py-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs shadow-2xs flex flex-col items-center justify-center gap-0.5 border border-slate-200 active:scale-95 transition-transform"
                title="소리 듣기 (TTS)"
              >
                <Volume2 className="w-4 h-4 text-blue-500" />
                <span>듣기</span>
              </button>

              <button
                onClick={() => {
                  onVoicePractice(card.char);
                  onMarkCardLearned(card.id);
                }}
                className="py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-2xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
                title="소리 내어 말해보기 (Gemini AI 피드백)"
              >
                <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>말하기</span>
              </button>

              <button
                onClick={() => onSelectHandwriting(card.char)}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-2xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
                title="따라 쓰기 연습"
              >
                <Edit3 className="w-4 h-4 text-slate-300" />
                <span>쓰기</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWordCards = () => {
    const filteredWords =
      activeWordTheme === "all"
        ? WORD_CARDS
        : WORD_CARDS.filter((w) => w.category === activeWordTheme);

    return (
      <div className="space-y-4">
        {/* Word Theme Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60">
          {wordThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveWordTheme(theme.id)}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                activeWordTheme === theme.id
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-105"
                  : "bg-white/60 text-slate-700 hover:bg-white/90 border border-white/80"
              }`}
            >
              <span>{theme.label}</span>
            </button>
          ))}
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWords.map((card) => {
            const isLearned = learnedCardIds.includes(card.id);
            return (
              <div
                key={card.id}
                className="group relative rounded-[28px] p-5 bg-white/70 backdrop-blur-md border border-white/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Learned indicator */}
                {isLearned && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-xs" title="학습 완료!">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{card.emoji}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-600">
                    {card.category === "animals"
                      ? "동물"
                      : card.category === "fruits"
                      ? "과일"
                      : card.category === "school"
                      ? "학용품"
                      : "가족/일상"}
                  </span>
                </div>

                {/* Word Display with Syllables */}
                <div
                  onClick={() => {
                    onSpeak(card.word);
                    onMarkCardLearned(card.id);
                  }}
                  className="cursor-pointer my-2"
                  title="클릭해서 발음 듣기"
                >
                  <div className="text-4xl font-black tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors">
                    {card.word}
                  </div>
                  {/* Syllables breakdown */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {card.syllables.map((syllable, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 bg-blue-50/80 rounded-lg text-xs font-bold text-blue-700 border border-blue-100 shadow-2xs"
                      >
                        {syllable}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium my-2 bg-white/60 p-2.5 rounded-xl border border-white/80">
                  "{card.exampleSentence}"
                </p>

                {/* Card Controls */}
                <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-200/60 mt-2">
                  <button
                    onClick={() => {
                      onSpeak(`${card.word}! ${card.exampleSentence}`);
                      onMarkCardLearned(card.id);
                    }}
                    className="py-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs shadow-2xs flex flex-col items-center justify-center gap-0.5 active:scale-95 border border-slate-200"
                  >
                    <Volume2 className="w-4 h-4 text-blue-500" />
                    <span>소리듣기</span>
                  </button>

                  <button
                    onClick={() => {
                      onVoicePractice(card.word);
                      onMarkCardLearned(card.id);
                    }}
                    className="py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-2xs flex flex-col items-center justify-center gap-0.5 active:scale-95"
                  >
                    <Mic className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span>말하기</span>
                  </button>

                  <button
                    onClick={() => onSelectHandwriting(card.word)}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-2xs flex flex-col items-center justify-center gap-0.5 active:scale-95"
                  >
                    <Edit3 className="w-4 h-4 text-slate-300" />
                    <span>따라쓰기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 border border-white/80 shadow-xl my-6">
      {/* Primary Category Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/80 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">📖</span>
          <h2 className="text-xl font-black text-slate-900">한글 소리 & 낱말 카드</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                activeCategory === cat.id
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-105"
                  : "bg-white/60 hover:bg-white/90 backdrop-blur-md text-slate-700 border border-white/80"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Content Area */}
      {activeCategory === "consonants" && renderJamoCards(CONSONANT_CARDS)}
      {activeCategory === "vowels" && renderJamoCards(VOWEL_CARDS)}
      {activeCategory === "syllables" && renderJamoCards(SYLLABLE_CARDS)}
      {activeCategory === "animals" && renderWordCards()}
    </section>
  );
};
